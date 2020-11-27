# hackbox_server
The back-end of the Hackbox webapp.
Built using Express and Dockerode.

## Setup
1. `npm install`
2. Create a .env file in this directory, and set the values according to the example below.
Example:
```
PORT=3701
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
ENABLE_GOTTY=true
GOTTY_PORT=3702
GOTTY_URL=http://localhost:3702
```
(Check `db_setup.js` to see how `GOTTY_URL` is used.)

3. Run `npm start` to start the API server.
