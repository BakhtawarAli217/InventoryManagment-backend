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
module.exports.searchBrand = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(404).json({ message: "Search query is required" });
    }
    if (q.length < 2) {
      return res
        .status(400)
        .json({ message: "Search query must be atleast 2 characters long" });
    }
    const brand = await prisma.brand.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
    });
    return res
      .status(200)
      .json({ message: "Brand fetched Successfully", data: brand });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server error", error: e.message });
  }
};
module.exports.searchModel = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(404).json({ message: "Search Query is required" });
    }
    if (q.length < 2) {
      return res
        .status(400)
        .json({ message: "Search query must be atleast 2 characters long" });
    }
    const model = await prisma.brandModel.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      include:{
        brand:true
      }
    });
    return res
      .status(200)
      .json({ message: "Models fetched Successfully", data: model });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};

module.exports.searchCategory = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(404).json({ message: "Search Query is required" });
    }
    if (q.length < 2) {
      return res
        .status(400)
        .json({ message: "Search query must be atleast 2 characters long" });
    }
    const category = await prisma.category.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      }
    });
    return res
      .status(200)
      .json({ message: "Category fetched Successfully", data: category });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};
