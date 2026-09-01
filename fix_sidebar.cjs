
const fs = require("fs");
let content = fs.readFileSync("src/pages/Index.tsx", "utf8");
content = content.replace(/<\/main>[\s\S]*/, "</main>\n    </div>\n  );\n};\n\nexport default Index;");
fs.writeFileSync("src/pages/Index.tsx", content);

