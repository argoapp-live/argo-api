import {DNS} from '@google-cloud/dns';

const GoogleCloudService = {

    async addRecordToDnsZone(dnsZoneName: string, recordType: string, dnsName: string, data: string, ttl: number) : Promise<any> {
        const dns = new DNS();
        const zone = dns.zone(dnsZoneName);

        const record = zone.record(recordType, {
            name: dnsName,
            data: data,
            ttl: ttl,
        });

        return zone.addRecords(record);
    }
}

export default GoogleCloudService;

