import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BooksRepository } from './books.repository';
import { booksConfig } from './books.config';

@Module({
  imports: [ConfigModule.forFeature(booksConfig)],
  controllers: [BooksController],
  providers: [BooksService, BooksRepository],
})
export class BooksModule {}
