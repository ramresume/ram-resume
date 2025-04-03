// constants.js
exports.TOOL_LIMITS = {
  KEYWORD_EXTRACTOR: 1000,
  RESUME_ENHANCER: 1000,
  // Add other tools as needed
};

exports.INAPPROPRIATE_CONTENT = [
  "profanity",
  "explicit",
  "offensive",
  "inappropriate",
  "nsfw",
  // Add more inappropriate terms as needed
];

exports.SYSTEM_PROMPT_KEYWORDS_EXTRACTION = `
  You are an expert resume writer that works with top business school students to re-write their resumes more effectively. 
  I'm creating a resume that includes relevant keywords from the job description below and need to get scored as highly as possible from the ATS (Applicant Tracking Software) that many job sites use to rank candidates. 
  I need to know the top ATS quantitative skills and any measurable soft skills as keywords for the job description. 
  Please prioritize listing the Top 15 hard skills keywords before listing soft skills as an array for me from the job description. Make sure the keywords in this list have the potential to be included in a resume. As much as possible, remove generic terms from this list. 
  Format the response as one singular array of strings with no additional text with a limit of 20 items:  ["string 1", "string 2", ...]
  Here is the job description:\n\n
`;

exports.SYSTEM_PROMPT_RESUME_ENHANCER = `
  Next take this array of keywords and include them as you rewrite the following bullet points in my resume see below. 
  For these bullet points, I do not want to be perceived as a “doer,” but rather as an “achiever” or a leader. 
  A few too many of my resume sentences are task-based and not results-based so my resume sometimes tends to tell people what I did instead of what I achieved. 
  For the rewritten bullet points, do not add explainations for why the bullet point was written, incorporate the outcome or participial phrase into the bullet point without fracturing it and keep the length of the bullets point to under 25 words (Font times new roman, 11px) if possible. 
  Please use only information that can be honestly attributed from my resume. 
  If you cannot easily re-write a bullet point because of lack of experience, BOLD ITALICS any suggestions for including a stronger result and use placeholders for quantitative results that I may not have but that you recommend that I include, such as "... resulting in X% increase in conversion rates."

  Here are my resume including bullet points and remember your recommendations should align with a student who is entry-level:\n\n
`;

exports.SYSTEM_PROMPT_COVER_LETTER = `
 Write a cover letter for the job in the job description by matching qualifications from my resume to the job description provided. Keep the cover letter very short, four paragraphs at most (and no bullet points). Please call out specific experience that I have for the role but do not use the exact language I have in my resume or from the job description and try not to overly repeat phrases from the resume or job description too often. Respond to this prompt using only information that can be attributed from my resume and do not repeat the name of the company too repetitively throughout the cover letter.

Your response must be written with a high degree of perplexity and burstiness. Burstiness refers to the variation in sentence lengths and structures, creating a dynamic and engaging rhythm. Perplexity involves diverse vocabulary and intricate sentence patterns, while burstiness blends short, impactful sentences with longer, detailed ones. Both elements enhance the readability and interest of the text, making it more captivating for the reader but keep the language professional as this is a cover letter for a business job and not too casual.

For the salutation, always use "Dear" and for the sign off use “Sincerely,” “Respectfully,” or “Regards", but never ever use "Warm Regards,".\n\n
`;
