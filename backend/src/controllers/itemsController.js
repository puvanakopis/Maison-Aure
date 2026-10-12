const mongoose = require("mongoose");
const Item = require("../models/ItemModel");
const { menuCategories, seedMenuItems } = require("../config/seedData");

// GET /api/items (Public)
async function getAllItems(req, res) {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { ingredients: { $regex: search, $options: "i" } },
      ];
    }

    const items = await Item.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Error fetching items from MongoDB:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve menu items from database.",
    });
  }
}

// GET /api/items/categories (Public)
function getCategories(req, res) {
  try {
    return res.status(200).json({
      success: true,
      data: menuCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve categories.",
    });
  }
}

// GET /api/items/:id (Public)
async function getItemById(req, res) {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.isValidObjectId(id);

    const item = await Item.findOne({
      $or: [{ customId: id }, ...(isObjectId ? [{ _id: id }] : [])],
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error retrieving item:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve item.",
    });
  }
}

// POST /api/items (Admin protected)
async function createMenuItem(req, res) {
  try {
    const { name, category, price, description, ingredients, image, badge } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, category, and price are mandatory.",
      });
    }

    const ingredientsArray = Array.isArray(ingredients)
      ? ingredients
      : typeof ingredients === "string"
      ? ingredients.split(",").map((i) => i.trim()).filter(Boolean)
      : [];

    const customId = Date.now().toString();
    const newItem = await Item.create({
      customId,
      name: name.trim(),
      category,
      price: Number(price),
      description: description || "",
      ingredients: ingredientsArray,
      image: image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80",
      badge: badge || undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Menu item created in MongoDB successfully.",
      data: newItem,
    });
  } catch (error) {
    console.error("Error creating menu item in MongoDB:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create menu item.",
    });
  }
}

// PUT /api/items/:id (Admin protected)
async function updateMenuItem(req, res) {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.isValidObjectId(id);

    const updatePayload = { ...req.body };
    if (updatePayload.price !== undefined) updatePayload.price = Number(updatePayload.price);
    if (typeof updatePayload.ingredients === "string") {
      updatePayload.ingredients = updatePayload.ingredients.split(",").map((i) => i.trim()).filter(Boolean);
    }

    const updated = await Item.findOneAndUpdate(
      { $or: [{ customId: id }, ...(isObjectId ? [{ _id: id }] : [])] },
      updatePayload,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating menu item in MongoDB:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update menu item.",
    });
  }
}

// DELETE /api/items/:id (Admin protected)
async function deleteMenuItem(req, res) {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.isValidObjectId(id);

    const deleted = await Item.findOneAndDelete({
      $or: [{ customId: id }, ...(isObjectId ? [{ _id: id }] : [])],
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu item deleted from MongoDB successfully.",
      id,
    });
  } catch (error) {
    console.error("Error deleting menu item from MongoDB:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete menu item.",
    });
  }
}

// POST /api/items/reset (Admin protected)
async function resetMenuItems(req, res) {
  try {
    await Item.deleteMany({});
    const formattedItems = seedMenuItems.map((item) => ({
      ...item,
      customId: item.id,
    }));
    const restored = await Item.insertMany(formattedItems);

    return res.status(200).json({
      success: true,
      message: "Menu items restored to defaults in MongoDB.",
      data: restored,
    });
  } catch (error) {
    console.error("Error resetting menu items in MongoDB:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset menu items.",
    });
  }
}

module.exports = {
  getAllItems,
  getCategories,
  getItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  resetMenuItems,
};
