import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/Models";

const UserSchema = new Schema<IUser>({
  id: { type: String, required: true },
  calendar: { type: String, required: true },
});

const User = mongoose.model<IUser>("users", UserSchema);
export default User;
