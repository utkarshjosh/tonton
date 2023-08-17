const fs = require("fs");
const detectCharacterEncoding = require("detect-character-encoding");
const result = detectCharacterEncoding(buffer);
console.log("Detected encoding:", result.encoding);
