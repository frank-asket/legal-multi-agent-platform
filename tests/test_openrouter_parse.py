import pytest

from legal_multi_agent.openrouter import extract_json_object


def test_extract_json_object_raw() -> None:
    assert extract_json_object('{"a": 1}') == {"a": 1}


def test_extract_json_object_fenced() -> None:
    text = '```json\n{"faithful": true}\n```'
    assert extract_json_object(text) == {"faithful": True}


def test_extract_json_object_prefixed_junk() -> None:
    text = 'Here you go:\n{"x": "y"}\nThanks'
    assert extract_json_object(text) == {"x": "y"}


def test_extract_json_object_invalid() -> None:
    with pytest.raises(ValueError):
        extract_json_object("no json here")
