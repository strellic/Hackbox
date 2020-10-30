# Hackbox
Hackbox is an open-source, container-based platform that makes it easy to launch vulnerable systems to test your hacking skill!

Users can sign up on Hackbox and choose one of the host-created rooms to try and hack into. They can launch boxes, which spawn Docker containers on the host, which they can then connect to via OpenVPN.

From there, they can send attacks and hack into the box. Their goal is to exfiltrate the flags from the box, which can mean finding hidden services, exploiting systems, or privilege escalating into root.

The server owner just needs to create vulnerable Docker images, and add them to the database for users to be able to hack into them. See `hackbox_server/db_setup.js` for an example!

## Screenshots
![](https://i.gyazo.com/c89054332723fcc9e3e2af937940b7a2.png)
![](https://i.gyazo.com/d1c7e63b64714cc0bc058e6204f5e435.png)
![](https://i.gyazo.com/28fa83a752ef803053e5820899b3eda5.png)
![](https://i.gyazo.com/40e01a215da1ca370582f27a076ff33d.png)

## Setup
Before starting the setup for `hackbox_client` and `hackbox_server`, the OpenVPN Docker container system needs to be created first.

Run the following setup commands to initialize the OpenVPN docker container:
```bash
OVPN_DATA="ovpn-data-hackbox"
docker volume create --name $OVPN_DATA
docker run -v $OVPN_DATA:/etc/openvpn --rm kylemanna/openvpn ovpn_genconfig -u udp://vpn.example.com
docker run -v $OVPN_DATA:/etc/openvpn --rm kylemanna/openvpn touch /etc/openvpn/vars
docker run -v $OVPN_DATA:/etc/openvpn --rm -it kylemanna/openvpn ovpn_initpki
```
Make sure to change `vpn.example.com` to either a domain name or IP which resolves to your server. Make sure to remember the password you used to create the Certificate Authority, as you will need to set it in `hackbox_server`'s `.env` file. You can also change `OVPN_DATA`, but make sure you change it as well. 

Then, pull the necessary Docker images:
```bash
docker pull strellic/openvpn-client
docker pull strellic/hackbox_example_room # not required if you remove example room
docker pull strellic/hackbox_kali # not required if you remove kali room
```

From there, follow the setup instructions in each of the folders.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
