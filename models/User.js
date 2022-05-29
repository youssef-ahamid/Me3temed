import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {type:String, unique:true},
    refreshToken: String,
    name: String,
    img: String,
    passwordHash: String,
    otp: {type:String},
    createdAt:{ type: Date, default: Date.now }
});
export default mongoose.model('user', UserSchema);