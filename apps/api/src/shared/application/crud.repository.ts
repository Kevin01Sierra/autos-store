/** Puerto genérico de persistencia (patrón Repository). */
export interface CrudRepository<TEntity, TCreate, TUpdate> {
  findAll(): Promise<TEntity[]>;
  findById(id: string): Promise<TEntity | null>;
  create(data: TCreate): Promise<TEntity>;
  update(id: string, data: TUpdate): Promise<TEntity | null>;
  remove(id: string): Promise<boolean>;
}
