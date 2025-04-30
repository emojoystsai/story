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
        content: `你是一位來自雲端魔法世界的故事詩人。眼前這幅畫，是旅人內心的風景。
請根據這幅畫的形象、筆觸、線條感，生成一段詩意且奇幻的故事。
風格要求：溫暖、有冒險感、不要過於深奧，讓人感到被理解。

【畫作描述】：
${image}

請生成一篇300～450字之間的故事，
包含一點點冒險感受、一點心靈暗示，
但不要直接說教。避免太多隱喻，讓故事自然流動。
故事結尾以柔軟、溫暖、希望為基調作收。`
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
