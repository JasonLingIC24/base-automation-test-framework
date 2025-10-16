import Logger from '../../logger';

/**
 * Base entity which is a parent entity for all web entities (such as base element, base page, sidebar etc.)
 */
export class BaseEntity {
  /**
   * Entity name, which is used to identify proper element/page in logs
   */
  private _entityName: string;

  /**
   * Logger of base entity, helps to write and read logs properly
   */
  private _logger: Logger;

  /**
   * Creates an instance of base entity.
   * @param entityName {string} A name of element / page that you're creating in your code.
   */
  constructor(entityName: string) {
    this._entityName = entityName;
    this._logger = new Logger(entityName);
  }

  /**
   * Entity name getter
   */
  get entityName() {
    return this._entityName;
  }

  /**
   * Logger getter
   */
  get logger() {
    return this._logger;
  }
}
