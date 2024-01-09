const express = require("express");
const {
  userLogin,
  getCurrentUser,
  updateUser,
  registerUser,
  getRandomName,
} = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth");

const router = express.Router();
router.post("/api/user/login", userLogin);
router.get("/api/user/random", getRandomName);
router.post("/api/user/register", registerUser);
router.put("/api/user/", updateUser);
router.get("/api/user/", verifyJWT, getCurrentUser);

module.exports.UserRouter = router;
