import  DomainModel, { IDomain } from './model';
/**
 * @export
 * @implements {DomainService}
 */
const DomainService = {
    async findById(id: string): Promise<IDomain> {
        try {
            return DomainModel.findById(id);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async findOne(query: Partial<IDomain>): Promise<IDomain> {
        try {
            console.log(query);
            return DomainModel.findOne(query);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async insert(data: IDomain): Promise<IDomain> {
        try {
            return DomainModel.create(data);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async verify(): Promise<boolean> {
        try {
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async update(): Promise<IDomain> {
        try {
            return DomainModel.update({}, {});
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async remove(): Promise<any> {
        try {
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

export default DomainService;

 