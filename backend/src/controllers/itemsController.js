const mongoose = require("mongoose");
const Item = require("../models/ItemModel");
const { menuCategories, seedMenuItems } = require("../config/seedData");

// In-memory fallback helper
function getFallbackItems(category, search) {
  let list = seedMenuItems.map((item) => ({
    ...item,
    customId: item.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  if (category && category !== "all") {
    list = list.filter((i) => i.category === category);
  }

  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    list = list.filter(
      (i) =>
        (i.name && i.name.toLowerCase().includes(term)) ||
        (i.description && i.description.toLowerCase().includes(term)) ||
        (i.ingredients &&
          Array.isArray(i.ingredients) &&
          i.ingredients.some((ing) => ing.toLowerCase().includes(term)))
    );
  }

  return list;
}

// GET /api/items (Public)
async function getAllItems(req, res) {
  const { category, search } = req.query;

  try {
    // Only attempt MongoDB query if database connection is active
    if (mongoose.connection.readyState === 1) {
      const query = {};

      if (category && category !== "all") {
        query.category = category;
      }

      if (search && search.trim()) {
        const regex = { $regex: search.trim(), $options: "i" };
        query.$or = [
          { name: regex },
          { description: regex },
          { ingredients: regex },
        ];
      }

      const items = await Item.find(query).sort({ createdAt: -1 });

      // Auto-seed if database is completely empty and no filters were supplied
      if (items.length === 0 && (!category || category === "all") && !search) {
        try {
          const totalInDb = await Item.countDocuments({});
          if (totalInDb === 0) {
            console.log("MongoDB items collection is empty. Auto-seeding initial catalog...");
            const formattedItems = seedMenuItems.map((item) => ({
              ...item,
              customId: item.id,
            }));
            const seeded = await Item.insertMany(formattedItems);
            return res.status(200).json({
              success: true,
              count: seeded.length,
              data: seeded,
            });
          }
        } catch (seedError) {
          console.warn("Auto-seeding attempt failed:", seedError.message);
        }
      }

      // Return items if found, or if a specific filter yielded 0 matches
      if (items.length > 0 || (category && category !== "all") || search) {
        return res.status(200).json({
          success: true,
          count: items.length,
          data: items,
        });
      }
    }

    // Fallback if MongoDB is disconnected or unpopulated
    const fallbackItems = getFallbackItems(category, search);
    return res.status(200).json({
      success: true,
      count: fallbackItems.length,
      data: fallbackItems,
    });
  } catch (error) {
    console.warn("Notice: MongoDB query failed, using built-in menu fallback:", error.message);
    const fallbackItems = getFallbackItems(category, search);
    return res.status(200).json({
      success: true,
      count: fallbackItems.length,
      data: fallbackItems,
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
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      const isObjectId = mongoose.isValidObjectId(id);
      const item = await Item.findOne({
        $or: [{ customId: id }, ...(isObjectId ? [{ _id: id }] : [])],
      });

      if (item) {
        return res.status(200).json({
          success: true,
          data: item,
        });
      }
    }

    // Check seed fallback
    const fallbackItem = seedMenuItems.find(
      (i) => String(i.id) === String(id) || String(i.customId) === String(id)
    );

    if (fallbackItem) {
      return res.status(200).json({
        success: true,
        data: {
          ...fallbackItem,
          customId: fallbackItem.id,
          id: fallbackItem.id,
        },
      });
    }

    return res.status(404).json({
      success: false,
      message: `Menu item with ID '${id}' not found.`,
    });
  } catch (error) {
    console.warn("MongoDB error during getItemById, checking fallback:", error.message);
    const fallbackItem = seedMenuItems.find(
      (i) => String(i.id) === String(id) || String(i.customId) === String(id)
    );

    if (fallbackItem) {
      return res.status(200).json({
        success: true,
        data: {
          ...fallbackItem,
          customId: fallbackItem.id,
          id: fallbackItem.id,
        },
      });
    }

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
