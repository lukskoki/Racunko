from openai import OpenAI
from django.conf import settings
import json
import os

api_key = os.getenv('OPENAI_API_KEY')  # Treba stavi api key u .env

client = OpenAI(api_key=api_key)  # Inicijaliziramo OpenAI model


def ai_chat(message):
    """Pozove OpenAI i vrati dict {"message": "..."} prema json_schema formatu."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "Return a JSON object that matches the provided JSON schema. Field 'message' must be a string.",
            },
            {"role": "user", "content": message},
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "message",
                "strict": True,  # Garantiramo da ce odgovor bit prema shemi
                "schema": {
                    "type": "object",
                    "properties": {
                        "message": {
                            "type": "string",
                            "description": "A response to a question or statement",
                        }
                    },
                    "required": ["message"],
                    "additionalProperties": False,  # Da osiguramo da ne doda extra polja
                },
            },
        },
        temperature=0.1,  # Stavimo niski temperature jer ne zelimo da pocne izmisljat
    )

    result = json.loads(response.choices[0].message.content)

    return result
