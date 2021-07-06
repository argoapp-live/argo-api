import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import { IConfiguration } from './model';
import ConfigurationService from './service';

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
    try {
        // const user: IUserModel = await AuthService.authUser(req);
        // if (!user) throw new Error('unauthorized user');    
        
        // if (!is<IConfiguration>(req.body)) throw new Error('not valid request body');
        const exists: IConfiguration = await ConfigurationService.findOne(req.body);
        if (exists) {
            res.status(200).json(exists);
            return;
        }
        const configuration: IConfiguration = await ConfigurationService.insert(req.body);
        
        res.status(201).json(configuration);

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}


export async function findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
        // const user: IUserModel = await AuthService.authUser(req);
        // if (!user) throw new Error('unauthorized user');    
        
        const id: string = req.params.id;
        const configuration: IConfiguration = await ConfigurationService.findById(id);
        
        res.status(201).json(configuration);

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}


export async function findOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
        // const user: IUserModel = await AuthService.authUser(req);
        // if (!user) throw new Error('unauthorized user');    
        
        // if (!is<Partial<IConfiguration>>(req.body)) throw new Error('not valid request body');
        const configuration: IConfiguration = await ConfigurationService.findOne(req.query);
        
        res.status(200).json(configuration);

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}
