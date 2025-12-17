from openai import OpenAI
from django.conf import settings
import json
import os

api_key = os.getenv('OPENAI_API_KEY')  # Treba stavi api key u .env

client = OpenAI(api_key=api_key)  # Inicijaliziramo OpenAI model

_SYSTEM_MESSAGE = {
    "role": "system",
    "content": "Return a JSON object that matches the provided JSON schema. Field 'message' must be a string.",
}

def ai_chat(message_or_messages):
    """
    Pozove OpenAI i vrati dict {"message": "..."} prema json_schema formatu.

    - Ako je argument string: tretira se kao jedna user poruka.
    - Ako je argument lista: tretira se kao OpenAI `messages` history (dictovi s role/content).
    """
    if isinstance(message_or_messages, list):
        messages = message_or_messages
    else:
        messages = [{"role": "user", "content": message_or_messages}]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[_SYSTEM_MESSAGE, *messages],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "message",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "message": {
                            "type": "string",
                            "description": "A response to a question or statement",
                        }
                    },
                    "required": ["message"],
                    "additionalProperties": False,
                },
            },
        },
        temperature=0.1,
    )

    result = json.loads(response.choices[0].message.content)
    return result
