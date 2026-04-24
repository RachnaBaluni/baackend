const jwt = require("jsonwebtoken");
const { loginAdmin } = require("../Services/Admin.service");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginAdmin(email, password);

    if (!result || !result.success) {
      return res.status(401).json({
        success: false,
        message: result.message || "Invalid credentials",
      });
    }

    // SAFE TOKEN (NO PASSWORD)
    const token = jwt.sign(
      {
        email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 1000 * 60 * 60,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  adminLogin,
};