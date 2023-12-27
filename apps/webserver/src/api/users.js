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
router.post("/user/login", userLogin);
router.get("/user/random", getRandomName);
router.post("/user/register", registerUser);
router.put("/user/", updateUser);
router.get("/user/", verifyJWT, getCurrentUser);

module.exports.UserRouter = router;
