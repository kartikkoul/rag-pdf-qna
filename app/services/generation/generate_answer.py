import random
from openai import Omit, OpenAI

from app.env_vars import OPENROUTER_API_KEY

#System prompt
SYSTEM_PROMPT = f"""You are an PDF QnA AI assistant bot. Answer the query using ONLY the context provided.

Rules
1. Don't provide answer to what is not provided in context. Specify clearly you don't have the information in a one liner.
2. If you find an answer, provide citations on the basis of you are answering the query in a user readable way, not in any JSON format.
"""

GREETINGS_POOL = [
    "Hey there! 👋 What can I help you with today?",
    "Welcome! Ready to explore your documents?",
    "Hi! Ask me anything about your uploaded files.",
    "Hello! Let’s dive into your documents.",
    "Good to see you! What would you like to know?",
]

def get_random_greeting():
    return random.choice(GREETINGS_POOL)

ai_client = OpenAI(api_key=OPENROUTER_API_KEY, base_url="https://openrouter.ai/api/v1")
model="openai/gpt-oss-120b"

def generate_answer( query: str, temperature: int = 0.2, top_p: int = 0.2, max_tokens: int = 500):   
        response = ai_client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content":query}
            ],
            temperature=temperature,
            top_p=top_p,
            max_tokens=max_tokens
        )


        # print("PROMPT_TOKENS_USAGE:: ", response.usage.prompt_tokens)
        # print("COMPLETION_TOKENS_USAGE:: ", response.usage.completion_tokens)
        # print("TOTAL_TOKENS_USAGE:: ", response.usage.total_tokens)

        return response.choices[0].message.content