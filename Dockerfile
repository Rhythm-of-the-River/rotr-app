FROM python:3.13.7-slim

WORKDIR /app
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA

# Optionally set up for redis backend
# ENV REDIS_URL="redis://10.196.103.11:6379"
# ENV REFLEX_IGNORE_REDIS_CONFIG_ERROR=True
ENV PYTHONUNBUFFERED=1
ENV REFLEX_ENV=production

CMD ["reflex", "run", "--env", "prod", "--backend-only", "--backend-port", "8080"]
