import mongoose from 'mongoose';
import validator from 'validator';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        validate: { validator: validator.isEmail, message: 'Invalid email.' }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        minlength: 6
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        maxlength: 30
    },
    bio: {
        type: String,
        maxlength: 300
    },
    ovpn: {
        type: String
    },
    containers: [{
        id: String,
        image: String,
        room: String,
        expiresAt: Date,
        takesToken: Boolean,
        ip: String
    }],
    tokens: {
        type: Number,
        required: true,
        default: 2
    },
    completed: [{
    	type: String
    }]
});

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);