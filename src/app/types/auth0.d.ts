// types/auth0.d.ts
import { UserProfile } from 'auth0';

export interface ExtendedUserProfile extends UserProfile {
  "https://run.shawsoft.io/athleteId"?: number;
  "https://run.shawsoft.io/roles"?: string[];
}