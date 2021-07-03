import * as Joi from 'joi';
import Validation from '../validation';
import { IOrganization } from './model';

/**
 * @export
 * @class UserValidation
 * @extends Validation
 */
class OrganizationValidation extends Validation {
  /**
   * Creates an instance of UserValidation.
   * @memberof OrganizationValidation
   */
  constructor() {
    super();
  }

  /**
   * @param {IOrganization} params
   * @returns {Joi.ValidationResult<IOrganization >}
   * @memberof OrganizationValidation
   */
  createUser(params: IOrganization): Joi.ValidationResult<IOrganization> {
    const schema: Joi.Schema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string()
        .email({
          minDomainAtoms: 2,
        })
        .required(),
    });

    return Joi.validate(params, schema);
  }

  /**
   * @param {{ id: string }} body
   * @returns {Joi.ValidationResult<{ id: string }>}
   * @memberof OrganizationValidation
   */
  getUser(body: { id: string }): Joi.ValidationResult<{
    id: string;
  }> {
    const schema: Joi.Schema = Joi.object().keys({
      id: this.customJoi.objectId().required(),
    });

    return Joi.validate(body, schema);
  }

  /**
   * @param {{ id: string }} body
   * @returns {Joi.ValidationResult<{ id: string }>}
   * @memberof OrganizationValidation
   */
  removeUser(body: { id: string }): Joi.ValidationResult<{
    id: string;
  }> {
    const schema: Joi.Schema = Joi.object().keys({
      id: this.customJoi.objectId().required(),
    });

    return Joi.validate(body, schema);
  }
}

export default new OrganizationValidation();
