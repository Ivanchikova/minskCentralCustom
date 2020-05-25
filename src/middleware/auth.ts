import { Request, Response, NextFunction } from "express";

export default (request: Request, response: Response, next: NextFunction) => {
    if (!request!.session!.isAuthenticated) {
        return response.redirect('/');
    }
    next();
} 
