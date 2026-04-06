from fastapi.testclient import TestClient

from server.main import app

client = TestClient(app)


def test_query_returns_slim_state_and_answer() -> None:
    r = client.post(
        "/v1/query",
        json={
            "user_query": "What is the liability cap?",
            "document_ids": ["demo-doc"],
            "thread_id": "test-http",
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert "state" in body
    st = body["state"]
    assert "analyst_answer" in st
    assert st["analyst_answer"].get("plain_english")
    assert isinstance(st.get("chunks_by_document"), dict)
