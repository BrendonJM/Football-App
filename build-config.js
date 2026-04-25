const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "public-config.js");
const config = {
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
};

const fileContents = `window.__APP_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`;

fs.writeFileSync(outputPath, fileContents, "utf8");
console.log(`Wrote public config to ${outputPath}`);
