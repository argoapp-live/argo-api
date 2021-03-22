import { IRepository } from '../Organization/model';

/**
 * @export
 * @interface IRepositoryService
 */
export interface IRepositoryService {

    /**
     * @param {string} id
     * @returns {Promise<IRepository>}
     * @memberof IRepositoryService
     */
    findOne(id: string): Promise<IRepository>;

    /**
     * @param {string} repoName
     * @param {string} branchName
     * @returns {Promise < IRepository >}
     * @memberof UserService
     */
    findRepoByNameAndBranch(repoName: string, branchName: string): Promise<IRepository>;

    /**
     * @param {IOrganization} IOrganizationModel
     * @returns {Promise<IOrganization>}
     * @memberof IRepositoryService
     */
    insert(repository: IRepository, organizationId: string): Promise<IRepository>;

    findOneAndUpdate(id: string, body: any): Promise<boolean>;

    InsertDomain(id: string, domain: string, transactionId: string): Promise<boolean>;

    InsertSubDomain(id: string, domain: string, transactionId: string): Promise<any>;

    UpdateDomain(id: string, domain: string, transactionId: string): Promise<any>;
    UpdateSubDomain(id: string, domain: string, transactionId: string): Promise<any>;

    RemoveSubDomain(id: string, repositoryId: string): Promise<any>;

    RemoveDomain(id: string, repositoryId: string): Promise<any>;
    AddToProxy(repo: IRepository, txId: string, depId: string): Promise<any>;
}
