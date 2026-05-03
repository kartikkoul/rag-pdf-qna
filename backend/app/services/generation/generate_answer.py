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

Always format responses as valid GitHub-Flavored Markdown (GFM). Output the markdown
source directly (do NOT wrap the whole answer in a code fence):

- Use `##` or `###` for section headings (never use `#` alone for the whole answer).
- Whenever you list two or more items, you MUST format them as a real markdown list:
  - Each item starts on its own line and begins with `- ` (hyphen + space) for bullets,
    or `1. ` `2. ` `3. ` for numbered/ordered items.
  - Put exactly one blank line BEFORE the first list item and one blank line AFTER the
    last list item.
  - Never write list items as a continuous paragraph and never use `–`, `•`, or `*` as
    bullet markers — use `-` only.
- Separate paragraphs with a blank line. Do not concatenate sentences that should be on
  separate lines.
- Use **bold** for key terms and `inline code` for exact labels, identifiers, or values
  from the document.
- For multi-line code or verbatim excerpts, use fenced code blocks with a language tag:

  ```text
  ...
  ```

- Always close every `**`, `` ` ``, and ``` ``` ``` pair you open.
- Citations such as 【source: file.pdf, page 11】 should appear inline at the end of the
  sentence they support, not on a line of their own.

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