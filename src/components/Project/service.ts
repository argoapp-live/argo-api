import { Types } from "mongoose";
import { ProjectModel, IProject } from "./model"; 

const ProjectService: any = {
    async insert(data: IProject): Promise<IProject> {
        try {
            return ProjectModel.create(data);
        } catch(err) {
            throw new Error(err.message);
        }
    },

    async findOne(query: Partial<IProject>): Promise<IProject> {
        try {
            return ProjectModel.findOne(query).populate({ 
                path: 'latestDeployment',
                populate: {
                  path: 'configuration',
                } 
             })
        } catch(err) {
            throw new Error(err.message);
        }
    },

    async find(query: Partial<IProject>): Promise<IProject[]> {
        try {
            return ProjectModel.find(query).populate({ 
                path: 'latestDeployment',
                populate: {
                  path: 'configuration',
                } 
             });
        } catch(err) {
            throw new Error(err.message);
        }
    },

    async findById(id: string): Promise<IProject> {
        try {
            return ProjectModel.findById(id).populate({ 
                path: 'latestDeployment',
                populate: {
                  path: 'configuration',
                } 
             });
        } catch(err) {
            throw new Error(err.message);
        }
    },

    async createIfNotExists(githubUrl: string, organizationId: string, name: string, env: any): Promise<any> {
        try {
            const existingProject = await ProjectModel.findOne({ githubUrl, organizationId });
            if(!existingProject) {
                const project = await ProjectModel.create({ name, githubUrl, organizationId, env });
                return { project, created: true };
            }
            return { project: existingProject, created: false };
        } catch(err) {
            throw new Error(err.message);
        }
    },

    async setLatestDeployment(id: Types.ObjectId, deploymentId: Types.ObjectId) {
        try {
            console.log(id, deploymentId)
            return ProjectModel.updateOne({ _id: id }, { latestDeployment: deploymentId })
        } catch(err) {
            throw new Error(err.message);
        }
    },

    async updateEnv(id: string, newEnv: any): Promise<any> {
        try {
            const project: IProject = await ProjectModel.findById(id);

            // for (const key in partialEnv) {
            //     project.env[key] = partialEnv[key]
            // }

            project.env = newEnv;

            await project.save();
            return ProjectModel.findById(id);
            
        } catch(err) {
            throw new Error(err.message);
        }
    }
}

export default ProjectService;