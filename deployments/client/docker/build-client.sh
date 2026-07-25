# docker compose build
source ../../version.env
docker image tag dbob16/tam-client:latest dbob16/tam-client:${TAM_VERSION}
mkdir -p dist/images
docker image save dbob16/tam-client:${TAM_VERSION} | gzip > dist/images/tam-client-${TAM_VERSION}.tar.gz
echo "TAM_VERSION=${TAM_VERSION}" > dist/prod.env
echo "HOST=127.0.0.1" >> dist/prod.env
echo "PORT=3000" >> dist/prod.env
