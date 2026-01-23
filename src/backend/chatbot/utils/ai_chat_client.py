from openai import OpenAI
from django.conf import settings
import json
import os
from openai import OpenAIError

api_key = os.getenv('OPENAI_API_KEY')  # Treba stavi api key u .env

if not api_key:
    raise ValueError(
        "Nedostaje OPENAI_API_KEY u .env file-u."
        )
client = OpenAI(api_key=api_key)  # Inicijaliziramo OpenAI model

SYSTEM_MESSAGE = {
    "role": "system",
    "content": "The response must be in Croatian and use Markdown format. Also write currency in EURO.",
}

def ai_chat(message_or_messages, transactions, expenses):
    """
    Pozove OpenAI i vrati dict {"message": "..."} prema json_schema formatu.

    - Ako je argument string: tretira se kao jedna user poruka.
    - Ako je argument lista: tretira se kao OpenAI `messages` history (dictovi s role/content).
    """

    if isinstance(message_or_messages, list):
        messages = message_or_messages
    else:
        messages = [{"role": "user", "content": message_or_messages, }]

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[SYSTEM_MESSAGE, *messages, *transactions, *expenses], 
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
            timeout=30.0,
        )
    except OpenAIError as e:
        raise RuntimeError(f"OpenAI API poziv nije uspio: {str(e)}") from e

    try:
        result = json.loads(response.choices[0].message.content)
    except (json.JSONDecodeError, KeyError, IndexError) as e:
        raise RuntimeError(f"Neuspjelo parsanje openAI odgovora: {str(e)}") from e
    return result
