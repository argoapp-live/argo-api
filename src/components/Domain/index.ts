import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import AuthService from '../Auth/service';
import { IUserModel } from '../User/model';
import { IDomain } from './model';
import DomainService from './service';
import ProjectService from '../Project/service';

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
    try {
        const user: IUserModel = await AuthService.authUser(req);
        console.log(user)
        if (!user) throw new Error('unauthorized user');    
        
        // if (!is<IConfiguration>(req.body)) throw new Error('not valid request body');
        const { projectId } = req.body;
        const projectExists = await ProjectService.findById(projectId);
        if (!projectExists) throw new Error('Project does not exists');

        const domain: IDomain = await DomainService.insert(req.body);
        res.status(201).json({success: true, domain});

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
    try {
        const user: IUserModel = await AuthService.authUser(req);
        if (!user) throw new Error('unauthorized user');    
        
        // if (!is<IConfiguration>(req.body)) throw new Error('not valid request body');
        const { projectId } = req.body;
        const projectExists = await ProjectService.findById(projectId);
        if (!projectExists) throw new Error('Project does not exists');

        const domain: IDomain = await DomainService.update(req.params.id, req.body);
        res.status(201).json({success: true, domain});

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
        const id: string = req.params.id;
        const configuration: IDomain = await DomainService.findById(id);
        
        res.status(201).json(configuration);

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function find(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
        const domains: Array<IDomain> = await DomainService.find(req.body);
        res.status(201).json(domains);

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
        const configuration: IDomain = await DomainService.findOne(req.query);
        
        res.status(200).json(configuration);

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function verify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {        
        const verified: boolean = await DomainService.verify(req.body.id);
        res.status(200).json({ verified });

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function remove(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
        await DomainService.remove(req.params.id);
        res.status(200).json({success: true });

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}
