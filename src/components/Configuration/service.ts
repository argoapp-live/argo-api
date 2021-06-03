import  ConfigurationModel, { IConfiguration } from './model';
/**
 * @export
 * @implements {ConfigurationService}
 */
const ConfigurationService = {
    async findById(id: string): Promise<IConfiguration> {
        try {
            return ConfigurationModel.findById(id);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async findOne(query: Partial<IConfiguration>): Promise<IConfiguration> {
        try {
            console.log(query);
            return ConfigurationModel.findOne(query);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async insert(data: IConfiguration): Promise<IConfiguration> {
        try {
            return ConfigurationModel.create(data);
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

export default ConfigurationService;

 