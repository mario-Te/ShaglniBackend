const ResponseHelper = require("../helpers/ResponseHelper");
const Notification = require("../models/Notification");
exports.getNotificationUser = async (req, res) => {
  try {
    let notifications = [];
    if (req.user) {
      const userId = req.user._id;
      notifications = await Notification.find({
        recipient_users: { $in: [userId] },
      }).sort({ createdAt: -1 });
    }
    if (req.company) {
      const companyId = req.company._id;
      notifications = await Notification.find({
        recipient_companies: { $in: [companyId] },
      }).sort({ createdAt: -1 });
    }
    return res
      .status(200)
      .json(ResponseHelper.successResponse({ notifications }));
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};

exports.updateNotificationUser = async (req, res) => {
  try {
    if (req.company) {
      const companyId = req.company._id;
      const notifications = await Notification.updateMany(
        {
          recipient_companies: { $in: [companyId] },
        },
        { $set: { seen: true } }
      );
      return res
        .status(200)
        .json(ResponseHelper.successResponse({ notifications }));
    }
    const userId = req.user._id;
    const notifications = await Notification.updateMany(
      {
        recipient_users: { $in: [userId] },
      },
      { $set: { seen: true } }
    );

    return res
      .status(200)
      .json(ResponseHelper.successResponse({ notifications }));
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
