import { Injectable } from '@nestjs/common';
import { PrismaService } from '@bookbot/db';
import type { ListBooksQuery } from '@bookbot/book-utils';

@Injectable()
export class BooksRepository {
  static readonly PAGE_SIZE = 20;

  constructor(private readonly prisma: PrismaService) {}

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
    const skip = (query.page - 1) * BooksRepository.PAGE_SIZE;

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
        take: BooksRepository.PAGE_SIZE,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.book.count(),
    ]);

    return { data, totalCount };
  }
}
