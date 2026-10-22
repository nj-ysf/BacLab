"""Exercise the actual OpenAI SDK serialization against a mock OpenRouter transport."""
import io
import json

import httpx
import pytest
from fastapi.testclient import TestClient
from openai import AsyncOpenAI
from PIL import Image

from app import ai
from app.demo import demo
from app.main import app, cache, rates


@pytest.fixture(autouse=True)
def configuration(monkeypatch):
    monkeypatch.setenv('OPENROUTER_API_KEY', 'test-openrouter-key')
    monkeypatch.delenv('OPENROUTER_MODEL', raising=False)
    cache.clear()
    rates.clear()


def transport(monkeypatch, payload, status=200):
    requests = []

    def handle(request):
        requests.append(request)
        if status != 200:
            return httpx.Response(status, json={'error': {'message': 'private upstream details'}})
        return httpx.Response(200, json={
            'id': 'mock-completion', 'object': 'chat.completion', 'created': 0,
            'model': ai.model_name(),
            'choices': [{'index': 0, 'finish_reason': 'stop',
                         'message': {'role': 'assistant', 'content': json.dumps(payload)}}],
        })

    def client(**kwargs):
        return AsyncOpenAI(**kwargs, http_client=httpx.AsyncClient(transport=httpx.MockTransport(handle)))

    monkeypatch.setattr(ai, 'AsyncOpenAI', client)
    return requests


def test_text_request_uses_openrouter_and_configured_model(monkeypatch):
    monkeypatch.setenv('OPENROUTER_MODEL', 'test/vision-model')
    calls = transport(monkeypatch, demo('projectile_motion').model_dump())
    with TestClient(app) as client:
        response = client.post('/api/analyze', json={'text': 'Custom projectile exercise'})
    assert response.status_code == 200
    assert len(calls) == 1
    assert str(calls[0].url) == 'https://openrouter.ai/api/v1/chat/completions'
    assert calls[0].headers['authorization'] == 'Bearer test-openrouter-key'
    body = json.loads(calls[0].content)
    assert body['model'] == 'test/vision-model'
    assert body['response_format'] == {'type': 'json_object'}
    assert body['provider'] == {'require_parameters': True}
    assert 'thinking' not in body


def test_photo_is_sent_as_inline_image(monkeypatch):
    calls = transport(monkeypatch, demo('free_fall').model_dump())
    image = io.BytesIO()
    Image.new('RGB', (20, 20)).save(image, format='PNG')
    with TestClient(app) as client:
        response = client.post('/api/analyze', files={'image': ('exercise.png', image.getvalue(), 'image/png')})
    assert response.status_code == 200
    content = json.loads(calls[0].content)['messages'][1]['content']
    assert content[1]['type'] == 'image_url'
    assert content[1]['image_url']['url'].startswith('data:image/jpeg;base64,')


@pytest.mark.parametrize('upstream_status,expected_status', [(400, 502), (401, 502), (402, 502), (403, 502), (404, 502), (429, 429), (500, 502)])
def test_provider_errors_are_controlled(monkeypatch, upstream_status, expected_status):
    calls = transport(monkeypatch, {}, status=upstream_status)
    with TestClient(app) as client:
        response = client.post('/api/analyze', json={'text': 'Custom exercise'})
    assert response.status_code == expected_status
    assert 'OpenRouter' in response.json()['detail']
    assert 'private upstream details' not in response.text
    assert len(calls) == 1


def test_ai_explanation_preserves_engine_results(monkeypatch):
    transport(monkeypatch, {'steps': ['La distance augmente avec la vitesse à durée fixée.']})
    results = {'distance': 150}
    with TestClient(app) as client:
        response = client.post('/api/explain', json={
            'exercise_type': 'uniform_motion',
            'parameters': {'initial_position': 0, 'speed': 15, 'duration': 10},
            'results': results, 'language': 'fr',
        })
    assert response.status_code == 200
    assert response.json()['results'] == results
    assert response.json()['source'] == 'ai_commentary'


def test_blank_key_keeps_demo_mode(monkeypatch):
    monkeypatch.setenv('OPENROUTER_API_KEY', '  ')
    with TestClient(app) as client:
        health = client.get('/api/health').json()
        assert health['ai_configured'] is False
        assert health['ai_provider'] == 'openrouter'
        assert health['ai_model'] == 'google/gemini-2.5-flash'
        assert client.post('/api/analyze', json={'demo_id': 'uniform_motion'}).status_code == 200
        response = client.post('/api/analyze', json={'text': 'Custom exercise'})
    assert response.status_code == 503
    assert 'OPENROUTER_API_KEY' in response.json()['detail']
