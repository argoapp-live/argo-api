import DomainModel, { IDomain } from "./model";
import { v4 as uuidv4 } from "uuid";
import * as dns from "dns";
import * as Cloudflare from "cloudflare";
import config from "../../config/env";
import { Types } from "mongoose";
import { IProject } from "../Project/model";
import axios from "axios";

/**
 * @export
 * @implements {DomainService}
 */

const client = new Cloudflare({
  email: config.cloudflare.EMAIL,
  key: config.cloudflare.KEY,
});

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

  async verify(domainId: string): Promise<IVerified> {
    try {
      let domain: IDomain = await DomainService.findById(domainId);
      if (domain.verified) {
        return {
          domain,
          wasVerified: true,
        };
      }

      if (domain.type.indexOf("handshake") !== -1) {
        const isSubdomain = domain.type.indexOf("subdomain") !== -1;
        const records = await _resolveHandshakeRecords(
          domain.name.substring(
            domain.name.lastIndexOf(".") + 1,
            domain.name.length
          )
        );

        let verified = false;
        let separator = {
          base: "",
          sep: "",
        };
        if (domain.link.indexOf("arweave.net") !== -1) {
          separator = {
            base: "arweave",
            sep: "https://arweave.net/",
          };
        } else if (domain.link.indexOf("siasky.net") !== -1) {
          separator = {
            base: "sia",
            sep: "https://siasky.net/",
          };
        }
        if (!isSubdomain) {
          const txtRecord = records.filter(
            (r) => r.type === "TXT" && r.host === "_contenthash"
          )[0];
          const alaisRecord = records.filter(
            (r) => r.type === "ALIAS" && r.host === "@"
          )[0];

          verified =
            txtRecord.value ===
              `${separator.base}://${domain.link.split(separator.sep)[1]}` &&
            alaisRecord.value === `${separator.base}.namebase.io.`;
        } else {
          const txtRecord = records.filter(
            (r) =>
              r.type === "TXT" &&
              r.host ===
                `_contenthash.${domain.name.substring(
                  0,
                  domain.name.lastIndexOf(".")
                )}`
          )[0];
          const alaisRecord = records.filter(
            (r) =>
              r.type === "CNAME" &&
              r.host === domain.name.substring(0, domain.name.lastIndexOf("."))
          )[0];
          verified =
            txtRecord.value ===
              `${separator.base}://${domain.link.split(separator.sep)[1]}` &&
            alaisRecord.value === `${separator.base}.namebase.io.`;
        }

        domain.verified = verified;
        await domain.save();
        domain = await DomainService.findById(domainId);

        return {
          domain,
          wasVerified: false,
        };
      }
      {
        const addresses: string[][] = await _resolveTxt(domain.name);

        let verified = false;
        addresses.forEach((address: string[]) => {
          const index: number = address.indexOf(`argo=${domain.argoKey}`);

          if (index > -1) verified = true;
        });

        domain.verified = verified;
        await domain.save();
        domain = await DomainService.findById(domainId);

        return {
          domain,
          wasVerified: false,
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async update(
    id: string,
    name: string,
    link: string,
    isLatest: boolean
  ): Promise<IDomain> {
    try {
      const domain: IDomain = await DomainService.findById(id);
      if (name) domain.name = name;
      if (link) domain.link = link;
      domain.isLatest = isLatest;
      if (name || (domain.type.indexOf("handshake") !== -1 && link)) {
        domain.verified = false;
      }

      await domain.save();
      return domain;
      // return DomainModel.findById(id, { }, { new: true });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      return DomainModel.deleteOne({ _id: id });
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
      const projectNameNormalized: string = project.name.replace(/\s/g, "-");
      const name: string = `${projectNameNormalized}-${randomString}.${config.cloudflare.DOMAIN_NAME}`;

      const record: IDnsRecord = {
        type: "A",
        name,
        content: config.cloudflare.ARGO_IPV4,
        ttl: 300,
      };

      await this._addDnsRecord(record);

      record.type = "TXT";
      record.content = `argo=${argoKey}`;

      await this._addDnsRecord(record);

      await DomainModel.create({
        name,
        link: "",
        argoKey,
        projectId: project._id,
        verified: true,
        isLatest: true,
        type: "subdomain",
      });
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async _addDnsRecord(record: IDnsRecord): Promise<any> {
    return client.dnsRecords.add(config.cloudflare.ZONE_ID, record);
  },

  async addToResolver(projectId: string, link: string): Promise<any> {
    if (link === "") return false;

    const latestDomains: Array<IDomain> = await DomainModel.find({
      projectId,
      isLatest: true,
      verified: true,
    });

    const body = {
      transaction: link,
      domains: latestDomains.map((latestDomain: IDomain) => latestDomain.name),
      uuids: latestDomains.map((latestDomain: IDomain) => latestDomain.argoKey),
    };

    const response = await axios.post(
      `${config.domainResolver.HOST_ADDRESS}/v1/add-domain`,
      body,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${config.domainResolver.SECRET}`,
        },
      }
    );

    if (response.status === 200) {
      const ids: Array<Types.ObjectId> = latestDomains.map(
        (latestDomain: IDomain) => latestDomain._id
      );
      await DomainModel.updateMany({ _id: { $in: ids } }, { link });
    }
  },

  async addStaticToResolver(
    domain: string,
    argoKey: string,
    link: string
  ): Promise<boolean> {
    if (link === "") return false;

    const body = {
      transaction: link,
      domains: [domain],
      uuids: [argoKey],
    };

    const response = await axios.post(
      `${config.domainResolver.HOST_ADDRESS}/v1/add-domain`,
      body,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${config.domainResolver.SECRET}`,
        },
      }
    );
    return response.status === 200;
  },
};

function _resolveTxt(hostname: string): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    dns.resolveTxt(
      hostname,
      (err: NodeJS.ErrnoException, addresses: string[][]) => {
        if (err) reject(err);
        resolve(addresses);
      }
    );
  });
}

async function _resolveHandshakeRecords(
  hostname: string
): Promise<IHandshakeRecord[]> {
  const namebaseCred = Buffer.from(
    `${config.namebase.ACCESS_KEY}:${config.namebase.SECRET_KEY}`
  ).toString("base64");
  const authorization = `Basic ${namebaseCred}`;

  try {
    const records = await axios.get(
      `https://www.namebase.io/api/v0/dns/domains/${hostname}/nameserver`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return records.data.records;
  } catch (error) {
    console.log(error);
  }
}

interface IDnsRecord {
  type: "A" | "AAAA" | "CNAME" | "TXT";
  name: string;
  content: string;
  ttl: number;
}

interface IHandshakeRecord {
  type: string;
  host: string;
  value: string;
  ttl: number;
}
export interface IVerified {
  domain: IDomain;
  wasVerified: boolean;
}

export default DomainService;
