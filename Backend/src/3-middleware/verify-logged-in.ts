import { NextFunction, Request, Response } from "express";
import auth from "../2-utils/auth";
import { UnauthorizedError } from "../4-models/client-errors";

async function verifyLoggedIn(request: Request, response: Response, next: NextFunction): Promise<void> {

    //* Extract authorization header's value (suppose to be "Bearer token"):
    const authHeader = request.header("authorization");

    //* Verify token:
    const isValid = await auth.verifyToken(authHeader);

    //* If token is not valid:
    if (!isValid) {
        next(new UnauthorizedError("You are not logged in")); //* catchAll middleware
        return;
    };

    //* All is OK:
    next(); //* Continue to next middleware or to desired route.

};

export default verifyLoggedIn;