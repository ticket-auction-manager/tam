FROM node:24-slim
WORKDIR /app
COPY . .
RUN npm install --omit=dev
RUN mkdir -p /data
ENV TAM_DATA_DIR=/data
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV BODY_SIZE_LIMIT=Infinity
CMD ["node", "build"]
