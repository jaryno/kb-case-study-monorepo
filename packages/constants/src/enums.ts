export const Language = {
  CS: 'CS',
  EN: 'EN',
  DE: 'DE',
  IT: 'IT',
  FR: 'FR',
  SK: 'SK',
  ES: 'ES',
  RU: 'RU',
  PL: 'PL',
} as const;

export type Language = (typeof Language)[keyof typeof Language];

export const Binding = {
  SOFT: 'SOFT',
  HARD: 'HARD',
  STAPLED: 'STAPLED',
  RING: 'RING',
  LEPORELO: 'LEPORELO',
  FLEX: 'FLEX',
  OTHER: 'OTHER',
} as const;

export type Binding = (typeof Binding)[keyof typeof Binding];

export const BookCondition = {
  VERY_GOOD: 'VERY_GOOD',
  GOOD: 'GOOD',
  DAMAGED: 'DAMAGED',
} as const;

export type BookCondition =
  (typeof BookCondition)[keyof typeof BookCondition];

export const CopyStatus = {
  AVAILABLE: 'AVAILABLE',
  SOLD: 'SOLD',
  RESERVED: 'RESERVED',
} as const;

export type CopyStatus = (typeof CopyStatus)[keyof typeof CopyStatus];

