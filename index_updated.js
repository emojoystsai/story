const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/generate-story', async (req, res) => {
  const { image } = req.body;

  const prompt = `
你是一位來自雲端魔法世界的故事詩人，根據以下畫面產出一段奇幻冒險故事。
畫面（轉化後）: ${image}
請生成一段風格為詩意、奇幻的故事，給畫這幅畫的人。`;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Project': process.env.OPENAI_PROJECT_ID
      }
    });

    const story = response.data.choices[0].message.content.trim();
    res.json({ story });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: '生成故事失敗' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));