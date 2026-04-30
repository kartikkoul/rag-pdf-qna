# Base image
FROM python:3.13-slim

# Install system deps + uv
RUN apt-get update && apt-get install -y curl build-essential \
    && rm -rf /var/lib/apt/lists/*

# RUN curl -Ls https://astral.sh/uv/install.sh | bash
# ENV PATH="/root/.cargo/bin:$PATH"

RUN pip install uv

WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependncies
RUN uv sync --frozen

# Copy rest of the source code
COPY . .


EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]