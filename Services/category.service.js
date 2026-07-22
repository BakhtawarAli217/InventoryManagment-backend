const prisma = require("../prismaClient");

module.exports.createCategory = async ({ name }) => {
  try {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    return category
  } catch (e) {
    throw new Error(e.message);
  }
};
