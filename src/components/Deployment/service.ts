import { Types } from "mongoose";
import { IDeployment, DeploymentModel, IScreenshot } from './model';
import { IDeploymentService } from "./service-interface";
import * as uploaderLib from '@argoapp/nft-uploader-js'
import config from '../../config/env/index';

const DeploymentService: IDeploymentService = {
    async create(topic: string, projectId: string, configurationId: string): Promise<IDeployment> {

        const deployment: any = {
            topic,
            project: projectId,
            configuration: configurationId
        };
        
        return DeploymentModel.create(deployment);
    },

    async findById(id: string): Promise<IDeployment> {
        return DeploymentModel.findById(id).populate("configuration").populate("project");
    },

    async findOne(query: Partial<IDeployment>): Promise<IDeployment> {
        return DeploymentModel.findOne(query).populate("configuration");
    },

    async findLatest(projectId: string): Promise<IDeployment> {
        const latest = await DeploymentModel.find({ project: Types.ObjectId(projectId) }).sort({"updatedAt": "desc"}).populate("configuration")
        return latest[0];
    },

    async findLatestDeployed(projectId: string): Promise<IDeployment> {
        const latest = await DeploymentModel.find({ project: Types.ObjectId(projectId), status: "Deployed" }).sort({"updatedAt": "desc"}).populate("configuration")
        return latest[0];
    },

    async find(query: Partial<IDeployment>): Promise<Array<IDeployment>> {
        return DeploymentModel.find(query).populate("configuration").populate("project")
    },

    async updateFinishedDeployment(deploymentId: string, sitePreview: string, status: string, buildTime: number, logs: Array<string>): Promise<IDeployment> {
        const condition = {
            '_id': Types.ObjectId(deploymentId)
        }

        const update = {
            sitePreview,
            status,
            buildTime,
            logs,
        }

        return DeploymentModel.findOneAndUpdate(condition, update);
    },

    async updatePayment(deploymentId: string, paymentId: string): Promise<IDeployment> {
        const condition = {
            '_id': Types.ObjectId(deploymentId)
        }
        
        const update = {
            paymentId,
        }

        return DeploymentModel.findOneAndUpdate(condition, update);
    },
    
    async updateScreenshot(deploymentId: string, screenshot: IScreenshot): Promise<IDeployment> {
        const condition = {
            '_id': Types.ObjectId(deploymentId)
        }
        
        const update = {
            screenshot,
        }

        return DeploymentModel.findOneAndUpdate(condition, update);
    },
    async uploadScreenshotToArweave(url: string): Promise<IScreenshot>{
        const uploaderVendor: uploaderLib.Vendor = new uploaderLib.Vendor(config.arweave.PRIVATE_KEY)
        const uploader: uploaderLib.Uploader = new uploaderLib.Uploader(uploaderVendor)
        const screenshot: IScreenshot = await uploader.uploadScreenshotToArweave(url)
        console.log(screenshot)
        return screenshot;
    }

}

export default DeploymentService;
