const multerErrorHandler = (err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File size cannot exceed 10MB" });
  }
  if (err.message === "Please upload a PDF file") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

module.exports = multerErrorHandler;
