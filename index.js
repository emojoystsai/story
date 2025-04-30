const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/generate-story', async (req, res) => {
  const image = req.body.image || '';
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `你是一位來自雲端魔法世界的小精靈，專門把各種怪奇、恢弘、神奇的魔法故事說給路過的旅人聆聽。眼前這幅畫，是旅人當下內心的風景。
請根據這幅畫的形象、筆觸、線條感，生成怪奇、恢弘、神奇等不同種類的魔法奇幻的故事。或許是我們耳熟能詳的勇者鬥惡龍故事、或是一則常見的寓言，或許是另一個魔法大陸正在發生的史詩一場全新的角色扮演。
風格要求：活潑、詼諧、有冒險感，故事中帶著不同的內心情境元素，讓人與故事中的主角產生共情，這個情感連結的元素，不單單只有正向積極？而是更加豐富且全面的是一場艱難險阻、也能是一個放鬆順其自然的對話。
【畫作描述】：
${image}
請生成一篇約 100 字的故事。
      }],
      temperature: 0.9
    });

    const story = completion.data.choices[0].message.content;
    res.json({ story });
  } catch (error) {
    console.error('Error generating story:', error.message);
    res.status(500).send('Error generating story');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
