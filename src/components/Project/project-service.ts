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
            return ProjectModel.findOne(query);
        } catch(err) {
            throw new Error(err.message);
        }
    },

    async find(query: Partial<IProject>): Promise<IProject[]> {
        try {
            return ProjectModel.find(query);
        } catch(err) {
            throw new Error(err.message);
        }
    },

    async findById(id: string): Promise<IProject> {
        try {
            return ProjectModel.findById(id);
        } catch(err) {
            throw new Error(err.message);
        }
    },

    async createIfNotExists(githubUrl: string, organizationId: string, name: string): Promise<IProject> {
        try {
            const project = await ProjectModel.findOne({ githubUrl, organizationId });
            if(!project) {
                return ProjectModel.create({ name, githubUrl, organizationId });
            }
            return project
        } catch(err) {
            throw new Error(err.message);
        }
    }
}

export default ProjectService;