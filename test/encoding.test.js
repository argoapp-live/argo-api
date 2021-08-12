const { describe, it } = require('mocha');
const { expect } = require('chai');

/**
 * Encoding tests
 */
describe('Base64', () => {
    it('encode', async () => {
        let data = "abcd1234";

        let buff = new Buffer(data);
        let base64data = buff.toString('base64');

        expect(base64data).to.be.equal("YWJjZDEyMzQ=");
    });

    it('decode', async () => {
        let base64data = "YWJjZDEyMzQ=";

        let buff = new Buffer(base64data, 'base64');
        let data = buff.toString('ascii');

        expect(data).to.be.equal("abcd1234");
    });
});
