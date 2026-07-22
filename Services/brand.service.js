const prisma = require("../prismaClient");

module.exports.createBrand = async ({ name ,categoryId}) => {
  try {
    const brand = await prisma.brand.create({
      data: {
        name,
        categoryId
      },
    });
    return brand;
  } catch (e) {
    throw new Error(e.message);
  }
};
