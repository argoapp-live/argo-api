import { IArgoJwtTokenService, IArgoSessionDto } from "./interface";
import ArgoSessionModel, { IArgoSessionModel } from "./model";
import config from '../../config/env/index';
import { sign, verify } from 'jsonwebtoken';
import { Types } from "mongoose";

const JWTTokenService: IArgoJwtTokenService = {
    async findSessionOrCreate(body: IArgoSessionDto): Promise<IArgoSessionDto> {
        try {

            const user: IArgoSessionModel = new ArgoSessionModel({
                session_id: body.session_id,
                access_token: body.access_token,
                is_active: body.is_active
            });

            const query: IArgoSessionModel = await ArgoSessionModel.findOne({
                'session_id': body.session_id
            });

            if (query) {
                console.log('user already logged in');
                const argoSessionDto: IArgoSessionDto = {
                    session_id: query.session_id,
                    is_active: query.is_active,
                    access_token: query.access_token
                }
                return query;
            }
            const saved: IArgoSessionModel = await user.save();
            return body;
        } catch (error) {
            throw new Error(error);
        }
    },
    async findOneByUserId(argo_username: string): Promise<IArgoSessionModel> {
        try {
            const query: IArgoSessionModel = await ArgoSessionModel.findOne({
                'argo_username': argo_username
            });
            if (query) {
                console.log('user already logged in');
                return query;
            }
        } catch (error) {
            throw new Error(error);
        }
    },
    async generateToken(argoSessionDto: IArgoSessionDto): Promise<string> {
        let payload = {
            session_id: argoSessionDto.session_id,
            is_active: argoSessionDto.is_active
        }
        return new Promise((resolve, reject) => {
            sign(payload, config.secret, { expiresIn: '8h', issuer: "www.argoapplive.live" }, (err: Error, encoded: string) => {
                resolve(encoded);
            });
        })

    },
    async VerifyToken(token: string): Promise<any> {

        return new Promise((resolve, reject) => {
            let decoded = verify(token, config.secret);
            resolve(decoded);
        });
    },
    async DecodeToken(req: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let jwtToken: any = ""
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
                jwtToken = req.headers.authorization.split(' ')[1];
            resolve(jwtToken);
        });
    },
    async FindAndRemove(session_id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const filter = {
                'session_id': Types.ObjectId(session_id)
            };
            const isDeleted: any = ArgoSessionModel.deleteOne(filter)
            resolve(isDeleted);
        });
    },
    async FindOneBySessionId(session_id: string): Promise<IArgoSessionModel> {
        try {
            const query: IArgoSessionModel = await ArgoSessionModel.findOne({
                'session_id': session_id
            });
            if (query) {
                console.log('user already logged in');
                return query;
            }
            return null;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default JWTTokenService;