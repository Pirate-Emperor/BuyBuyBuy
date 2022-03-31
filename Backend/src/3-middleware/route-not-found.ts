import { NextFunction, Request, Response } from "express";
import { RouteNotFoundError } from "../4-models/client-errors";

function routeNotFound(request: Request, response: Response, next: NextFunction): void {
    const err = new RouteNotFoundError(request.originalUrl);
    next(err); //* Jump to catch all middleware.
}

export default routeNotFound;
