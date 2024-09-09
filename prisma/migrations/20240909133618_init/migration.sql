-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pictures" (
    "id" SERIAL NOT NULL,
    "smallPic" TEXT NOT NULL,
    "largePics" TEXT[],
    "productId" INTEGER,

    CONSTRAINT "Pictures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Description" (
    "id" SERIAL NOT NULL,
    "descriptionShort" TEXT NOT NULL,
    "descriptionLong" TEXT NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "Description_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDetails" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "hotness" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "ProductDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "average" DOUBLE PRECISION NOT NULL,
    "nrOfReviews" INTEGER NOT NULL,
    "productDetailId" INTEGER,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pictures_productId_key" ON "Pictures"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Description_productId_key" ON "Description"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDetails_productId_key" ON "ProductDetails"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_productDetailId_key" ON "Rating"("productDetailId");

-- AddForeignKey
ALTER TABLE "Pictures" ADD CONSTRAINT "Pictures_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDetails" ADD CONSTRAINT "ProductDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_productDetailId_fkey" FOREIGN KEY ("productDetailId") REFERENCES "ProductDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
