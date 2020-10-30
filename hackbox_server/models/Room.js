import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const roomSchema = Schema({
	name: {
		type: String,
		required: true
	},
	displayName: {
		type: String,
		required: true
	},
	difficulty: {
		type: Number,
		required: true
	},
	shortDescription: {
		type: String,
		required: true
	},
	images: [{
		type: String,
		required: true
	}],
	icon: {
		type: String,
		required: true,
		default: "fas fa-server"
	},
	flags: [{
		name: String,
		flag: String
	}],
	markdown: {
		type: String
	}
});

export default mongoose.model('Room', roomSchema);