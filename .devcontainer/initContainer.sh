#!/bin/bash

echo "Install Ruby dependencies"
bundle install;
bundle exec rake db:create ||true;
bundle exec rake db:migrate
echo "Install Infra dependencies"
cd infra
source /usr/local/share/nvm/nvm.sh
nvm install
npm ci
echo "Installation Completeted"