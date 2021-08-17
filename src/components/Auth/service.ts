import { Types } from "mongoose";
import { IOrganization } from "../Organization/model";
import OrganizationService from "../Organization/service";
import UserModel, { IUserModel, IUser } from "../User/model";
import UserService from "../User/service";
import { IAuthService } from "./interface";
import { Request } from "express";
import JWTTokenService from "../Session/service";

/**
 * @export
 * @implements {IAuthService}
 */
const AuthService: IAuthService = {
  /**
   * @param {IUserModel} body
   * @returns {Promise <IUserModel>}
   * @memberof AuthService
   */
  async findProfileOrCreate(body: IUser): Promise<IUserModel> {
    try {
      const user: IUserModel = new UserModel({
        providerProfile: body.providerProfile,
        provider: body.provider,
        argoProfile: body.argoProfile,
      });
      const query: IUserModel = await UserModel.findOne({
        "providerProfile.id": body.providerProfile.id,
      });

      if (query) {
        console.log("User already present");

        return query;
      }
      const saved: IUserModel = await user.save();

      const org: IOrganization = await OrganizationService.insertDefault(
        saved.providerProfile.username,
        saved.id
      );

      const filter: any = {
        _id: Types.ObjectId(saved.id),
      };
      const update: any = {
        $addToSet: { organizations: [Types.ObjectId(org.id)] },
      };
      await UserModel.updateOne(filter, update);

      return saved;
    } catch (error) {
      throw new Error(error);
    }
  },

  async deseralizeToken(req: Request): Promise<any> {
    const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
    return JWTTokenService.VerifyToken(argoDecodedHeaderToken);
  },

  async authUser(req: Request): Promise<IUserModel> {
    const deserializedToken: any = await this.deseralizeToken(req);
    const user: IUserModel = await UserService.findOne(
      deserializedToken.session_id
    );

    const { orgId }: { orgId: string } = req.body;
    const organization: IOrganization = await OrganizationService.findOne(
      orgId
    );

    if (!organization) {
      return null;
    }

    const isUserInOrganization: boolean = user.organizations.some((orgUser) => {
      return orgUser._id.equals(orgId);
    });

    if (!isUserInOrganization) {
      return null;
    }
    return user;
  },
};

export default AuthService;
