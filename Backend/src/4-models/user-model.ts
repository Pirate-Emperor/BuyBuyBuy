import mongoose from "mongoose";
import CityEnum from "./city-enum";
import RoleEnum from "./role-enum";

//* Interface:
export interface IUserModel extends mongoose.Document {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    idNumber: string;
    street: string;
    city: CityEnum;
    role: RoleEnum
}

//* Schema:
export const UserSchema = new mongoose.Schema<IUserModel>({
    firstName: {
        type: String,
        required: [true, "Missing first name"],
        minlength: [2, "First name too short"],
        maxlength: [50, "First name too long"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Missing last name"],
        minlength: [2, "Last name too short"],
        maxlength: [50, "Last name too long"],
        trim: true
    },
    username: {
        type: String,
        required: [true, "Missing username"],
        minlength: [5, "Username too short"],
        maxlength: [100, "Username too long"],
        trim: true,
        match: [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, "You have entered an invalid email address"]
    },
    password: {
        type: String,
        required: [true, "Missing password"],
        minlength: [2, "Password too short"],
        maxlength: [128, "Password too long"],
        trim: true
    },
    idNumber: {
        type: String,
        required: [true, "Missing ID number"],
        minlength: [9, "ID number too short"],
        maxlength: [128, "ID number too long"],
        trim: true,
        unique: true
    },
    street: {
        type: String,
        required: [true, "Missing street"],
        minlength: [2, "Street too short"],
        maxlength: [100, "Street too long"],
        trim: true
    },
    city: {
        type: String,
        require: [true, "Missing city"],
        enum: CityEnum,
        minlength: [2, "City too short"],
        maxlength: [50, "City too long"]
    },
    role: {
        type: Number,
        required: [true, "Missing role"],
        enum: RoleEnum,
        default: RoleEnum.User,
        minlength: [0, "Role can't be negative"],
        maxlength: [1, "Role can't exceed 1"],
    },
}, {
    versionKey: false
});

//* Model:
export const UserModel = mongoose.model<IUserModel>("UserModel", UserSchema, "users");