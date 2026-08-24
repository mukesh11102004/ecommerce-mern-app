const User = require("../models/User");

async function addAddress(req, res) {
  try {
    const { fullName, phone, street, city, state, postalCode, country } =
      req.body;

    if (
      !fullName ||
      !phone ||
      !street ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      return res.status(400).json({
        message: "Please fill all address fields",
      });
    }

    const user = await User.findById(req.user.userId);

    user.addresses.push({
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
    });

    await user.save();

    res.status(201).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function getMyAddresses(req, res) {
  try {
    const user = await User.findById(req.user.userId).select("addresses");

    res.status(200).json({
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  addAddress,
  getMyAddresses,
};
