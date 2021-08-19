import { IOrganization } from "../Organization/model";
import { IUserInvite } from "./model";

/**
 * @export
 * @interface IInvitationService
 */
export interface IInvitationService {
  /**
   * @memberof IInvitationService
   */
  sendMail(
    to: string,
    inviteId: string,
    orgName: string,
    invitingUser: string
  ): Promise<string|undefined>;

  /**
   * @param {string} id
   * @returns {Promise<IUserInvite>}
   * @memberof IInvitationService
   */
  findOne(id: string): Promise<IUserInvite>;
  /**
  * @param {string} id organisation id
  * @returns {Promise<IUserInvite>}
  * @memberof IInvitationService
  */
  findFromOrganization(id: string): Promise<Array<IUserInvite>>
  /**
 * @param {string} id organisation id
 * @returns {Promise<IUserInvite>}
 * @memberof IInvitationService
 */
  deleteInvite(id: string): Promise<IUserInvite>

  /**
   * @param {IUserInvite} IUserInvite
   * @returns {Promise<IUserInvite>}
   * @memberof IInvitationService
   */
  insert(userInviteDto: IUserInvite): Promise<IUserInvite>;

  /**
   * @returns {Promise<any>}
   * @memberof IInvitationService
   */
  findOneAndUpdate(id: string, status: string): Promise<IUserInvite>;
    /**
   * @returns {Promise<any>}
   * @memberof IInvitationService
   */
  findOneAndUpdateLink(id: string, link: string): Promise<IUserInvite>;
}
