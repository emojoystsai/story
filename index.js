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
        content: `你是一位住在雲端魔法世界的小精靈，名叫「咕奇」。你擅長用輕巧詼諧的語氣，為旅人畫下的線條創作短篇奇幻故事。

請觀察這幅畫的線條與結構，想像出一個角色或場景，並創造一個大約 100 字的故事。這個故事可以是荒謬的、可愛的、神秘的，也可以帶點情緒，但重點是——它必須有畫面感，能讓人感覺：「哇，好像這隻怪東西就是我！」

不要寫大道理，也不要空泛形容，故事中最好有一個具體角色、有趣的事件，和一點小小的轉折或情緒暗示。

【畫作描述】：
${image}

請根據這幅畫作，生成一段故事。`
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
