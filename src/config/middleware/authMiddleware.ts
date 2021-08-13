import axios from "axios";
import config from '../env/index';
import HttpError from "../error";
import * as http from 'http';
import { NextFunction, Request, Response } from 'express';

/**
 * @description Login Required middleware.
 */
 export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    axios.post(
        `${config.authApi.HOST_ADDRESS}/passport/isAuthenticated`,
        {},
        {headers: req.headers}
      ).then((authData)=>{
        if (authData.status == 200) {
            return next();
        }
        next(new HttpError(401, http.STATUS_CODES[401]));
      }).catch(()=>{
        next(new HttpError(401, http.STATUS_CODES[401]));
      })
        
}
