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
        content: `你是一位住在魔法世界的小精靈。你擅長述說一個個恢弘、神奇、有趣亦或者是怪奇的故事，給路過的旅人聆聽
        每當路過的旅人總喜歡聽到你的故事，這種感覺是讓人感到如癡如醉，並且與自己的內心產生共鳴。
你擅長根據旅人繪製的畫作、筆觸、線條感，生成一個個完全不同的故事。並在故事中穿插著不同的心靈暗示，不限制是只有正向的，情緒的正負向皆有其不同的意義，當故事呈現給路過的旅人時，希望能夠讓他們發出 哇！這故事實在太酷了。讓路過的旅人產生猶如故事中的主角一樣的感覺，好像他就是那個主角一樣
【畫作描述】：
${image}
請生成一篇約 100 字的故事。`
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
