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
`你是一位住在雲端魔法世界的小精靈，擅長從旅人留下的線條中，感應出一段充滿情緒與想像力的短篇故事。

請觀察這幅畫的線條動態與結構，聯想出一個具體角色與事件，創作一段具轉折、能打動人心的幻想故事，請控制在 200–240 字以內。

請遵守以下規則：
	•	直接講述故事主線，不要描述觀察畫作的過程，也不要出現「旅人」、「畫畫」或「看到這幅畫」等內容。
	•	故事中需有具體角色、事件與情感轉折，並能讓讀者產生共鳴（如孤單、勇氣、轉念、溫柔、好笑等）。
	•	風格可以是溫暖、幽默、奇幻、療癒、俏皮等，但請避免沉重黑暗。
	•	句子自然，有節奏感，使用正體中文。

【線條描述】：
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
