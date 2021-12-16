#!/bin/sh

npm install

sudo apt-get install openssl
sudo apt-get install libssl-dev

certificatePath = "ssl"

if [[ ! -d "$tcertificatePath" ]]; then
  mkdir "$tcertificatePath"
  cd "$tcertificatePath"
  openssl genrsa -out key.pem
  openssl req -new -key key.pem -out csr.pem
  openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
  rm csr.pem
fi
