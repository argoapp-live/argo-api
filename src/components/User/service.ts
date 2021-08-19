import * as Joi from "joi";
import UserModel, { IArgoUser, IUserModel } from "./model";
import UserValidation from "./validation";
import { IUserService } from "./interface";
import { Types } from "mongoose";

/**
 * @export
 * @implements {IUserModelService}
 */
const UserService: IUserService = {
  /**
   * @returns {Promise < IUserModel[] >}
   * @memberof UserService
   */
  async findAll(): Promise<IUserModel[]> {
    try {
      return await UserModel.find({});
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * @param {string} id
   * @returns {Promise < IUserModel >}
   * @memberof UserService
   */
  async findOne(id: string): Promise<IUserModel> {
    try {
      return await UserModel.findOne({
        _id: Types.ObjectId(id),
      }).populate("organizations");
    } catch (error) {
      throw new Error(error.message);
    }
  },
  /**
   * @param {string} id
   * @returns {Promise < IUserModel >}
   * @memberof UserService
   */
  async findOneAndUpdate(id: string, user: IArgoUser): Promise<any> {
    try {
      const filter = {
        _id: Types.ObjectId(id),
      };

      const update = {
        argoProfile: user,
      };

      await UserModel.findOneAndUpdate(filter, update);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * @param {string} id
   * @returns {Promise < IUserModel >}
   * @memberof UserService
   */
  async findOneByGithubId(id: string): Promise<IUserModel> {
    try {
      return await UserModel.findOne({
        profile: { id: Types.ObjectId(id) },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * @param {IUserModel} user
   * @returns {Promise < IUserModel >}
   * @memberof UserService
   */
  async insert(body: IUserModel): Promise<IUserModel> {
    try {
      const validate: Joi.ValidationResult<IUserModel> =
        UserValidation.createUser(body);

      if (validate.error) {
        throw new Error(validate.error.message);
      }

      const user: IUserModel = await UserModel.create(body);

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * @param {string} id
   * @returns {Promise < IUserModel >}
   * @memberof UserService
   */
  async remove(id: string): Promise<IUserModel> {
    try {
      const filter = {
        "profile.id": id,
      };
      const user: IUserModel = await UserModel.findOneAndRemove(filter);

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * @param {string} id
   * @returns {Promise < IUserModel >}
   * @memberof UserService
   */
  async updateOrganization(orgId: string, userId: string): Promise<IUserModel> {
    try {
      const filter = {
        "profile.id": userId,
      };
      const update = {
        $addToSet: { organization: [orgId] },
      };
      const user: IUserModel = await UserModel.updateOne(filter, update);

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * @param {string} id
   * @returns {Promise < IUserModel >}
   * @memberof UserService
   */
  async deleteOrganisation(orgId: string, userId: string): Promise<IUserModel> {
    try {
      const filter: any = {
        _id: Types.ObjectId(userId),
      };
      const org_id: Types.ObjectId = Types.ObjectId(orgId);

      const update: any = { $pull: { 'organizations': org_id } }
      return await UserModel.findOneAndUpdate(filter, update);
    } catch (error) {
      console.log("error: ", error.meesage)
      throw new Error(error.message);
    }
  },

  /**
   * @param {string} id
   * @returns {Promise < IUserModel >}
   * @memberof UserService
   */
  async updateUserOrganization(
    orgId: string,
    userId: string
  ): Promise<IUserModel> {
    try {
      const filter = {
        _id: Types.ObjectId(userId),
      };
      const update = {
        $addToSet: { organizations: [orgId] },
      };
      const user: IUserModel = await UserModel.updateOne(filter, update);

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default UserService;
