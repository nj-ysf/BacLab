import io
import pytest
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app, rates
from app.models import Extraction

@pytest.fixture(autouse=True)
def setup(monkeypatch):
    monkeypatch.delenv('OPENROUTER_API_KEY',raising=False);rates.clear()
client=TestClient(app)
def test_health():assert client.get('/api/health').json()['ai_configured'] is False
@pytest.mark.parametrize('kind',['projectile_motion','free_fall','uniform_motion'])
def test_examples(kind):
    r=client.post('/api/analyze',json={'demo_id':kind});assert r.status_code==200;assert Extraction.model_validate(r.json()).exercise_type==kind
def test_empty():assert client.post('/api/analyze',json={}).status_code==422
def test_custom_demo_not_fake():assert client.post('/api/analyze',json={'text':'electricity'}).status_code==503
def test_invalid_image():assert client.post('/api/analyze',files={'image':('bad.png',b'not image','image/png')}).status_code==415
def test_wrong_mime():assert client.post('/api/analyze',files={'image':('x.gif',b'x','image/gif')}).status_code==415
def test_real_photo_demo():
    f=io.BytesIO();Image.new('RGB',(20,20)).save(f,format='PNG')
    assert client.post('/api/analyze',files={'image':('x.png',f.getvalue(),'image/png')}).status_code==503
def test_oversize():assert client.post('/api/analyze',content=b'x'*(8*1024*1024+65537)).status_code==413
def test_explain_preserves():
    data={'exercise_type':'uniform_motion','parameters':{'speed':15,'initial_position':0,'duration':10},'results':{'distance':150},'language':'ar'}
    r=client.post('/api/explain',json=data);assert r.status_code==200;assert r.json()['results']==data['results']
    data['parameters']['duration']=-1;assert client.post('/api/explain',json=data).status_code==422
def test_rate_limit():
    for _ in range(20):client.post('/api/analyze',json={})
    assert client.post('/api/analyze',json={}).status_code==429
