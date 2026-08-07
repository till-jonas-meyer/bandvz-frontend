import type { ProfileResponses } from '../api/generated/types.gen';

declare global {
  type User = ProfileResponses[200];
}
