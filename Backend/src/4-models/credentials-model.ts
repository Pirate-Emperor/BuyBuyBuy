import mongoose from "mongoose";

//* Interface:
export interface ICredentialsModel extends mongoose.Document {
    username: string;
    password: string;
}

//* Schema:
export const CredentialsSchema = new mongoose.Schema<ICredentialsModel>({
    username: {
        type: String,
        required: [true, "Missing username"],
        minlength: [5, "Username is too short"],
        maxlength: [100, "Username is too long"],
        trim: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "You have entered an invalid email address"]
    },
    password: {
        type: String,
        required: [true, "Missing password"],
        minlength: [4, "Password is to short"],
        maxlength: [256, "Password is too long"],
        trim: true
    }
}, {
    versionKey: false
});

//* Model:
export const CredentialsModel = mongoose.model<ICredentialsModel>("CredentialsModel", CredentialsSchema, "users");