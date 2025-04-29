const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

app.post('/generate-story', async (req, res) => {
  try {
    const { drawingData } = req.body;

    const refinedPrompt = `
你是雲端魔法大陸的故事詩人。眼前這幅畫，是旅人內心的風景。
請根據這幅畫的形象、筆觸、線條感，生成一段詩意且奇幻的故事。
風格要求：溫暖、有冒險感、不要過於深奧，讓人感到被理解。

【畫作描述】：
${drawingData.substring(0, 150)}...

請生成一篇 **300～450 字之間** 的故事，
包含一點點冒險感受、一點心靈暗示，
但不要直接說教。避免太多隱喻，讓故事自然流動。
故事結尾以柔軟、溫暖、希望為基調作收。`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '你是一位來自雲端魔法世界的故事詩人，擅長為畫作創作詩意、奇幻又溫暖的故事。',
        },
        {
          role: 'user',
          content: refinedPrompt,
        },
      ],
      temperature: 0.95,
    });

    const story = response.data.choices[0].message.content.trim();
    res.json({ story });
  } catch (error) {
    console.error('生成故事錯誤：', error.message);
    res.status(500).json({ error: '生成故事失敗，請稍後再試。' });
  }
});

app.listen(port, () => {
  console.log(`Story API server is running on port ${port}`);
});
