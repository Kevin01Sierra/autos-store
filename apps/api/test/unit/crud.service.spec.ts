import { describe, expect, it } from 'vitest';
import type { CrudRepository } from '../../src/shared/application/crud.repository.js';
import { CrudService } from '../../src/shared/application/crud.service.js';
import { NotFoundError } from '../../src/shared/domain/domain-errors.js';

type Item = { id: string; name: string };

class InMemoryRepository implements CrudRepository<Item, Item, Partial<Item>> {
  readonly items = new Map<string, Item>();
  findAll = async () => [...this.items.values()];
  findById = async (id: string) => this.items.get(id) ?? null;
  create = async (item: Item) => (this.items.set(item.id, item), item);
  update = async (id: string, data: Partial<Item>) => {
    const item = this.items.get(id);
    return item ? (this.items.set(id, { ...item, ...data }), this.items.get(id)!) : null;
  };
  remove = async (id: string) => this.items.delete(id);
}

class ItemsService extends CrudService<Item, Item, Partial<Item>, { name: string }> {
  protected readonly entityName = 'Item';
  constructor(repository: InMemoryRepository) {
    super(repository);
  }
  protected prepareCreate(input: { name: string }): Item {
    return { id: input.name.toLowerCase(), name: input.name };
  }
}

describe('CrudService', () => {
  const setup = () => new ItemsService(new InMemoryRepository());

  it('crea usando la transformación de la subclase', async () => {
    const service = setup();
    await expect(service.create({ name: 'Mazda' })).resolves.toEqual({ id: 'mazda', name: 'Mazda' });
  });

  it('lanza NotFoundError al consultar, actualizar o borrar algo inexistente', async () => {
    const service = setup();
    await expect(service.get('x')).rejects.toBeInstanceOf(NotFoundError);
    await expect(service.update('x', { name: 'y' })).rejects.toBeInstanceOf(NotFoundError);
    await expect(service.remove('x')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('actualiza y lista', async () => {
    const service = setup();
    await service.create({ name: 'Kia' });
    await service.update('kia', { name: 'KIA' });
    await expect(service.list()).resolves.toEqual([{ id: 'kia', name: 'KIA' }]);
  });
});
