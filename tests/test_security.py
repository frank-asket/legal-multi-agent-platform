from fastapi.testclient import TestClient

from legal_multi_agent.settings import reset_settings_cache
from server.main import app


def test_invalid_thread_id_rejected() -> None:
    client = TestClient(app)
    r = client.post(
        "/v1/query",
        json={"user_query": "What is liability?", "thread_id": "bad thread id"},
    )
    assert r.status_code == 400
    body = r.json()
    assert body.get("detail") == "Invalid thread_id"
    assert "request_id" in body


def test_api_key_enforced_when_configured(monkeypatch) -> None:
    monkeypatch.setenv("API_KEYS", "unit-test-secret")
    reset_settings_cache()
    client = TestClient(app)
    r = client.post(
        "/v1/query",
        json={"user_query": "hello", "thread_id": "t1"},
    )
    assert r.status_code == 401
    r2 = client.post(
        "/v1/query",
        json={"user_query": "hello", "thread_id": "t1"},
        headers={"X-API-Key": "unit-test-secret"},
    )
    assert r2.status_code == 200
