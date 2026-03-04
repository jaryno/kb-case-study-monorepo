import {
  Language as ConstantsLanguage,
  Binding as ConstantsBinding,
  BookCondition as ConstantsBookCondition,
  CopyStatus as ConstantsCopyStatus,
} from '@bookbot/constants';

import {
  Language as PrismaLanguage,
  Binding as PrismaBinding,
  BookCondition as PrismaBookCondition,
  CopyStatus as PrismaCopyStatus,
} from '../generated/client/enums.js';

describe('@bookbot/constants ↔ Prisma enum sync', () => {
  it('Language values match', () => {
    expect(ConstantsLanguage).toEqual(PrismaLanguage);
  });

  it('Binding values match', () => {
    expect(ConstantsBinding).toEqual(PrismaBinding);
  });

  it('BookCondition values match', () => {
    expect(ConstantsBookCondition).toEqual(PrismaBookCondition);
  });

  it('CopyStatus values match', () => {
    expect(ConstantsCopyStatus).toEqual(PrismaCopyStatus);
  });
});

