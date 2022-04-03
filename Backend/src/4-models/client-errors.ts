export class ClientError {
    public status: number;
    public message: string;
    public constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }
}

export class IdNotFoundError extends ClientError {
    public constructor(_id: string) {
        super(404, `_id ${_id} not found`);
    }
}

export class OneOfIdsNotFoundError extends ClientError {
    public constructor(_id1: string, _id2: string) {
        super(404, `_id ${_id1} or ${_id2} not found`);
    }
}

export class RouteNotFoundError extends ClientError {
    public constructor(route: string) {
        super(404, `route ${route} not found`);
    }
}

export class ValidationError extends ClientError {
    public constructor(message: string) {
        super(400, message);
    }
}

export class UnauthorizedError extends ClientError {
    public constructor(message: string) {
        super(401, message);
    }
};

export class ForbiddenError extends ClientError {
    public constructor(message: string) {
        super(403, message);
    }
};