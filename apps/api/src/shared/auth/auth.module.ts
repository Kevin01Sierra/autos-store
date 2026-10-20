import { Global, Module } from '@nestjs/common';
import { ROLE_READER, TOKEN_VERIFIER } from './auth-user.js';
import { AuthGuard } from './auth.guard.js';
import { ProfileRoleReader } from './profile-role.reader.js';
import { SupabaseTokenVerifier } from './supabase-token.verifier.js';

@Global()
@Module({
  providers: [
    AuthGuard,
    { provide: TOKEN_VERIFIER, useClass: SupabaseTokenVerifier },
    { provide: ROLE_READER, useClass: ProfileRoleReader },
  ],
  exports: [AuthGuard, TOKEN_VERIFIER, ROLE_READER],
})
export class AuthModule {}
