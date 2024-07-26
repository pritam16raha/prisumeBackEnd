import mongoose from "mongoose";

const MySchema = mongoose.Schema;

const userSchema = new MySchema({
    name: { type: String, require: true },
    username: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    role: { type: String, default: "user" },
    password: { type: String, require: true }
}, { timestamps: true });

export default mongoose.model( 'User' , userSchema, 'users' );