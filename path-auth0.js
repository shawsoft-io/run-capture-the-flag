const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname,
  'node_modules',
  '@auth0',
  'nextjs-auth0',
  'dist',
  'server',
  'user.js'
);


// Read the file content
let fileContent = fs.readFileSync(filePath, 'utf-8');

// Define your custom claims
const customClaims = `"https://run.shawsoft.io/roles", "https://run.shawsoft.io/athleteId", "https://run.shawsoft.io/accessToken"`;

// Correctly extend DEFAULT_ALLOWED_CLAIMS without nesting
fileContent = fileContent.replace(
  /const DEFAULT_ALLOWED_CLAIMS = \[/,
  `const DEFAULT_ALLOWED_CLAIMS = [${customClaims},`
);

// Write back the modified file
fs.writeFileSync(filePath, fileContent, 'utf-8');
console.log('Auth0 SDK patched successfully!');