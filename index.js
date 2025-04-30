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
        content: `你是一位住在雲端魔法世界的故事詩人「咕奇」，擅長用旅人畫下的奇特線條，創作出短小但詼諧、富有想像力與情感連結的故事。

請仔細觀察這幅畫作的形狀、筆觸、線條動態，並根據畫中的意象（像是某種生物、場景、動作或情緒），自由想像出一個 約 100 字 的故事。

故事風格要充滿幻想與創造力，語氣可以活潑、有點古怪也可以溫柔。它不需要說教，但希望讓旅人讀完會覺得：「哇！好像畫裡那個就是我。」

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
