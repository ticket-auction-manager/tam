# docker compose build
source ../../version.env
docker compose build
docker image tag dbob16/tam-client:latest dbob16/tam-client:${TAM_VERSION}
mkdir -p dist/images
echo "HOST=127.0.0.1" >> dist/prod.env
echo "PORT=3000" >> dist/prod.env
TAM_VERSION=${TAM_VERSION} envsubst < ./run-client.sh.template > ./dist/run-client.sh
chmod +x dist/run-client.sh
