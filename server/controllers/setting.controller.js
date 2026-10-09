import { Setting } from "../models/Setting.js";

export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findOneAndUpdate({}, { $set: req.body }, { new: true });
    }
    res.status(200).json({
      success: true,
      message: "Banner & business details updated successfully.",
      settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
