const asyncHandler = require("express-async-handler");
const Goal = require("../models/goalModel");
const Note = require("../models/noteModel");
const Document = require("../models/documentModel");
const OpenAI = require("openai");

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Search user's goals, notes, and documents using AI 
// @route   GET /api/search?q=keyword
// @access  Private
const textSearch = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const query = req.query.q?.trim();

  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  const regex = new RegExp(query, "i");

  // Search across all data types
  const [goals, notes, documents] = await Promise.all([
    Goal.find({ user: userId, text: regex }),
    Note.find({ user: userId, text: regex }),
    Document.find({
      user: userId,
      $or: [{ title: regex }, { content: regex }],
    }),
  ]);

  // Prepare summarized data for AI prompt
  const goalTexts = goals.map((g) => g.text).filter(Boolean);
  const noteTexts = notes.map((n) => n.text).filter(Boolean);
  const docTexts = documents.map((d) => d.title || d.content).filter(Boolean);

  // Build prompt skipping empty sections
  const promptParts = [];
  if (goalTexts.length) promptParts.push(`- Goals: ${goalTexts.join(", ")}`);
  if (noteTexts.length) promptParts.push(`- Notes: ${noteTexts.join(", ")}`);
  if (docTexts.length) promptParts.push(`- Documents: ${docTexts.join(", ")}`);

  const prompt = `
You are an assistant that summarizes a user's workspace in a helpful, second-person tone.
Speak directly to the user (e.g., "You have been working on...") rather than saying "The user...".

Summarize what you (the user) have been working on about "${query}" based on the following data:
${promptParts.join("\n") || "No goals, notes, or documents yet."}

Then, suggest 2–3 next steps or focus areas the user could take to make progress.
Keep it short (under 80 words).
`;

  let aiSummary = "";

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    aiSummary = completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI summary error:", error.message);
    aiSummary = "Could not generate summary at this time.";
  }

  res.json({
    query,
    results: { goals, notes, documents },
    aiSummary,
  });
});

// Voice Search (now a placeholder)
const voiceSearch = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No audio file uploaded." });
  }

  // Speech-to-text logic later
  res.json({ message: "Voice search feature coming soon..." });
});

module.exports = {
  textSearch,
  voiceSearch,
};
