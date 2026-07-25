FROM python:3-slim
WORKDIR /app
COPY app/requirements.txt .
RUN pip install -r requirements.txt
COPY app/. .
RUN mkdir -p /data
ENV TAM_DATA_DIR=/data
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
CMD ["fastapi", "run", "--port=8000"]
