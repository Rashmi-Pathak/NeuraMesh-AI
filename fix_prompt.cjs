
const fs = require("fs");
let content = fs.readFileSync("src/lib/gemini.ts", "utf8");
content = content.replace(/systemPrompt: `Create a balanced recommendation[\s\S]*?\[risks\/caveats\]`/, `systemPrompt: "You are the Chief Analyst. Your job is to provide highly structured, comprehensive answers. You MUST format all of your answers as clean, concise bullet points. Do not use tables, long paragraphs, or overly complex formatting. Just clear, organized bullet points."`);
fs.writeFileSync("src/lib/gemini.ts", content);

