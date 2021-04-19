import { resolveTxt } from "dns";
import { promisify } from "util";

const resolveTxtRecords = promisify(resolveTxt);

export const recordsForHostname = async (
  hostname: string
): Promise<Array<string>> => {
  var argoDomainKeys = new Array();
  const records = await resolveTxtRecords(hostname);

  records.forEach((elements) => {
    elements.forEach((element) => {
      if (element.indexOf("argo=") !== -1) {
        const argoDomainKey = element.split("=")[1];
        if (argoDomainKey) argoDomainKeys.push(argoDomainKey);
      }
    });
  });

  return argoDomainKeys;
};
