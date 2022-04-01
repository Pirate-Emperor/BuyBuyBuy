import stripTags from "striptags";
import { NextFunction, Request, Response } from "express";

function sanitize(request: Request, response: Response, next: NextFunction) {

    //* Running body properties:
    for (const prop in request.body) {

        //* If the value is a string:
        if (typeof request.body[prop] === "string") {

            //* Remove any tags from it:
            request.body[prop] = stripTags(request.body[prop]);
        }
    }

    //* Go to next middleware:
    next();
}

export default sanitize;