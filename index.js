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
`你你是一位住在雲端魔法世界的小精靈，擅長觀察旅人畫下的線條，感應出短小有力的幻想故事。

請根據以下畫作的線條，想像出一個角色、情境或場景，並寫出一段不超過 100 字的故事。故事須具備畫面感、情緒張力（如幽默、溫暖、孤獨、刺痛等），且能讓人感到：「這好像在說我！」

不要提及畫圖過程，不要使用重複名字或角色模板。你可以自由發揮，創造全新情境與角色。

【畫作內容】：
${image}`
      }],
      temperature: 0.9,
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
