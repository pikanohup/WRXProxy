#!/bin/sh

npm install

sudo apt-get install openssl
sudo apt-get install libssl-dev

certificatePath="$PWD/ssl"

if [[ ! -d "$certificatePath" ]]; then
  echo "$certificatePath"
  mkdir "$certificatePath"
  cd "$certificatePath"
  echo "$PWD"
  openssl genrsa -out key.pem
  openssl req -new -key key.pem -out csr.pem
  openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
  rm csr.pem
fi
