const express = require("express");
const router = express.Router();
const File = require("../models/File");
const upload = require("../middleware/upload");
const { ensureAuthenticated } = require("../middleware/auth");
const multerErrorHandler = require("../middleware/multerErrorHandler");

router.post(
  "/upload",
  ensureAuthenticated,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        return multerErrorHandler(err, req, res, next);
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Delete existing resume for this user
      await File.deleteMany({ userId: req.user._id });

      const file = new File({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
        userId: req.user._id,
      });

      await file.save();
      res.json({ message: "File uploaded successfully", fileId: file._id });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Error uploading file" });
    }
  }
);
// Get file metadata
router.get("/files", ensureAuthenticated, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id }).select("-data");
    res.json(files);
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ error: "Error retrieving files" });
  }
});

// Download file
router.get("/files/download", ensureAuthenticated, async (req, res) => {
  try {
    const file = await File.findOne({ userId: req.user._id });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.set({
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      "Content-Length": file.size,
    });

    res.send(file.data);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Error downloading file" });
  }
});

module.exports = router;
