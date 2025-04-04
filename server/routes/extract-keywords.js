const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const checkUsageLimit = require("../middleware/UserUsage.js");
const { decrementUsage, incrementTotalScans } = require("../controllers/UserUsage.controller.js");
const { validateText } = require("../middleware/validateText.js");
const { authenticate, requireTerms } = require("../middleware/auth.js");
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const { SYSTEM_PROMPT_KEYWORDS_EXTRACTION } = require("../config/constants");
const { createScanHistory } = require("../controllers/ScanHistory.controller.js");

router.post(
  "/extract-keywords",
  authenticate,
  requireTerms,
  validateText("KEYWORD_EXTRACTOR"),
  checkUsageLimit,
  async (req, res) => {
    try {
      const { jobDescription, company, jobTitle } = req.body;
      // console.log("Received job description:", jobDescription);

      // console.log("Sending request to OpenAI");
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume writer that works with top business school students to re-write their resumes more effectively.",
          },
          {
            role: "user",
            content: SYSTEM_PROMPT_KEYWORDS_EXTRACTION + jobDescription,
          },
        ],
        model: "gpt-4o",
      });

      await decrementUsage(req.userUsage);
      await incrementTotalScans(req.userUsage);

      let content = completion.choices[0].message.content;
      // console.log("Raw OpenAI response:", content);

      // Remove any markdown formatting
      content = content.replace(/```json\n|\n```/g, "");

      // Attempt to parse the JSON
      let keywords;
      try {
        keywords = JSON.parse(content);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        // If parsing fails, try to extract an array from the string
        const match = content.match(/\[(.*)\]/s);
        if (match) {
          keywords = match[1].split(",").map((item) => item.trim().replace(/^"|"$/g, ""));
        } else {
          throw new Error("Unable to parse keywords from OpenAI response");
        }
      }

      // Save scan history
      const scanId = await createScanHistory(req.user._id, {
        jobTitle: jobTitle,
        company: company,
        keywords: keywords,
      });

      // console.log("Extracted keywords:", keywords);
      res.json({ keywords, scanId });
    } catch (error) {
      console.error("Error extracting keywords:", error);
      res.status(500).json({ error: "Failed to extract keywords", details: error.message });
    }
  }
);

module.exports = router;
