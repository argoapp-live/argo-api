import  DomainModel, { IDomain } from './model';
import { v4 as uuidv4 } from 'uuid';
import * as dns from 'dns';
import * as Cloudflare from 'cloudflare';
import config from '../../config/env';
import { Types } from 'mongoose';
import { IProject } from '../Project/model';

/**
 * @export
 * @implements {DomainService}
 */

 const client = new Cloudflare({ email: config.cloudflare.email, token: config.cloudflare.key });


const DomainService = {
    async findById(id: string): Promise<IDomain> {
        try {
            return DomainModel.findById(id);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async findOne(query: Partial<IDomain>): Promise<IDomain> {
        try {
            return DomainModel.findOne(query);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async insert(data: IDomain): Promise<IDomain> {
        try {
            return DomainModel.create({ argoKey: uuidv4(), ...data });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async verify(domainId: string): Promise<boolean> {
        try {
            const domain = await DomainService.findById(domainId);
            if (domain.verified) return true;

            const addresses: string[][] = await _resolveTxt(domain.name);

            let verified = false;
            addresses.forEach((address: string[]) => {
                const index: number = address.indexOf(`argo=${domain.argoKey}`);

                if (index > -1) verified = true;
            });

            domain.verified = verified;
            await domain.save();

            return verified;
            
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async update(id: string, updateQuery: Partial<IDomain>): Promise<IDomain> {
        try {
            if (updateQuery.verified && updateQuery.type && updateQuery.argoKey) throw new Error('Not valid query'); 
            if(updateQuery.name) {
                updateQuery.verified = false
            }
            return DomainModel.updateOne({ _id: id }, updateQuery);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async remove(id: string): Promise<void> {
        try {
            return DomainModel.remove({_id: id});
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async find(query: Partial<IDomain>): Promise<Array<IDomain>> {
        try {
            return DomainModel.find(query);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async addDefault(project: IProject): Promise<void> {
        try {
            const argoKey: string = uuidv4();
            const randomString: string = Math.random().toString(36).substring(7);
            const projectNameNormalized: string = project.name.replace(/\s/g, '-');
            const name: string = `${projectNameNormalized}-${randomString}.${config.cloudflare.dns}`;

            let record: IDnsRecord = {
                type: 'A',
                name,
                content: config.cloudflare.ARGO_IPV4,
                ttl: 300,
            }

            await this._addDnsRecord(record);

            record.type = 'TXT';
            record.content = `argo=${argoKey}`;

            await this._addDnsRecord(record);

            await DomainModel.create({ name, link: '', argoKey, projectId: project._id, verified: true, isLatest: true, type: 'subdomain' });
        } catch(err) {
            throw new Error(err.message);
        }
    },

    async _addDnsRecord(record: IDnsRecord): Promise<any> {
        return client.dnsRecords.add(config.cloudflare.zoneId, record);
    },

    async addToResolver(projectId: string, link: string): Promise<any> {
        if (link === '') return false;

        const latestDomains: Array<IDomain> = await DomainModel.find({ projectId, isLatest: true, verified: true });

        const body = {
            transaction: link,
            domains: latestDomains.map((latestDomain: IDomain) => latestDomain.name),
            uuids: latestDomains.map((latestDomain: IDomain) => latestDomain.argoKey)
        }

        // const response = await axios.post(`${config.domainResolver.BASE_ADDRESS}/v1/add-domain`, body, {
        //     headers: {
        //         'Content-Type': 'application/json; charset=utf-8',
        //         Authorization: `Bearer ${config.domainResolver.SECRET}`,
        //     }
        // });

        // if (response.status === 200) {
            const ids: Array<Types.ObjectId> = latestDomains.map((latestDomain: IDomain) => latestDomain._id);
            await DomainModel.updateMany({ _id: { $in: ids }}, { link });
        // }
    }
};

function _resolveTxt(hostname: string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
        dns.resolveTxt(hostname, (err: NodeJS.ErrnoException, addresses: string[][]) => {
            if(err) reject(err);
            resolve(addresses);
        });
    })
}

interface IDnsRecord {
    type: "A" | "AAAA" | "CNAME" | "TXT";
    name: string;
    content: string;
    ttl: number;
}

export default DomainService;

 