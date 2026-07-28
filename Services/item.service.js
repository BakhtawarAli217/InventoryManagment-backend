const prisma = require("../prismaClient");

module.exports.createItem = async ({
  name,
  categoryId,
  brandId,
  itemModelId,
  stock,
  price,
  categoryName,
  brandName,
  modelName,
  image
}) => {
  try {
    const item = await prisma.item.create({
      data: {
        name,
        categoryId,
        brandId,
        itemModelId,
        stock,
        price,
        categoryName,
        brandName,
        modelName,
        image
      },
    });
    return item;
  } catch (e) {
    throw new Error(e.message);
  }
};
