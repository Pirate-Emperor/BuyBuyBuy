import auth from "../2-utils/auth";
import hash from "../2-utils/cyber";
import { UnauthorizedError, ValidationError } from "../4-models/client-errors";
import { ICredentialsModel } from "../4-models/credentials-model";
import { IUserModel, UserModel } from "../4-models/user-model";

async function register(user: IUserModel): Promise<string> {
    //* Validation:
    const errors = user.validateSync();
    if (errors) throw new ValidationError(errors.message);

    //* Check if username is already existing:
    const existingUsername = await UserModel.findOne({ username: user.username }).exec();
    if (existingUsername) throw new ValidationError(`Username ${user.username} is already taken. 
    Please make sure that you are not registered already or please choose a different username`);

    //* Hash the password:
    user.password = hash(user.password);

    //* Hash the ID number:
    user.idNumber = hash(user.idNumber);

    await user.save();

    //* Delete password and ID number from the return object
    delete user.password;
    delete user.idNumber;

    //* Generate new token:
    const token = auth.generateNewToken(user);

    return token;
};

async function login(credentials: ICredentialsModel): Promise<string> {
    //* Validation:
    const errors = credentials.validateSync();
    if (errors) throw new ValidationError(errors.message);

    //* Hash the password:
    credentials.password = hash(credentials.password);

    //* Get users from database:
    const users = await UserModel.find({ username: credentials.username, password: credentials.password }).exec();
    const user = users[0];

    //* If no such user exists:
    if (!user) throw new UnauthorizedError("Incorrect username or password");

    //* Delete password from the return object
    delete user.password;

    //* Generate new token
    const token = auth.generateNewToken(user);

    return token;
};

async function checkValidEmailAndIdNumber(user: IUserModel): Promise<boolean> {
    //* Check if there is duplicate username:
    const existingUsername = await UserModel.findOne({ username: user.username }).exec();

    if (existingUsername) return false;

    //* Hash the ID number to compare:
    const hashedIdNumber = hash(user.idNumber);

    //* Check if there is duplicate ID number:
    const existingIdNumber = await UserModel.findOne({ idNumber: hashedIdNumber }).exec();

    if (existingIdNumber) return false;

    //* if there are no duplicates:
    return true;
}

export default {
    register,
    login,
    checkValidEmailAndIdNumber
};