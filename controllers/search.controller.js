const prisma = require("../prismaClient");

module.exports.searchItem = async (req, res) => {
  try {
    const { name, minPrice, maxPrice } = req.query;

    // if (!name) {
    //   return res.status(404).json({ message: "Search Query is Required" });
    // }

    if (name && name?.length < 2) {
      return res
        .status(400)
        .json({ message: "Search Query must be greater then two words" });
    }
    if ((minPrice && minPrice <= 0) || (maxPrice && maxPrice <= 0)) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      return res
        .status(400)
        .json({ message: "Min Price must be smaller than Max Price" });
    }
    const where = {};
    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = Number(minPrice);
      }
      if (maxPrice) {
        where.price.lte = Number(maxPrice);
      }
    }
    const items = await prisma.item.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
    return res
      .status(200)
      .json({ message: "Items fetched Successfully", data: items });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};
