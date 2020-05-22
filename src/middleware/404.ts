import { Request, Response } from 'express';

export default (_request: Request, response: Response) => {
    if (response.status(404)) {
        return response.render('404', {
            title: 'Страница не найдена'
        });
    }
} 