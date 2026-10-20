import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from './api-error';
import { HttpClient, toQueryString } from './http-client';

describe('toQueryString', () => {
  it('omite valores vacíos', () => {
    expect(toQueryString({ brandId: 'a', colorId: '', page: 2, x: undefined })).toBe('?brandId=a&page=2');
    expect(toQueryString({})).toBe('');
  });
});

describe('HttpClient', () => {
  afterEach(() => vi.restoreAllMocks());

  it('envía el token inyectado y serializa el cuerpo', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"ok":true}'));
    const client = new HttpClient('https://api.test', async () => 'token-123');
    await expect(client.post('/orders', { a: 1 })).resolves.toEqual({ ok: true });
    const [, init] = fetchMock.mock.calls[0]!;
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer token-123');
    expect(init?.body).toBe('{"a":1}');
  });

  it('convierte respuestas de error en ApiError con el mensaje del backend', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{"message":"Stock insuficiente"}', { status: 422 }),
    );
    const client = new HttpClient('https://api.test', async () => null);
    await expect(client.get('/x')).rejects.toEqual(new ApiError(422, 'Stock insuficiente'));
  });
});
