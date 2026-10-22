import asyncio
from types import SimpleNamespace
import pytest
from fastapi import HTTPException
from pydantic import ValidationError
from app import ai
from app.demo import demo
from app.models import Explanation, Extraction

def stub(monkeypatch,responses):
    calls=[]
    class Client:
        def __init__(self,**kwargs):
            self.chat=SimpleNamespace(completions=self)
        async def create(self,**kwargs):
            calls.append(kwargs)
            return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content=responses.pop(0)))])
        async def close(self):pass
    monkeypatch.setenv('OPENROUTER_API_KEY','test-only-not-a-real-key')
    monkeypatch.setattr(ai,'AsyncOpenAI',Client)
    return calls

def test_repair_once(monkeypatch):
    calls=stub(monkeypatch,['not json',demo('projectile_motion').model_dump_json()])
    result=asyncio.run(ai.structured('exercise'))
    assert result.exercise_type=='projectile_motion'
    assert len(calls)==2

def test_repair_failure_controlled(monkeypatch):
    calls=stub(monkeypatch,['{}','bad'])
    with pytest.raises(HTTPException) as e:asyncio.run(ai.structured('exercise'))
    assert e.value.status_code==502 and len(calls)==2

def test_missing_required_values_marked():
    payload=demo('free_fall').model_dump();del payload['parameters']['initial_height']
    assert 'initial_height' in Extraction.model_validate(payload).missing_parameters

def test_ai_cannot_override_with_digits():
    with pytest.raises(ValidationError):Explanation(steps=['The range is 99 m'])

def test_schema_rejects_nonfinite_and_unknown():
    payload=demo('free_fall').model_dump();payload['parameters']['gravity']['value']=float('inf')
    with pytest.raises(ValidationError):Extraction.model_validate(payload)
    payload=demo('free_fall').model_dump();payload['parameters']['mass']=payload['parameters']['gravity']
    with pytest.raises(ValidationError):Extraction.model_validate(payload)

def test_unsupported_classification():
    parsed=Extraction(supported=False,exercise_type='unsupported',language='fr',original_text='Un circuit électrique',summary='Unsupported',parameters={},requested_outputs=[],missing_parameters=[],warnings=[])
    assert not parsed.supported
