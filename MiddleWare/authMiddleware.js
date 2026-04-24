const jwt = require("jsonwebtoken");

const MemberAcademy = require("../models/MemberAcademy.model");
const Coach = require("../models/MemberCoach.model");
const MemberDistrict = require("../models/MemberDistrict.model");
const MemberPlayer = require("../models/MemberPlayer.model");

/* ---------------- AUTH USER ---------------- */

const authenticateDB = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id, type } = decoded;

    if (!id || !type) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    let Model;

    switch (type) {
      case "Player":
        Model = MemberPlayer;
        break;
      case "Coach":
        Model = Coach;
        break;
      case "Academy":
        Model = MemberAcademy;
        break;
      case "District":
        Model = MemberDistrict;
        break;
      default:
        return res.status(401).json({
          success: false,
          message: "Invalid user type",
        });
    }

    const user = await Model.findById(id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user.toObject();
    req.user.type = type;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/* ---------------- ADMIN FIX ---------------- */

const isAdmin = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      decoded.email !== process.env.ADMIN_LOGIN_USERNAME ||
      decoded.password !== process.env.ADMIN_LOGIN_PASSWORD
    ) {
      return res.status(403).json({
        message: "Not authorized as admin",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = {
  authenticateDB,
  isAdmin,
};