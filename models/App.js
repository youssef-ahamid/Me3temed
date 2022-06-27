import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AppSchema = new Schema({
  name: String,
  users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  url: {
    type: String,
    required: true,
  },
});

export default mongoose.model("App", AppSchema);
