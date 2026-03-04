-- CreateEnum
CREATE TYPE "Language" AS ENUM ('CS', 'EN', 'DE', 'IT', 'FR', 'SK', 'ES', 'RU', 'PL');

-- CreateEnum
CREATE TYPE "Binding" AS ENUM ('SOFT', 'HARD', 'STAPLED', 'RING', 'LEPORELO', 'FLEX', 'OTHER');

-- CreateEnum
CREATE TYPE "BookCondition" AS ENUM ('VERY_GOOD', 'GOOD', 'DAMAGED');

-- CreateEnum
CREATE TYPE "CopyStatus" AS ENUM ('AVAILABLE', 'SOLD', 'RESERVED');

-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publishers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "publishers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_editions" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "publisherId" INTEGER,
    "language" "Language" NOT NULL,
    "binding" "Binding" NOT NULL,
    "yearPublished" INTEGER,
    "pageCount" INTEGER,
    "readingTimeMinutes" INTEGER,
    "description" TEXT,
    "isbn" TEXT,
    "coverImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_editions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authors_on_book_editions" (
    "bookEditionId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "authors_on_book_editions_pkey" PRIMARY KEY ("bookEditionId","authorId")
);

-- CreateTable
CREATE TABLE "book_items" (
    "id" SERIAL NOT NULL,
    "bookEditionId" INTEGER NOT NULL,
    "condition" "BookCondition" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "status" "CopyStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "books_slug_key" ON "books"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "authors_slug_key" ON "authors"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "publishers_name_key" ON "publishers"("name");

-- CreateIndex
CREATE INDEX "book_editions_bookId_idx" ON "book_editions"("bookId");

-- CreateIndex
CREATE INDEX "book_editions_language_idx" ON "book_editions"("language");

-- CreateIndex
CREATE INDEX "book_editions_publisherId_idx" ON "book_editions"("publisherId");

-- CreateIndex
CREATE INDEX "book_items_bookEditionId_status_idx" ON "book_items"("bookEditionId", "status");

-- AddForeignKey
ALTER TABLE "book_editions" ADD CONSTRAINT "book_editions_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_editions" ADD CONSTRAINT "book_editions_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "publishers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authors_on_book_editions" ADD CONSTRAINT "authors_on_book_editions_bookEditionId_fkey" FOREIGN KEY ("bookEditionId") REFERENCES "book_editions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authors_on_book_editions" ADD CONSTRAINT "authors_on_book_editions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_items" ADD CONSTRAINT "book_items_bookEditionId_fkey" FOREIGN KEY ("bookEditionId") REFERENCES "book_editions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
