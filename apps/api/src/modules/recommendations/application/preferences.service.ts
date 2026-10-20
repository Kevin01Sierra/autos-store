import { Inject, Injectable } from '@nestjs/common';
import type { PreferencesDto } from '@autos/contracts';
import {
  EMPTY_PREFERENCES, PREFERENCES_REPOSITORY, type PreferencesRepository,
} from './recommendation.ports.js';

@Injectable()
export class PreferencesService {
  constructor(
    @Inject(PREFERENCES_REPOSITORY) private readonly preferences: PreferencesRepository,
  ) {}

  async get(userId: string): Promise<PreferencesDto> {
    return (await this.preferences.find(userId)) ?? EMPTY_PREFERENCES;
  }

  save(userId: string, preferences: PreferencesDto): Promise<PreferencesDto> {
    return this.preferences.save(userId, preferences);
  }
}
