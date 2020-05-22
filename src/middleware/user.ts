import User from '../models/users';
import { Request, Response, NextFunction } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
    if (!req!.session!.user) {
        return next();
    }

    req.body.user = await User.findById(req!.session!.user._id);
    next();
}