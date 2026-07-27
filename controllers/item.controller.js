const express = require("express");
const prisma = require("../prismaClient");
const itemServices = require("../Services/item.service");
const cloudinary = require("../config/cloudinary.config");

module.exports.addItem = async (req, res) => {
  try {
    const { name, category, price, model, brand, stock } = req.body;
    if (!name || !category || !price || !model || !brand || !stock) {
      return res.status(404).json({ message: "All fields are required" });
    }
    if (price <= 0) {
      return res.status(400).json({ message: "Invalid Price Value" });
    }
    if (stock <= 0) {
      return res.status(400).json({ message: "Invalid Stock Value" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const url = req.file.path;
    const public_id = req.file.filename;

    const isCategory = await prisma.category.findUnique({
      where: {
        id: category,
      },
    });
    if (!isCategory) {
      return res.status(404).json({ message: "Invalid Category" });
    }
    const isBrand = await prisma.brand.findUnique({
      where: {
        id: brand,
      },
    });
    if (!isBrand) {
      return res.status(404).json({ message: "Invalid Brand" });
    }
    const isModel = await prisma.brandModel.findUnique({
      where: {
        id: model,
      },
    });
    console.log(isModel);
    if (!isModel) {
      return res.status(404).json({ message: "Invalid Model" });
    }
    const isexistingItem = await prisma.item.findFirst({
      where: {
        name: name,
        brandId: brand,
        itemModelId: model,
        categoryId: category,
      },
    });
    if (isexistingItem) {
      return res
        .status(404)
        .json({ message: "An Item with data is already exist" });
    }
    const categoryName = isCategory.name;
    const brandName = isBrand.name;
    const modelName = isModel.name;
    const item = await itemServices.createItem({
      name,
      categoryId: category,
      brandId: brand,
      itemModelId: model,
      stock: Number(stock),
      price: Number(price),
      categoryName: categoryName,
      brandName: brandName,
      modelName: modelName,
      image: {
        url: url,
        public_id: public_id,
      },
    });

    return res
      .status(201)
      .json({ message: "Item Added Successfully", data: item });
  } catch (e) {
    console.log(e)
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
      
  }
};
module.exports.getAllItems = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = page ? parseInt(page) : 1;
    const parsedlimit = limit ? parseInt(limit) : 10;
    const skip = (parsedPage - 1) * parsedlimit;
    const items = await prisma.item.findMany({
      skip: skip,
      take: parsedlimit,
      orderBy: {
        createdAt: "desc",
      },
    });
    const total = await prisma.item.count();
    const hasMore = items.length + skip < total;
    res
      .status(200)
      .json({
        message: "Items Fetched Successfully",
        data: items,
        hasMore: hasMore,
        total: total,
      });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};

module.exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Item ID is required" });
    }
    const parsedId = parseInt(id);
    const existingItem = await prisma.item.findUnique({
      where: {
        id: parsedId,
      },
    });

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    const deletedItem = await prisma.item.delete({
      where: {
        id: parsedId,
      },
    });

    return res.status(200).json({
      message: "Item deleted successfully",
      data: deletedItem,
    });
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

module.exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ message: "Item Id is required" });
    }
    const parsedId = parseInt(id);
    const item = await prisma.item.findUnique({
      where: {
        id: parsedId,
      },
      include: {
        category: true,
        brand: true,
        itemModel: true,
      },
    });
    if (!item) {
      return res.status(404).json({ message: "Invalid Item Id" });
    }

    return res
      .status(200)
      .json({ message: "Item Fetched Successfully", data: item });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};

module.exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      price,
      model,
      brand,
      stock,
      categoryName,
      brandName,
      modelName,
    } = req.body;
    if (!id) {
      return res.status(404).json({ message: "Item Id is required" });
    }
    const parsedId = parseInt(id);
    const existingItem = await prisma.item.findUnique({
      where: {
        id: parsedId,
      },
    });
    if (!existingItem) {
      return res.status(404).json({ message: "Invalid Item Id" });
    }
    console.log(categoryName);
    const updatedItem = await prisma.item.update({
      where: {
        id: parsedId,
      },
      data: {
        name: name || existingItem.name,
        categoryId: category || existingItem.categoryId,
        brandId: brand || existingItem.brandId,
        itemModelId: model || existingItem.itemModelId,
        price: Number(price) || existingItem.price,
        stock: Number(stock) || existingItem.stock,
        categoryName: categoryName || existingItem.categoryName,
        brandName: brandName || existingItem.brandName,
        modelName: modelName || existingItem.modelName,
      },
    });
    return res
      .status(200)
      .json({ message: "Item Updated Successfully", data: updatedItem });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};
