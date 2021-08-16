import { IArgoJwtTokenService, IArgoSessionDto } from "./interface";
import ArgoSessionModel, { IArgoSessionModel } from "./model";
import config from "../../config/env/index";
import { sign, verify } from "jsonwebtoken";
import { Types } from "mongoose";
import axios from "axios";

const JWTTokenService: IArgoJwtTokenService = {
  async findSessionOrCreate(body: IArgoSessionDto): Promise<IArgoSessionDto> {
    try {
      const data: IArgoSessionModel = (
        await axios.post(
          `${config.authApi.HOST_ADDRESS}/session/findSessionOrCreate`,
          body
        )
      ).data;
      return data;
    } catch (error) {
      throw new Error(error);
    }
  },
  async findOneByUserId(argo_username: string): Promise<IArgoSessionModel> {
    try {
      const data: IArgoSessionModel = (
        await axios.post(
          `${config.authApi.HOST_ADDRESS}/session/findOneByUserId`,
          { argo_username: argo_username }
        )
      ).data;
      return data;
    } catch (error) {
      throw new Error(error);
    }
  },
  async generateToken(argoSessionDto: IArgoSessionDto): Promise<string> {
    try {
      const data = (
        await axios.post(
          `${config.authApi.HOST_ADDRESS}/session/decodegenerateToken`,
          argoSessionDto
        )
      ).data;
      return data.token;
    } catch (error) {
      throw new Error(error);
    }
  },
  async verifyToken(token: string): Promise<any> {
    try {
      const data = (
        await axios.post(`${config.authApi.HOST_ADDRESS}/session/verifyToken`, {
          token: token,
        })
      ).data;
      return data.decoded;
    } catch (error) {
      throw new Error(error);
    }
  },
  async decodeToken(req: any): Promise<any> {
    try {
      const data = (
        await axios.post(
          `${config.authApi.HOST_ADDRESS}/session/decodeToken`,
          req.body,
          { headers: req.headers }
        )
      ).data;
      return data.token;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  async findAndRemove(sessionId: string): Promise<any> {
    try {
      const query: IArgoSessionModel = (
        await axios.post(
          `${config.authApi.HOST_ADDRESS}/session/FindAndRemove`,
          { sessionId: sessionId }
        )
      ).data;
      return query;
    } catch (error) {
      throw new Error(error);
    }
  },
  async findOneBySessionId(sessionId: string): Promise<IArgoSessionModel> {
    try {
      const query: IArgoSessionModel = (
        await axios.post(
          `${config.authApi.HOST_ADDRESS}/session/findOneBySessionId`,
          { sessionId: sessionId }
        )
      ).data;
      return query;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default JWTTokenService;
