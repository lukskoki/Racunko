from binascii import Error
import os
import json
from typing import Dict, List, Any
from openai import OpenAI
from django.conf import settings


def extract_category(image_base64, categories):
    # Funkcija koja poziva OpenAI AI model za analizu slike

    api_key = os.getenv('OPENAI_API_KEY') # Treba stavi api key u .env

    client = OpenAI(api_key=api_key) # Inicijaliziramo OpenAI model

    category_names = [cat['categoryName'] for cat in categories]

    try:
        prompt = f"""
        Analyze this receipt image and out of the categories provided, choose one and as the answer write the categroy name.
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    'role': 'user',
                    'content': [
                        {
                            "type": 'text',
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            response_format={
                "type":"json_schema",
                "json_schema": {
                    "name": "receipt_categorization",
                    "strict": True, # Garantiramo da ce odgovor bit prema shemi
                    "schema": {
                        "type": "object",
                        'properties': {
                            'amount': {
                                'type': 'number',
                                'description': 'The full amount from the receipt'
                            },
                            'category': {
                                'type': 'string',
                                'enum': category_names # Dajemo mu moguce opcije, da ne pocne sam izmisljat
                            }
                        },
                        'required': ['amount', 'category'],
                        'additionalProperties': False # Da osiguramo da ne doda extra polja
                    }
                }
            },
            temperature=0.1 # Stavimo niski temperature jer ne zelimo da pocne izmisljat
        )

        result = json.loads(response.choices[0].message.content)

        return result
    
    except Error as e:
        print(e)

    
