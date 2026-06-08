const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const supabase = require("../config/supabase");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      restaurant_id: user.restaurant_id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

exports.register = async (req, res) => {
  try {
    const {
      restaurantName,
      restaurantSlug,
      email,
      password,
    } = req.body;

    if (
      !restaurantName ||
      !restaurantSlug ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const { data: existingRestaurant } = await supabase
      .from("restaurants")
      .select("*")
      .eq("slug", restaurantSlug)
      .single();

    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant slug already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: restaurant, error: restaurantError } =
      await supabase
        .from("restaurants")
        .insert([
          {
            name: restaurantName,
            slug: restaurantSlug,
          },
        ])
        .select()
        .single();

    if (restaurantError) {
      return res.status(500).json({
        success: false,
        error: restaurantError.message,
      });
    }

    const { data: user, error: userError } =
      await supabase
        .from("users")
        .insert([
          {
            restaurant_id: restaurant.id,
            email,
            password: hashedPassword,
            role: "admin",
          },
        ])
        .select()
        .single();

    if (userError) {
      return res.status(500).json({
        success: false,
        error: userError.message,
      });
    }

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Restaurant registered successfully",
      token,
      user,
      restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};