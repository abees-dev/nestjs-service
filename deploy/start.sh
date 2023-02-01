#!/bin/bash

cd /SERVICE

CONFIG_ARGS="s|CONFIG_PORT|${CONFIG_PORT}|g;\
        	s|CONFIG_MONGO_URI|${CONFIG_MONGO_URI}|g;\
        	s|CONFIG_PREFIX|${CONFIG_PREFIX}|g;\
        	s|CONFIG_ACCESS_TOKEN_SECRET|${CONFIG_ACCESS_TOKEN_SECRET}|g;\
        	s|CONFIG_REFRESH_TOKEN_SECRET|${CONFIG_REFRESH_TOKEN_SECRET}|g;\
        	s|CONFIG_GOOGLE_CLIENT_ID|${CONFIG_GOOGLE_CLIENT_ID}|g;\
        	s|CONFIG_GOOGLE_CLIENT_SECRET|${CONFIG_GOOGLE_CLIENT_SECRET}|g;\
        	s|CONFIG_GOOGLE_CALLBACK_URL|${CONFIG_GOOGLE_CALLBACK_URL}|g;\
			s|CONFIG_PASSWORD_DEFAULT|${CONFIG_PASSWORD_DEFAULT}|g"

sed -i -e "$CONFIG_ARGS" .env

yarn start

exec "$@"