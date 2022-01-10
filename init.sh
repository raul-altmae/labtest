#!/bin/sh
PHP=$1 || php

echo '\nInstalling\033[01;33m Composer \033[0m'
$PHP composer install

echo '\nInstalling\033[01;33m Drupal \033[0m'
cd web/
$PHP ../vendor/bin/drush site-install weprofile
$PHP ../vendor/bin/drush locale-update
$PHP ../vendor/bin/drush cache-rebuild
