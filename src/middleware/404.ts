import { Request, Response, NextFunction } from "express";

export default (request: Request, response: Response) => {
    if (response.status(404)) {
        return response.render('404', {
            title: 'Страница не найдена'
        });
    }
} 