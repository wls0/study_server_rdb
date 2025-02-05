export const SocialAuth = {
  APPLE: 'apple',
  GOOGLE: 'google',
} as const;

export type SocialAuth = (typeof SocialAuth)[keyof typeof SocialAuth];
