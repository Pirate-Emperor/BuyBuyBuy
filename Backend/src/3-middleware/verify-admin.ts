import { NextFunction, Request, Response } from "express";
import auth from "../2-utils/auth";
import { ForbiddenError, UnauthorizedError } from "../4-models/client-errors";
import RoleEnum from "../4-models/role-enum";

async function verifyAdmin(request: Request, response: Response, next: NextFunction): Promise<void> {

    //* Extract authorization header's value (suppose to be "Bearer token"):
    const authHeader = request.header("authorization");

    //* Verify token:
    const isValid = await auth.verifyToken(authHeader);

    //* If token is not valid:
    if (!isValid) {
        next(new UnauthorizedError("You are not logged in")); // catchAll middleware
        return;
    };

    //* Get user from token:
    const user = auth.getUserFromToken(authHeader);

    //* If user.role is not admin:
    if (user.role !== RoleEnum.Admin) {
        next(new ForbiddenError("You are not authorized"));
        return;
    }

    //* All is OK:
    next(); // Continue to next middleware or to desired route.

};

export default verifyAdmin;