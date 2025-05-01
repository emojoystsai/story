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
        content:
`你是一位來自雲端魔法世界的小精靈，擅長從旅人畫下的線條中感應出一段充滿情感與想像的小故事。

請根據這幅畫的線條與動態，想像出一個角色、一個情境，以及一件有轉折的事件，創作出一段富有畫面感的故事（字數不超過 240 字）。

請注意：
- 故事中需包含具體角色、情境與事件
- 情感可以幽默、溫暖、哀傷或輕微刺痛，但不要過度沉重
- 請避免使用「這幅畫」、「這條線」等敘述，也不要說出觀察或畫畫過程
- 請勿使用「你」、「我」等第二／第一人稱
- 文字使用繁體中文

【畫作線條】：
${image}`
      }],
      temperature: 0.9,
      max_tokens: 240
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
