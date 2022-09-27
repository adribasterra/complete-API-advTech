cd loyalty
git checkout develop
git pull
sudo docker-compose -f docker-compose.develop.yml down
sudo docker-compose -f docker-compose.develop.yml build
sudo docker-compose -f docker-compose.develop.yml up -d
# Comando para reiniciar solamente un servicio del docker-compose
# docker-compose -f docker-compose. develop.yml up - d --no-deps --build server-pre