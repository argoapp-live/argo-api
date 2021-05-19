import { IRepository } from '../Organization/model';
import { Types } from 'mongoose';

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

    createOrUpdateExisting(githubUrl: string, orgId: string, depolymentId: Types.ObjectId, branch: string, workspace: string,
        folderName: string, package_manager: string, build_command: string, publish_dir: string, framework: string): Promise<any>;

    findOneAndUpdate(id: string, body: any): Promise<boolean>;

    InsertDomain(id: string, domain: string, transactionId: string, isLatest: boolean): Promise<boolean>;

    InsertSubDomain(id: string, domain: string, transactionId: string, isLatest: boolean): Promise<boolean>;

    VerifyDomain(id: string, domainName: string): Promise<boolean>;

    VerifySubDomain(id: string, subdomainName: string): Promise<boolean>;

    UpdateDomain(id: string, domain: string, transactionId: string): Promise<any>;
    UpdateSubDomain(id: string, domain: string, transactionId: string): Promise<any>;

    RemoveSubDomain(id: string, repositoryId: string): Promise<any>;

    RemoveDomain(id: string, repositoryId: string): Promise<any>;
    AddToProxy(repo: IRepository, txId: string, depId: string): Promise<any>;
}
