import { NotFoundError } from '../domain/domain-errors.js';
import type { CrudRepository } from './crud.repository.js';

/**
 * Servicio CRUD base (patrón Template Method): define el flujo común y deja
 * que cada subclase personalice `prepareCreate`/`prepareUpdate` si lo necesita.
 */
export abstract class CrudService<TEntity, TCreate, TUpdate, TInput = TCreate> {
  protected abstract readonly entityName: string;

  protected constructor(
    protected readonly repository: CrudRepository<TEntity, TCreate, TUpdate>,
  ) {}

  list(): Promise<TEntity[]> {
    return this.repository.findAll();
  }

  async get(id: string): Promise<TEntity> {
    return this.orFail(await this.repository.findById(id), id);
  }

  create(input: TInput): Promise<TEntity> {
    return this.repository.create(this.prepareCreate(input));
  }

  async update(id: string, input: TUpdate): Promise<TEntity> {
    return this.orFail(await this.repository.update(id, this.prepareUpdate(input)), id);
  }

  async remove(id: string): Promise<void> {
    if (!(await this.repository.remove(id))) throw new NotFoundError(this.entityName, id);
  }

  protected abstract prepareCreate(input: TInput): TCreate;

  protected prepareUpdate(input: TUpdate): TUpdate {
    return input;
  }

  private orFail(entity: TEntity | null, id: string): TEntity {
    if (!entity) throw new NotFoundError(this.entityName, id);
    return entity;
  }
}
