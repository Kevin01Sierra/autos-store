import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { preferencesSchema, type PreferencesDto } from '@autos/contracts';
import type { AuthUser } from '../../../shared/auth/auth-user.js';
import { Auth, CurrentUser } from '../../../shared/auth/auth.decorators.js';
import { ZodValidationPipe } from '../../../shared/http/zod-validation.pipe.js';
import { PreferencesService } from '../application/preferences.service.js';
import { RecommendationsService } from '../application/recommendations.service.js';

const limitPipe = [new DefaultValuePipe(8), ParseIntPipe];

@ApiTags('Recomendaciones')
@Controller()
export class RecommendationsController {
  constructor(
    private readonly recommendations: RecommendationsService,
    private readonly preferences: PreferencesService,
  ) {}

  /** Público: el onboarding funciona incluso sin iniciar sesión. */
  @Post('recommendations')
  recommend(
    @Body(new ZodValidationPipe(preferencesSchema)) body: PreferencesDto,
    @Query('limit', ...limitPipe) limit: number,
  ) {
    return this.recommendations.recommend(body, Math.min(limit, 24));
  }

  @Get('recommendations/me')
  @Auth()
  mine(@CurrentUser() user: AuthUser, @Query('limit', ...limitPipe) limit: number) {
    return this.recommendations.forUser(user.id, Math.min(limit, 24));
  }

  @Get('preferences/me')
  @Auth()
  getPreferences(@CurrentUser() user: AuthUser) {
    return this.preferences.get(user.id);
  }

  @Put('preferences/me')
  @Auth()
  savePreferences(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(preferencesSchema)) body: PreferencesDto,
  ) {
    return this.preferences.save(user.id, body);
  }
}
