import { NextFunction, Request, Response } from "express";
import fsPromises from "fs/promises";

async function catchAll(err: any, request: Request, response: Response, next: NextFunction): Promise<void> {

    const fileName = './src/1-assets/logs/error-logs.txt';

    //* Log error to console:
    console.log(err);

    //* Log error in a log file:
    const now = new Date();
    await fsPromises.appendFile(fileName, `${now} -> ${err.status}: ${err.message}\n----------------------------------------------------------------------------------------------\n`);

    //* Get status code: 
    const statusCode = err.status ? err.status : 500;

    //* Return error to frontend: 
    response.status(statusCode).send(err.message);
}

export default catchAll;
