# hackbox_rooms
Some example boxes to show you how to create vulnerable Docker images. Feel free to remix and modify these images to create your own Hackbox rooms!

This folder contains `ubuntu_php_base`, a version of `phusion/baseimage` with Nginx and PHP loaded on startup. It also contains `hackbox_example_room` and `hackbox_kali`, which are the two example rooms provided.

This part of the repo is optional if you just want to test the platform out. Hackbox rooms can be set to any Docker image, local or on Docker Hub.

NOTE:
Since containers are accessed via a VPN, ports do not need to be exposed in the Dockerfile. Hackbox's OVPN client will take care of all of the networking.