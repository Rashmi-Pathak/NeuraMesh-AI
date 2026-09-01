
const { execSync } = require("child_process");
try {
  console.log(execSync("npm install pdfjs-dist mammoth", { encoding: "utf8" }));
} catch(e) {
  console.log("Error:", e.stdout);
}

