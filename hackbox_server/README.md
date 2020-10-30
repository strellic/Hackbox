# hackbox_server
The back-end of the Hackbox webapp.
Built using Express and Dockerode.

## Setup
1. `npm install`
2. Create a .env file in this directory, and set the values according to the example below.
Example:
```
PORT=4001
MONGO_USER=hackbox
MONGO_PASS=mongo_pass
MONGO_IP=127.0.0.1:27017
MONGO_DBNAME=hackbox
JWT_SECRET=jwt_secret
BOX_DURATION=60
ORIGIN=https://hackbox.example.com
OPENVPN_CA_PASS=ca_pass
OPENVPN_VOLUME=ovpn-data-hackbox
OPENVPN_SERVER=vpn.example.com
```
3. Run `npm start` to start the API server.
