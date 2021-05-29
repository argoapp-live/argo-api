const Cloudflare = require('cloudflare');
import config from '../env/index';

type RecordTypes =
| "A"
| "AAAA"
| "CNAME"
| "TXT";

export interface IDnsRecord {
    type: RecordTypes;
    name: string;
    content: string;
    ttl: number;
}

const client = new Cloudflare({ email: config.cloudflare.email, token: config.cloudflare.key });


export async function addDnsRecord(record: IDnsRecord): Promise<any> {
    return client.dnsRecords.add(config.cloudflare.zoneId, record);
}