#!/bin/bash
USER=$1

if [[ $USER =~ ^[a-zA-Z0-9_]+$ ]]
then
	CONTAINER="hackbox_room_${USER}_hackbox_kali_0"
	docker exec -u user -it $CONTAINER /bin/bash 2>/dev/null || echo "Refresh when the box is launched!"
else
	echo "Error: Invalid username!"
fi
