const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const supabase = require("./config/supabase");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Scan2Order API Running",
  });
});

app.get("/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*");

    if (error) {
      return res.status(500).json({
        success: false,
        error,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});