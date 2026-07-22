const prisma = require("../prismaClient");
const categoryService=require("../Services/category.service")

module.exports.UploadCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(404).json({ message: "Name is required" });
    }
    const normalizedName = name.toLowerCase().trim();

    const existing = await prisma.category.findUnique({
      where: {
        name: normalizedName,
      },
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "A category with name is already exist" });
    }

    const category = await categoryService.createCategory({name})
    return res
      .status(201)
      .json({ message: "Category Upload Successfully", data: category });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};

module.exports.getCategories = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = page ? parseInt(page) : 1;
    const parsedlimit = limit ? parseInt(limit) : 10;
    const skip = (parsedPage - 1) * parsedlimit;
    const categories = await prisma.category.findMany({
      skip: skip,
      take: parsedlimit,
    });
    const total = await prisma.category.count();
    const hasMore = categories.length + skip < total;
    return res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
      hasMore: hasMore,
      total:total
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};
module.exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if(!id){
      return res.status(400).json({ message: "Category ID is required" });
    }
    
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    await prisma.item.deleteMany({
      where:{
        categoryId:id
      }
    });
    const deletedCategory = await prisma.category.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json({
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (e) {
    return res.status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};