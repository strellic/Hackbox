import mongoose	from "mongoose";
import Room from "./models/Room.js";
import dotenv from "dotenv";

dotenv.config();

export default async function() {
	let rooms = await Room.find({});
	if(rooms.length === 0) {
		let room = new Room({
			name: "hackbox_example_room",
			displayName: "Hackbox Example Room",
			difficulty: 1,
			shortDescription: "An example room to test Hackbox.",
			images: [
				"strellic/hackbox_example_room"
			],
			flags: [
				{name: "Website Flag", flag: "hackbox{welcome_to_hackbox!!!}"}
			],
			markdown: "This room is an example room to show you how to use Hackbox. Launch a room and get the flag!",
			successMsg: "You completed the example room! Now, explore the other rooms and have fun!" // optional message
		});
		room.save();

		let room2 = new Room({
		    images: [
		        "strellic/hackbox_kali"
		    ],
		    name: "hackbox_kali",
		    displayName: "Kali Hackbox",
		    difficulty: 0,
		    shortDescription: "A room to give you a Kali Hackbox.",
		    flags: [],
		    markdown: "This room has a box which will give you your own Kali test room that is already connected to our internal network!\n\nThe box has tools like `gobuster`, `sqlmap`, and `netcat`, as well as many wordlists in `/usr/share/wordlists`. If you want something like `metasploit`, you should learn how to use Kali with a VM or dual boot!\n\nLaunch the box, and run the following command: `ssh -o UserKnownHostsFile=/dev/null user@[IP]`. The password for `user` is `h4ckb0x`."
		});

		if(process.env.ENABLE_GOTTY === "true")
			room2.html = `<p>Or, if you don't want to set SSH, you can access this box via a webshell!</p><iframe src='${process.env.GOTTY_URL}?arg={USERNAME}' class='webshell'></iframe>`;

		room2.save();
	}
}