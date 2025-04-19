const Database = require("../models/database"); // assuming your model is named 'database'
const mongoose = require("mongoose");

exports.createDatabase = async (req, res) => {
  try {
    const { host, username, password, database, dbType } = req.body;

    // Validate DB type
    if (!["mysql", "postgresql"].includes(dbType)) {
      return res.status(400).json({ message: "Invalid database type" });
    }

    // Create a new database entry
    const newDatabase = await Database.create({
      user: req.user._id, // assuming the user is attached to the req object
      host,
      username,
      password, // Consider encrypting the password before saving it
      database,
      dbType,
    });

    res.status(201).json({
      success: true,
      message: "Database created successfully",
      data: newDatabase,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDatabases = async (req, res) => {
  try {
    const databases = await Database.find({ user: req.user._id });

    if (!databases) {
      return res.status(404).json({ message: "No databases found" });
    }

    res.status(200).json({
      success: true,
      data: databases,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDatabaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const database = await Database.findOne({
      _id: id,
      user: req.user._id, // Ensure the database belongs to the current user
    });

    if (!database) {
      return res.status(404).json({ message: "Database not found" });
    }

    res.status(200).json({
      success: true,
      data: database,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDatabase = async (req, res) => {
  try {
    const { id } = req.params;
    const { host, userName, password, database, dbType } = req.body;

    // Validate DB type
    if (dbType && !["mysql", "postgresql"].includes(dbType)) {
      return res.status(400).json({ message: "Invalid database type" });
    }

    const updatedDatabase = await Database.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { host, userName, password, database, dbType },
      { new: true, runValidators: true }
    );

    if (!updatedDatabase) {
      return res.status(404).json({ message: "Database not found" });
    }

    res.status(200).json({
      success: true,
      message: "Database updated successfully",
      data: updatedDatabase,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDatabase = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDatabase = await Database.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deletedDatabase) {
      return res.status(404).json({ message: "Database not found" });
    }

    res.status(200).json({
      success: true,
      message: "Database deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
