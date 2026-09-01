
const fs = require("fs");
const env = fs.readFileSync(".env", "utf8");
let apiKey = env.split("\n").find(line => line.startsWith("VITE_GROQ_API_KEY=")).split("=")[1].trim();
if (apiKey.startsWith("\"")) apiKey = apiKey.slice(1, -1);

fetch("https://api.groq.com/openai/v1/models", {
  headers: { "Authorization": `Bearer ${apiKey}` }
})
.then(res => res.json())
.then(data => {
  console.log(JSON.stringify(data, null, 2));
})
.catch(err => console.error(err));

