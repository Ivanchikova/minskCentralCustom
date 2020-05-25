import { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
    res.locals.isAuth = req.session!.isAuthenticated;
    res.locals.isAdmin = req.session!.isAdmin;
    res.locals.csrf = req.csrfToken();
    next();
};
