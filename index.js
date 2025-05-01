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
`你是一位故事魔法師，專門從抽象線條中感應角色、情感與情境。請觀察以下畫面中的線條，根據它們的動勢與氛圍，直接創作一段「不超過 240 字」、情感豐富的小故事。

故事請具備以下特色：
	•	一位具體角色（動物或人物）
	•	一段具起伏的事件或轉折
	•	情緒風格可溫暖、幽默、療癒或略帶刺痛
	•	不可提及「線條、畫畫、觀察」等字眼

請直接開始說故事，不需開場說明。

【畫面線條】：
${image}
`
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
