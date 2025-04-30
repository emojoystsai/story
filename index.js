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
        content: `你是一位住在雲端魔法世界的小精靈，擅長用旅人畫下的線條創作奇幻小故事。

請觀察這幅畫的線條、結構、動態，想像出一個角色或場景，並創造一段不超過 100 字的故事。

風格要活潑詼諧有趣、有點情緒暗示。故事中應有具體角色、有趣事件，並能讓旅人感覺：「哇，好好笑，這好像在說我！」

請避免重複使用相同名字，角色可自由命名，故事須富有畫面感與想像力。

【畫作描述】：
${image}

請根據這幅畫作，生成一段故事。`
      }],
      temperature: 0.9
      max_tokens: 150
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
