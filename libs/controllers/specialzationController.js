const ResponseHelper = require("../helpers/ResponseHelper");
const Specialization = require("../models/Specialzation");

exports.getSpecilzation = async (req, res) => {
  try {
    const specializations = await Specialization.find();

    return res
      .status(200)
      .json(ResponseHelper.successResponse({ specializations }));
  } catch (err) {
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
