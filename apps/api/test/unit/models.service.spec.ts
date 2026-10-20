import { describe, expect, it, vi } from 'vitest';
import { ModelsService } from '../../src/modules/models/application/models.service.js';

const mazda = { id: 'brand-mazda', slug: 'mazda' };
const cx30 = { id: 'model-1', brandId: mazda.id, name: 'CX30', slug: 'mazda-cx30' };

function setup() {
  const models = {
    findById: vi.fn().mockResolvedValue(cx30),
    create: vi.fn(async (data) => data),
    update: vi.fn(async (_id, data) => ({ ...cx30, ...data })),
  };
  const brands = { get: vi.fn().mockResolvedValue(mazda) };
  // Los dobles solo implementan lo que usa el servicio.
  return { service: new ModelsService(models as never, brands as never), models };
}

describe('ModelsService', () => {
  it('al crear arma el slug con la marca', async () => {
    const { service, models } = setup();
    await service.create({ brandId: mazda.id, name: 'CX-30', bodyType: 'suv', fuelType: 'gasoline' });
    expect(models.create).toHaveBeenCalledWith(expect.objectContaining({ slug: 'mazda-cx-30' }));
  });

  it('al renombrar rehace el slug', async () => {
    const { service, models } = setup();
    await service.update(cx30.id, { name: 'CX-30' });
    expect(models.update).toHaveBeenCalledWith(cx30.id, { name: 'CX-30', slug: 'mazda-cx-30' });
  });

  it('si no cambia el nombre ni la marca, no toca el slug', async () => {
    const { service, models } = setup();
    await service.update(cx30.id, { bodyType: 'sedan' });
    expect(models.update).toHaveBeenCalledWith(cx30.id, { bodyType: 'sedan' });
  });
});
