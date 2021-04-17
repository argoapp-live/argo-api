import { resolveTxt } from "dns";
import { promisify } from "util";

const resolveTxtRecords = promisify(resolveTxt);

export const recordsForHostname = async (
  hostname: string
): Promise<Array<string>> => {
  var uuids = new Array();
  const records = await resolveTxtRecords(hostname);

  records.forEach((elements) => {
    elements.forEach((element) => {
      if (element.indexOf("uuid=") !== -1) {
        const uuid = element.split("=")[1];
        console.log(element, uuid);
        if (uuid) uuids.push(uuid);
      }
    });
  });

  return uuids;
};
