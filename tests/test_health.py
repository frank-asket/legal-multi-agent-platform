from fastapi.testclient import TestClient

from server.main import app

client = TestClient(app)


def test_health_ok() -> None:
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_ready_ok() -> None:
    r = client.get("/health/ready")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ready"
    assert "openrouter_configured" in body
