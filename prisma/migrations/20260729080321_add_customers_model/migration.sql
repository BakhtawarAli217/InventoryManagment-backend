-- CreateTable
CREATE TABLE "Customers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "homeAddress" TEXT NOT NULL,
    "Country" TEXT NOT NULL,
    "State" TEXT NOT NULL,
    "City" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);
