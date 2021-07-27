import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import { IMetadata } from './model';
import * as nftLib from '@argoapp/nft-js';
import * as uploaderLib from '@argoapp/nft-uploader-js'
import config from '../../config/env/index';
import { JsonRpcProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'

export async function getMetadataUrl(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
    try {
        const httpProvider = new JsonRpcProvider(config.nft.RPC_PROVIDER)
        const signer = Wallet.fromMnemonic(config.nft.MNEMONIC).connect(httpProvider)
        const nftVendor: nftLib.Vendor = new nftLib.Vendor(httpProvider, signer,undefined,undefined, config.nft.NFT_SUBGRAPH)
        const uploaderVendor = new uploaderLib.Vendor(config.arweave.PRIVATE_KEY)
        const nft: nftLib.Nft = new nftLib.Nft(nftVendor)
        const uploader: uploaderLib.Uploader = new uploaderLib.Uploader(uploaderVendor)
        console.log("Preparing Metadata", req.body);
        const {
            name,
            description,
            url,
          }: { name: string; description: string; url: string } = req.body;
        const metadata: IMetadata = {name: name, description: description, url: url}
        const signedMetadata:IMetadata = await nft.signNftData(metadata)
        const tx = await uploader.uploadMetadataToArweave(JSON.stringify(signedMetadata))
        res.status(201).json({success: true, tx});

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

