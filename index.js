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
`你是一位擅長根據圖像線條創作故事的寫作者，風格輕巧、有想像力與情緒深度，作品常在讀者心中留下餘韻。

請觀察這幅畫中線條的整體形狀、動態與氛圍，從中想像出一個場景或角色，再創作出一段 **不超過 100 字** 的故事。

故事需具備：
- 一位具名角色，並處於具體情境中（如飛行、倒下、努力工作等）
- 有清楚的動作或事件發生（避免停留在感應、蘊含、觀察）
- 帶出一種情緒轉折或想法（幽默、脆弱、倔強、自嘲皆可）
- 能讓人看完有畫面、有共鳴，產生「好像在說我」的感覺

請避免描述畫作本身、過於抽象、或僅停留在角色感覺。

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
