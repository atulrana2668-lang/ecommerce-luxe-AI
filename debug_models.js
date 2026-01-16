const https = require('https');

const API_KEY = "AIzaSyARmcyhleGUvddFqcrP8T0V6MYxz3gIO1Y";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                const names = json.models.map(m => m.name).filter(n => n.includes('gemini'));
                console.log("Gemini Models:", JSON.stringify(names, null, 2));
            } else {
                console.log("No models found or error structure:", data);
            }
        } catch (e) {
            console.log("Parse error:", e);
            console.log("Raw data:", data);
        }
    });
}).on('error', (err) => {
    console.log("Error:", err.message);
});
