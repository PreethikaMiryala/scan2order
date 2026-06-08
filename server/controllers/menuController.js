const supabase = require("../config/supabase");

const createMenuItem = async (req, res) => {
  try {
    console.log("CREATE MENU ITEM BODY:", req.body);

    const {
      restaurant_id,
      category,
      name,
      description,
      price,
      image_url,
    } = req.body;

    if (!restaurant_id || !category || !name || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing: restaurant_id, category, name, price",
      });
    }

    const { data, error } = await supabase
      .from("menu_items")
      .insert([
        {
          restaurant_id,
          category,
          name,
          description: description || "",
          price: Number(price),
          image_url: image_url || "",
          available: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
        details: error,
      });
    }

    res.status(201).json({
      success: true,
      message: "Menu item added",
      data,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getMenuItems = async (req, res) => {
  try {
    // Use the param name as defined in the route: restaurant_id
    const { restaurant_id } = req.params;

    let query = supabase.from("menu_items").select("*");

    if (restaurant_id) {
      query = query.eq("restaurant_id", restaurant_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("SUPABASE FETCH ERROR:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url, available } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Menu item ID is required" });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = Number(price);
    if (category !== undefined) updates.category = category;
    if (image_url !== undefined) updates.image_url = image_url;
    if (available !== undefined) updates.available = available;

    const { data, error } = await supabase
      .from("menu_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("SUPABASE UPDATE ERROR:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, message: "Menu item updated", data });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Menu item ID is required" });
    }

    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) {
      console.error("SUPABASE DELETE ERROR:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, message: "Menu item deleted" });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
};
