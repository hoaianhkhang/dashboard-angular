#!/usr/bin/env bash

set -e

perl -pi -e 's/\{\{API_URL\}\}/$ENV{'API_URL'}/g' /usr/share/nginx/html/scripts/*
perl -pi -e 's/\{\{INTERCOM_APPID\}\}/$ENV{'INTERCOM_APPID'}/g' /usr/share/nginx/html/scripts/*

exec "$@"
