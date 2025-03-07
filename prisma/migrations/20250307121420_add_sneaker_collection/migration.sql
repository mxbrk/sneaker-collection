-- CreateTable
CREATE TABLE "SneakerCollection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sneakerId" TEXT NOT NULL,
    "sneakerName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "imageUrl" TEXT,
    "sizeUS" DOUBLE PRECISION NOT NULL,
    "sizeEU" DOUBLE PRECISION NOT NULL,
    "sizeUK" DOUBLE PRECISION NOT NULL,
    "condition" TEXT NOT NULL,
    "notes" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "releaseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SneakerCollection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SneakerCollection" ADD CONSTRAINT "SneakerCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
