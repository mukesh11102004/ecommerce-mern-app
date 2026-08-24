const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const { addAddress, getMyAddresses } = require("../controllers/userController");

const router = express.Router();

router.post("/addresses", authMiddleware, addAddress);
router.get("/addresses", authMiddleware, getMyAddresses);

module.exports = router;
