import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PrismaService } from '@bookbot/db';
import type { ListBooksQuery, RawFiltersInput } from '@bookbot/book-utils';
import { booksConfig } from './books.config';

@Injectable()
export class BooksRepository {

  constructor(
    private readonly prisma: PrismaService,
    @Inject(booksConfig.KEY) private readonly config: ConfigType<typeof booksConfig>,
  ) {}

  async findBySlug(slug: string) {
    return this.prisma.book.findUnique({
      where: { slug },
      include: {
        editions: {
          include: {
            publisher: true,
            authors: {
              include: { author: true },
            },
            items: {
              orderBy: { price: 'asc' },
            },
          },
        },
      },
    });
  }

  async findMany(query: ListBooksQuery) {
    const skip = (query.page - 1) * this.config.pageSize;

    const [data, totalCount] = await Promise.all([
      this.prisma.book.findMany({
        include: {
          editions: {
            include: {
              publisher: true,
              authors: { include: { author: true } },
              items: true,
            },
          },
        },
        skip,
        take: this.config.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.book.count(),
    ]);

    return { data, totalCount };
  }

  async getFilters(): Promise<RawFiltersInput> {
    const [
      languageGroups,
      bindingGroups,
      conditionGroups,
      priceAgg,
      yearAgg,
      authorEditionCounts,
      publisherEditionCounts,
    ] = await Promise.all([
      this.prisma.bookEdition.groupBy({
        by: ['language'],
        _count: { _all: true },
        orderBy: { _count: { language: 'desc' } },
      }),
      this.prisma.bookEdition.groupBy({
        by: ['binding'],
        _count: { _all: true },
        orderBy: { _count: { binding: 'desc' } },
      }),
      this.prisma.bookItem.groupBy({
        by: ['condition'],
        _count: { _all: true },
        orderBy: { _count: { condition: 'desc' } },
      }),
      this.prisma.bookItem.aggregate({
        _min: { price: true },
        _max: { price: true },
      }),
      this.prisma.bookEdition.aggregate({
        _min: { yearPublished: true },
        _max: { yearPublished: true },
      }),
      this.prisma.authorsOnBookEditions.groupBy({
        by: ['authorId'],
        _count: { _all: true },
        orderBy: { _count: { authorId: 'desc' } },
        take: this.config.topFilterLimit,
      }),
      this.prisma.bookEdition.groupBy({
        by: ['publisherId'],
        _count: { _all: true },
        orderBy: { _count: { publisherId: 'desc' } },
        where: { publisherId: { not: null } },
        take: this.config.topFilterLimit,
      }),
    ]);

    const authorIds = authorEditionCounts.map((a) => a.authorId);
    const authors = authorIds.length
      ? await this.prisma.author.findMany({
          where: { id: { in: authorIds } },
        })
      : [];
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    const publisherIds = publisherEditionCounts
      .map((p) => p.publisherId)
      .filter((id): id is number => id !== null);
    const publishers = publisherIds.length
      ? await this.prisma.publisher.findMany({
          where: { id: { in: publisherIds } },
        })
      : [];
    const publisherMap = new Map(publishers.map((p) => [p.id, p]));

    return {
      languageGroups: languageGroups.map((g) => ({
        language: g.language,
        count: g._count._all,
      })),
      bindingGroups: bindingGroups.map((g) => ({
        binding: g.binding,
        count: g._count._all,
      })),
      conditionGroups: conditionGroups.map((g) => ({
        condition: g.condition,
        count: g._count._all,
      })),
      priceRange: {
        min: priceAgg._min.price,
        max: priceAgg._max.price,
      },
      yearRange: {
        min: yearAgg._min.yearPublished,
        max: yearAgg._max.yearPublished,
      },
      authorEditionCounts: authorEditionCounts
        .map((g) => {
          const author = authorMap.get(g.authorId);
          if (!author) return null;
          return { author: { id: author.id, name: author.name, slug: author.slug }, count: g._count._all };
        })
        .filter((a): a is NonNullable<typeof a> => a !== null),
      publisherEditionCounts: publisherEditionCounts
        .map((g) => {
          if (g.publisherId === null) return null;
          const publisher = publisherMap.get(g.publisherId);
          if (!publisher) return null;
          return { publisher: { id: publisher.id, name: publisher.name }, count: g._count._all };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null),
    };
  }
}
