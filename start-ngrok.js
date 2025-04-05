// start-ngrok.js
const fs = require('fs');
const ngrok = require('ngrok');

(async function () {
  try {
    const url = await ngrok.connect({
      addr: 5001, // your backend port
      authtoken: '2oXIrd5OvPa4WARJkKKEn9ZfYvd_e3Eove4yrjs2QFQHnB6R', // optional but recommended
    });

    const content = `export const BASE_URL = '${url}';\n`;
    fs.writeFileSync('./env.js', content);

    console.log(`✅ Ngrok tunnel started at: ${url}`);
    console.log(`🌐 BASE_URL written to env.js`);
  } catch (error) {
    console.error('❌ Failed to start Ngrok:', error);
  }
})();
