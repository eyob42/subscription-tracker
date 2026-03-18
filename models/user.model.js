import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name required'],
        trim: true,
        minLength: 2,
        maxLength:50,
    },
    email: {
        type: String,
        required: [true, 'User email required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a email'],
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
        minLength: 6,
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;