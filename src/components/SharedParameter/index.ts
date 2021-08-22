import { ISharedParameter } from "./model";
import SharedParameterService from "./service";
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../config/error';

export async function getParameter(req: Request, res: Response, next: NextFunction): Promise<void>{
    try {
        const name: string = req.params.name;
        console.log(req.params);
        console.log("DUSAN" + req.path);
        console.log(name);
        const param: ISharedParameter = await SharedParameterService.findOne({name});
        if(!param){
            res.status(404).json({
                "message" : "Parameter not found", 
                name 
            });
            return;
        }
        res.status(200).json(param);
    } catch(error) {
        throw new Error(error.message);
    }
}

export async function insert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {               
        const sharedParameter = await SharedParameterService.insert(req.body);
        res.status(200).json(sharedParameter);
    } catch(error) {
        next(new HttpError(error.message.status, error.message));
    }
}
export async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const sharedParameters: ISharedParameter[] = await SharedParameterService.find({});
        res.status(200).json(sharedParameters);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}


