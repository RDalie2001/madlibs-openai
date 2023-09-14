const OpenAI = require('openai');

const bodyParser = require('body-parser');

const express = require('express');

const cors = require('cors');
const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json()); 
//OPEN AI KEY
const openai = new OpenAI({
    apiKey:'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',
});

//Endpoint to get madlib word types
app.get('/api/madlib-types', async(req,res) => {
    const numWords = req.query.numWords;


    try {
        response = await openai.chat.completions.create({
            messages: [{ role: "user", content: `Generate ${numWords} random types for words in madlibs in json format. Your response should only include the actual "types" (like noun etc ) and the "values" (like car etc). No unnecessary word.` }],
            model: "gpt-3.5-turbo",
          });

          if (response.choices && response.choices[0]) {
            console.log("OpenAI Response Choice Message:", response.choices[0].message);

            const types = extractKeysFromString(response.choices[0].message.content);
            
            return res.json(types.slice(0,numWords));
          } else {
            res.status(500).json({ error: "Unexpected response from OpenAI." });
          }

    } catch(error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "Failed to fetch madlib types." });
    }
})
app.post('/api/madlib-story', async (req, res) => {
    const words = req.body;

    // Convert words object to a string description
    const wordDescription = Object.entries(words).map(([type, word]) => `${type}: ${word}`).join(', ');
  
    try {
      const response = await openai.chat.completions.create({
        messages: [
          { role: "user", content: `Given the words ${wordDescription}, generate a story not more 80 words long.` }
        ],
        model: "gpt-3.5-turbo",
      });
  
      if (response.choices && response.choices[0]) {
        res.json({ story: response.choices[0].message.content });
      } else {
        res.status(500).json({ error: "Unexpected response from OpenAI." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate the story." });
    }
  });
function extractKeysFromString(inputString) {
    const keyPattern = /"([^"]+)":/g;
    let match;
    const keys = [];

    while ((match = keyPattern.exec(inputString)) !== null) {
        keys.push(match[1]);
    }

    return keys;
}

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });