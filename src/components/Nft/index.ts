import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import { IMetadata } from './model';
import {Nft, Vendor, Services} from '@argoapp/nft-js';
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
        const vendor =new Vendor(httpProvider, signer,undefined,undefined, config.nft.NFT_SUBGRAPH)
        const services = new Services(config.arweave.key)
        const nftLib = new Nft(vendor, services)
        console.log("Preparing Metadata", req.body);
        const {
            name,
            description,
            url,
          }: { name: string; description: string; url: string } = req.body;
        const metadata: IMetadata = {name: name, description: description, url: url}
        const signedMetadata:IMetadata = await nftLib.signNftData(metadata)
        const tx = await nftLib.uploadMetadataToArweave(JSON.stringify(signedMetadata))
        res.status(201).json({success: true, tx});

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

