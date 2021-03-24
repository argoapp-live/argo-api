import Arweave = require('arweave');
import { Types } from 'mongoose';
import { IRepository, IOrganization, OrganizationModel, RepositoryModel, DeploymentModel } from '../Organization/model';
import { IRepositoryService } from './interface';
import config from '../../config/env';
import { filter } from 'compression';

/**
 * @export
 * @implements {IRepositoryService}
 */
const RepositoryService: IRepositoryService = {

    /**
     * @param {string} id
     * @returns {Promise < IRepository >}
     * @memberof UserService
     */
    async findOne(id: string): Promise<IRepository> {
        try {
            const repository: IRepository = await RepositoryModel.findOne({
                _id: Types.ObjectId(id)
            }).populate('deployments', 'branch topic createdAt sitePreview deploymentStatus package_manager build_command publish_dir');
            return repository;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {string} repoName
     * @param {string} branchName
     * @returns {Promise < IRepository >}
     * @memberof UserService
     */
    async findRepoByNameAndBranch(repoName: string, branchName: string): Promise<IRepository> {
        try {
            const repository: IRepository = await RepositoryModel.findOne({
                name: repoName, branch: branchName
            }).select('name package_manager build_command publish_dir -_id');

            return repository;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {IUserModel} user
     * @returns {Promise < IRepository >}
     * @memberof UserService
     */
    async insert(repository: IRepository, organizationId: string): Promise<IRepository> {
        try {
            const organization: IOrganization = await OrganizationModel.findOne({
                _id: organizationId
            });
            if (!organization) {
                throw new Error('Organization with given Id does not exist');
            }
            const repo: IRepository = organization.repositories.find((r: IRepository) => r.name === repository.name);
            if (repo !== undefined) {
                throw new Error('Repository with given name already exist');
            }
            organization.repositories.push(repository);
            await organization.save();

            return repository;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
 * @param {string} id
 * @returns {Promise < IRepository >}
 * @memberof UserService
 */
    async findOneAndUpdate(id: string, body: any): Promise<any> {
        try {
            const filter = {
                '_id': Types.ObjectId(id)
            };
            const update = {
                $set: {
                    'package_manager': body.package_manager,
                    'build_command': body.build_command,
                    'publish_dir': body.publish_dir,
                    'branch': body.branch
                }
            }
            await RepositoryModel.findOneAndUpdate(filter, update);
            return true;

        } catch (error) {
            throw new Error(error.message);
        }
    }, async InsertDomain(id: string, domain: string, transactionId: string, isLatest: boolean): Promise<any> {
        try {
            const filter = {
                '_id': Types.ObjectId(id)
            };
            var repo = await RepositoryModel.findOne(filter);
            var validateName = repo.domains.find(d => d.name === domain);
            if (validateName) {
                return false;
            }

            if (repo) {
                var addDomain = { name: domain, transactionId: transactionId, isLatestDomain: false };
                if (isLatest) {
                    addDomain.isLatestDomain = true;
                    await addProxy(repo, transactionId, domain);
                }
                repo.domains.push(addDomain);
                await repo.save();
            }
            return true;

        } catch (error) {
            throw new Error(error.message);
        }
    },

    async InsertSubDomain(id: string, domain: string, transactionId: string, isLatest: boolean): Promise<any> {
        try {
            const filter = {
                '_id': Types.ObjectId(id)
            };
            var repo = await RepositoryModel.findOne(filter);
            var validateName = repo.subDomains.find(d => d.name === domain);
            if (validateName) {
                return false;
            }

            if (repo) {
                var addSubDomain = { name: domain, transactionId: transactionId, isLatestSubDomain: false };
                if (isLatest) {
                    addSubDomain.isLatestSubDomain = true;
                    await addProxy(repo, transactionId, domain);
                }
                repo.subDomains.push(addSubDomain);
                await repo.save();
            }
            return true;

        } catch (error) {
            throw new Error(error.message);
        }
    },
    async UpdateDomain(id: string, domain: string, transactionId: string): Promise<any> {
        try {
            const filter = {
                'domains._id': Types.ObjectId(id)
            };

            const updatCondition = {
                $set: {
                    'domains.$.name': domain,
                    'domains.$.transactionId': transactionId
                }
            }
            await RepositoryModel.findOneAndUpdate(filter, updatCondition);
            return true;

        } catch (error) {
            throw new Error(error.message);
        }
    },

    async UpdateSubDomain(id: string, domain: string, transactionId: string): Promise<any> {
        try {
            const filter = {
                'subDomains._id': Types.ObjectId(id)
            };
            const updatCondition = {
                $set: {
                    'subDomains.$.name': domain,
                    'subDomains.$.transactionId': transactionId
                }
            }
            await RepositoryModel.findOneAndUpdate(filter, updatCondition);
            return true;

        } catch (error) {
            throw new Error(error.message);
        }
    },
    async RemoveSubDomain(id: string, repositoryId: string): Promise<any> {
        try {
            const filter = {
                '_id': Types.ObjectId(repositoryId)
            };
            await RepositoryModel.updateOne(filter, { $pull: { subDomains: { _id: Types.ObjectId(id) } } });
            return true;

        } catch (error) {
            throw new Error(error.message);
        }
    },

    async RemoveDomain(id: string, repositoryId: string): Promise<any> {
        try {
            const filter = {
                '_id': Types.ObjectId(repositoryId)
            };
            await RepositoryModel.updateOne(filter, { $pull: { domains: { _id: Types.ObjectId(id) } } });
            return true;

        } catch (error) {
            throw new Error(error.message);
        }
    },

    async AddToProxy(repo: IRepository, txId: string, depId: string): Promise<any> {
        await addProxy(repo, txId, '');
    }
};

const addProxy = async (repo: IRepository, txId: string, domain: string): Promise<any> => {
    try {
        let domainArray: string[] = [];
        if (txId === '') {
            return false;
        }
        if (txId != '' && domain != '') {
            domainArray.push(domain);
        }

        repo.domains.forEach(domain => {
            if (domain.isLatestDomain) {
                domainArray.push(domain.name)
            }
        });
        repo.subDomains.forEach(subdomain => {
            if (subdomain.isLatestSubDomain) {
                domainArray.push(subdomain.name)
            }
        });
        let joinedDomain = domainArray.join(',');
        const arweave: Arweave = Arweave.init({
            host: config.arweave.HOST,
            port: config.arweave.PORT,
            protocol: config.arweave.PROTOCOL,
        });
        let paywallet: string = config.privateKey.PRIVATE_KEY;
        const transaction: any = await arweave.createTransaction({ data: "Changing deployment id" }, JSON.parse(paywallet));
        transaction.addTag('Content-Type', 'x-arweave/name-update');
        transaction.addTag('Arweave-Domain', joinedDomain);
        transaction.addTag('Arweave-Hash', txId);
        await arweave.transactions.sign(transaction, JSON.parse(paywallet));
        await arweave.transactions.post(transaction);

        await repo.domains.forEach(async domain => {
            if (domain.isLatestDomain) {
                const filter = {
                    'domains._id': domain._id
                };
                const updatCondition = {
                    $set: {
                        'domains.$.transactionId': txId
                    }
                }
                await RepositoryModel.findOneAndUpdate(filter, updatCondition)
            }
        });
        await repo.subDomains.forEach(async subDomains => {
            if (subDomains.isLatestSubDomain) {
                const filter = {
                    'subDomains._id': subDomains._id
                };
                const updatCondition = {
                    $set: {
                        'subDomains.$.transactionId': txId
                    }
                }
                await RepositoryModel.findOneAndUpdate(filter, updatCondition);
            }
        });

        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}

export default RepositoryService;
