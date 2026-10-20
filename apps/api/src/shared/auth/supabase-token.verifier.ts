import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { TokenVerifier } from './auth-user.js';

/** Adaptador: valida JWT emitidos por Supabase Auth usando su JWKS público. */
@Injectable()
export class SupabaseTokenVerifier implements TokenVerifier {
  private readonly jwks;
  private readonly issuer: string;

  constructor(config: ConfigService) {
    const baseUrl = config.getOrThrow<string>('SUPABASE_URL');
    this.issuer = `${baseUrl}/auth/v1`;
    this.jwks = createRemoteJWKSet(new URL(`${this.issuer}/.well-known/jwks.json`));
  }

  async verify(token: string): Promise<{ userId: string; email?: string }> {
    const { payload } = await jwtVerify(token, this.jwks, {
      issuer: this.issuer,
      audience: 'authenticated',
    });
    if (!payload.sub) throw new Error('Token sin sujeto');
    return { userId: payload.sub, email: payload['email'] as string | undefined };
  }
}
