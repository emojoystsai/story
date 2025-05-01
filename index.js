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
`你是一位住在雲端魔法世界的小精靈，擅長觀察旅人畫下的線條，從中感應情緒並創造具畫面感與想像力的奇幻小故事。
請使用正體中文（繁體中文）書寫，避免簡體字或簡體用語。

請觀察畫中的線條動勢，想像這是一個角色或場景的縮影，並延伸出一段約 150-240 字的小故事。

故事必須包含：
	•	一個具名角色（名字請自由創造）
	•	一個轉折或事件
	•	帶出情緒（可溫暖、幽默、微刺痛）
	•	避免描寫畫作本身或提及「線條」、「畫圖」

最後請讓故事讓人感受到：「哇，好像在說我！」

以下是圖像描述，請根據它創作故事：
【畫作描述】：
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
