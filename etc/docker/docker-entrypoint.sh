#!/usr/bin/env bash

set -e

if [ "$ENV" == 'staging' ]; then
    perl -pi -e 's/rehive.com/staging.rehive.com/g' /usr/share/nginx/html/scripts/*
fi
exec "$@"
