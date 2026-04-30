from fastapi import Request
from openai import OpenAI

from app.env_vars import OPENROUTER_API_KEY

#System prompt
SYSTEM_PROMPT = f"""You are an PDF QnA AI assistant bot. Answer the query using ONLY the context provided.

Rules
1. Don't provide answer to what is not provided in context. Specify clearly you don't have the information in a one liner.
2. If you find an answer, provide citations on the basis of you are answering the query in a user readable way, not in any JSON format.
3. DO NOT USE EXTERNAL KNOWLEDGE.
4. MAKE SURE SENTENCE or SENTENCES ARE COMPLETE.
5. TRY TO WIND DOWN ANSWERS WITHIN 1000 TOKENS

Always format responses using clear structure in a valid Markdown format:
- Use bullet points for lists
- Use line breaks between sections
- Use headings when needed
- Avoid long paragraphs
- Keep answers readable

If listing features, ALWAYS use bullet points.
"""

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

        return response.choices[0].message.content


async def generate_answer_stream(
    query: str,
    temperature: float = 0.2,
    top_p: float = 0.2,
    max_tokens: int = 500,
    req: Request = None,
):
    stream = ai_client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": query},
        ],
        temperature=temperature,
        top_p=top_p,
        max_tokens=max_tokens,
        stream=True,
    )

    try:
        for chunk in stream:
            if req and await req.is_disconnected():
                print("Client disconnected → closing stream")
                if hasattr(stream, "close"):
                    stream.close()
                break

            token = chunk.choices[0].delta.content or ""
            if token:
                yield token

    except Exception as e:
        print("Stream error:", e)

    finally:
        if hasattr(stream, "close"):
            stream.close()