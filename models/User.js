import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String }, // only for email-password users
    provider: { type: String, default: "credentials" }, // "google", "github", etc.
});
// export const User = mongoose.model("User", UserSchema);
 const User = mongoose.models?.User || mongoose.model("User", UserSchema);
 export { User };

export default User;