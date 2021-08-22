import SharedParameterModel, { ISharedParameter } from "./model";


const SharedParameterService = {
    async insert(data: any): Promise<ISharedParameter> {
        return SharedParameterModel.create(data);
    },

    async findById(id: string): Promise<ISharedParameter> {
        return SharedParameterModel.findById(id);
    },

    async findOne(query: any): Promise<ISharedParameter> {
        return SharedParameterModel.findOne(query);
    },

    async find(query: any): Promise<Array<ISharedParameter>> {
        return SharedParameterModel.find(query);
    },
    
}

export default SharedParameterService;