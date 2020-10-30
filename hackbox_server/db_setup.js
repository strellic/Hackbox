import mongoose	from "mongoose";
import Room from "./models/Room.js";

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
			markdown: "This room is an example room to show you how to use Hackbox. Launch a room and get the flag!"
		});
		room.save();
	}
}