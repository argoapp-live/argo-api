const dns = require('dns');

// dns.resolveTxt('meetrekpero.xy', (err, addresses) => {
//     if (err) {
//         console.log('Error', err.message);
//     } else {
//         console.log(addresses);
//     }
// })

// const resolveTxt = new Promise((resolve, reject) => {
//     dns.lookup("www.aWebSiteName.am", (err, address, family) => {
//         if(err) reject(err);
//         resolve(address);
//     });
// })

// function resolveTxt(domainName) {
//     return new Promise((resolve, reject) => {
//         dns.resolveTxt(domainName, (err, addresses) => {
//             if(err) reject(err);
//             resolve(addresses);
//         });
//     })
// }

// (async () => {
//     const addresses = await resolveTxt("meetrekpero.xyz");
//     console.log(addresses);

//     // const adr2 = await dns.promises.resolveTxt('meetrekpero.xyz');
// })();

const addresses = [ [ 'argo=91e52389-86a8-4c36-9dd6-1ea4c2fb3ad8' ] ];

let verified = false;
const domainKey = '91e52389-86a8-4c36-9dd6-1ea4c2fb3ad8'
addresses.forEach((address) => {
    const index = address.indexOf(`argo=${domainKey}`);

    if (index > -1) verified = true;
});

console.log(verified);