import { IOrganization } from "./model";

/**
 * @export
 * @interface IOrganizationService
 */
export interface IOrganizationService {
  /**
   * @returns {Promise<IOrganization[]>}
   * @memberof IOrganizationService
   */
  find(query: Partial<IOrganization>): Promise<IOrganization[]>;

  /**
   * @param {string} id
   * @returns {Promise<IOrganization>}
   * @memberof IOrganizationService
   */
  findOne(id: string): Promise<IOrganization>;

  /**
   * @param {IOrganization} IOrganizationModel
   * @returns {Promise<IOrganization>}
   * @memberof IOrganizationService
   */
  insert(orgDto: IOrganization): Promise<IOrganization>;

  /**
   * @param {string} id
   * @returns {Promise<IOrganization>}
   * @memberof IOrganizationService
   */
  remove(id: string): Promise<IOrganization>;

  /**
   * @param {string} id
   * @returns {Promise<IOrganization>}
   * @memberof IOrganizationService
   */
  insertDefault(user_name: string, id: string): Promise<IOrganization>;

  findOneAndUpdate(Id: string, userId: string): Promise<any>;

  updateOrganization(org_id: string, org: any): Promise<any>;

  updatePayment(organisationId: string, paymentId: string): Promise<any>;

  updateWallet(organisationId: string, walletId: string): Promise<any>;
  
  deleteUser(organisationId: string, userId: string): Promise<any>;
  // hasPendingDeployment(organisationId: string): Promise<boolean>;
}
