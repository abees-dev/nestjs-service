FROM node:latest


# COPY ["SERVICE.tgz", "/SERVICE.tgz"]
COPY ["env", "/app/.env"]
COPY ["start.sh", "/start.sh"]
RUN chmod -R 777 /start.sh

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build


ENTRYPOINT ["/start.sh"]