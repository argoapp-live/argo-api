import Arweave = require('arweave');
import { Types } from 'mongoose';
import { IRepository, IOrganization, OrganizationModel, RepositoryModel, DeploymentModel } from '../Organization/model';
import { IRepositoryService } from './interface';
import config from '../../config/env';
import { v4 as uuidv4 } from 'uuid';
import { recordsForHostname } from './helper';
import * as request from 'request';


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
            }).populate('deployments', 'branch topic createdAt sitePreview deploymentStatus package_manager build_command publish_dir workspace');
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
                    'branch': body.branch,
                    'workspace': body.workspace,
                }
            }
            await RepositoryModel.findOneAndUpdate(filter, update);
            return true;

        } catch (error) {
            throw new Error(error.message);
        }
    },

    async InsertDomain(id: string, domain: string, transactionId: string, isLatest: boolean): Promise<any> {
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
                var addDomain = { name: domain, transactionId: transactionId, isLatestDomain: false, argoDomainKey: uuidv4(), ownerVerified: false };
                if (isLatest) {
                    addDomain.isLatestDomain = true;
                    // await addProxy(repo, transactionId, domain);
                }
                repo.domains.push(addDomain);
                await repo.save();
            }
            return true;

        } catch (error) {
            throw new Error(error.message);
        }
    },

    async InsertSubDomain(id: string, domain: string, transactionId: string, isLatest: boolean, argoDomainKey: string = null, ownerVerified: boolean = false): Promise<any> {
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

                if(!argoDomainKey) {
                    argoDomainKey = uuidv4();
                }

                var addSubDomain = { name: domain, transactionId: transactionId, isLatestSubDomain: false, argoDomainKey: argoDomainKey, ownerVerified: ownerVerified };
                if (isLatest) {
                    addSubDomain.isLatestSubDomain = true;
                    // await addProxy(repo, transactionId, domain);
                }
                repo.subDomains.push(addSubDomain);
                await repo.save();
            }
            return true;

        } catch (error) {
            throw new Error(error.message);
        }
    },

    async VerifyDomain(id: string, domainName: string): Promise<any> {
        try {
            const filter = {
                '_id': Types.ObjectId(id)
            };
            var repo = await RepositoryModel.findOne(filter);

            if (repo) {
                const domain = repo.domains.filter(d => d.name === domainName)[0];
                const txtRecords = await recordsForHostname(domain.name)
                console.log(txtRecords, domain)
                if(txtRecords.indexOf(domain.argoDomainKey) != -1) {
                    domain.ownerVerified = true
                }
                if (domain.isLatestDomain && domain.ownerVerified) {
                    await addProxy(repo, domain.transactionId, domain.name, domain.argoDomainKey);
                }
                const filter = {
                    'domains._id': domain._id
                };
                const updatCondition = {
                    $set: {
                        'domains.$.ownerVerified': domain.ownerVerified
                    }
                }
                await RepositoryModel.findOneAndUpdate(filter, updatCondition)
            }
            return true;

        } catch (error) {
            throw new Error(error.message);
        }
    },

    async VerifySubDomain(id: string, subdomainName: string): Promise<any> {
        try {
            const filter = {
                '_id': Types.ObjectId(id)
            };
            var repo = await RepositoryModel.findOne(filter);

            if (repo) {
                const subdomain = repo.subDomains.filter(d => d.name === subdomainName)[0];
                const txtRecords = await recordsForHostname(subdomain.name)
                console.log(txtRecords, subdomain)
                if(txtRecords.indexOf(subdomain.argoDomainKey) != -1) {
                    subdomain.ownerVerified = true
                }
                if (subdomain.isLatestSubDomain && subdomain.ownerVerified) {
                    await addProxy(repo, subdomain.transactionId, subdomain.name, subdomain.argoDomainKey);
                }
                const filter = {
                    'domains._id': subdomain._id
                };
                const updatCondition = {
                    $set: {
                        'domains.$.ownerVerified': subdomain.ownerVerified
                    }
                }
                await RepositoryModel.findOneAndUpdate(filter, updatCondition)
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
        await addProxy(repo, txId, '', '');
    }
};

const addProxy = async (repo: IRepository, txId: string, domain: string, argoDomainKey: string): Promise<any> => {
    try {
        let domainArray: string[] = [];
        let argoDomainKeyArray: string[] = [];
        if (txId === '') {
            return false;
        }
        if (txId != '' && domain != '') {
            domainArray.push(domain);
            argoDomainKeyArray.push(argoDomainKey)
        }

        repo.domains.forEach(domain => {
            if (domain.isLatestDomain) {
                domainArray.push(domain.name)
                argoDomainKeyArray.push(domain.argoDomainKey)
            }
        });
        repo.subDomains.forEach(subdomain => {
            if (subdomain.isLatestSubDomain) {
                domainArray.push(subdomain.name)
                argoDomainKeyArray.push(subdomain.argoDomainKey)
            }
        });

        const proxyBody = {
            transaction: txId, domains: domainArray, uuids: argoDomainKeyArray
        }
        await sendAddDomainRequest(proxyBody)
        // const arweave: Arweave = Arweave.init({
        //     host: config.arweave.HOST,
        //     port: config.arweave.PORT,
        //     protocol: config.arweave.PROTOCOL,
        // });
        // let paywallet: string = config.privateKey.AR_PRIVATE_KEY;
        // const transaction: any = await arweave.createTransaction({ data: "Changing deployment id" }, JSON.parse(paywallet));
        // transaction.addTag('Content-Type', 'x-arweave/name-update');
        // transaction.addTag('Arweave-Domain', joinedDomain);
        // transaction.addTag('Arweave-Hash', txId);
        // await arweave.transactions.sign(transaction, JSON.parse(paywallet));
        // await arweave.transactions.post(transaction);

        repo.domains.forEach(async domain => {
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
        repo.subDomains.forEach(async subDomains => {
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


const sendAddDomainRequest = async (domain: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': `${config.domainResolver.BASE_ADDRESS}/v1/add-domain`,
            'headers': {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: `Bearer ${config.domainResolver.SECRET}`,
            },
            body: JSON.stringify(domain)
        };
        request(options, function (error: any, response: any) {
            if (error) reject(error);
            resolve(response);
        });
    });

}

export default RepositoryService;
