const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const { authenticate, requireTerms } = require("../middleware/auth.js");
const { SYSTEM_PROMPT_COVER_LETTER } = require("../config/constants");
const { updateScanHistory } = require("../controllers/ScanHistory.controller.js");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/cover-letter", authenticate, requireTerms, async (req, res) => {
  try {
    const { resume, jobDescription, scanId } = req.body;

    if (!resume || !jobDescription) {
      return res.status(400).json({ error: "Both resume and job description are required" });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert career consultant and cover letter writer.",
        },
        {
          role: "user",
          content:
            SYSTEM_PROMPT_COVER_LETTER +
            `\n\nResume:\n${resume}\n\nJob Description:\n${jobDescription}`,
        },
      ],
      model: "gpt-4o",
    });

    const coverLetter = completion.choices[0].message.content.trim();

    // Update scan history if scanId is provided
    if (scanId) {
      try {
        await updateScanHistory(scanId, { coverLetter });
      } catch (err) {
        console.error("Error updating scan history with cover letter:", err);
      }
    }

    res.json({ coverLetter });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    res.status(500).json({
      error: "Failed to generate cover letter",
      details: error.message,
    });
  }
});

module.exports = router;
