import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BlacklistTokenSchema = new Schema({
    email: String,
    token: String,
    createdAt:{ type: Date, default: Date.now }
});
export default mongoose.model('blacklist', BlacklistTokenSchema);