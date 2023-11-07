const express = require("express");
const {
  userLogin,
  getCurrentUser,
  updateUser,
  registerUser,
} = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth");

const router = express.Router();
router.post("/user/login", userLogin);
router.post("/user/register", registerUser);
router.put("/user/", updateUser);
router.get("/user/", verifyJWT, getCurrentUser);

module.exports.UserRouter = router;
