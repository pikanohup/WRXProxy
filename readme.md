# WRXProxy

## Deployment

### Linux

#### Get source code and build

```
git clone https://github.com/pikapikapikachuuu/WRXProxy.git
cd WRXProxy && npm install
```

Remember to create the configuration file `config.json`. See the example file `config.example.json` to assist you with creating your configuration.

#### Start WebSocket service

You can simply run `cd WRXProxy && npm run start`.

Or use pm2 (recommended):

```
npm install -g pm2
cd WRXProxy
pm2 start npm --name "cluster debug" -- run start
```
(To go further checkout: http://pm2.io/)

#### Deploy with nginx

Minimal example for nginx conf file:


```
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

upstream websocket {
    server localhost:8888; # websocket listening port (defined in `WRXProxy/config.json`)
}

server {
     server_name proxy.pikapikachu.xyz; # your server name
     listen 80;
     location / {
         proxy_pass http://websocket;
         proxy_read_timeout 300s;
         proxy_send_timeout 300s;

         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection $connection_upgrade;
     }
}
```

(To enable ssl: https://www.serverlab.ca/tutorials/linux/web-servers-linux/how-to-proxy-wss-websockets-with-nginx/)

Don't forget to edit the WebSocket domain in WebRandomX source code (`job.js`) and rebuild.