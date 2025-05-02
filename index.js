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
  const startTime = Date.now();
  const image = req.body.image || '';
  console.log('>> 收到新故事生成請求');

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // 如果你改用 gpt-4 記得在這裡改掉
      messages: [{
        role: 'user',
        content:
`你是雲端魔法世界的一位說故事精靈，擅長將旅人畫下的奇異線條轉化為一段段奇幻小故事。

請觀察下方的畫作線條，並直接轉化為一段不超過 240 字的繁體中文故事。請不要描述線條或觀察畫作的過程，而是直接講出這條線中藏著的故事。

故事需具備以下特色：
1. 背景發生在一個奇幻魔法世界（如雲端城堡、魔法森林、空中島等）
2. 故事角色具象、獨特（如旅人、小精靈、魔法生物等）
3. 有一個清楚的事件（如發現、失敗、突破、和解、覺醒）
4. 故事語氣可溫柔、童話、神祕或感性，結尾要有「轉折或情感餘韻」
5. 不要描述觀察、畫畫或線條，請直接講述故事內容

【畫作描述】：
${image}`
      }],
      temperature: 0.9,
      max_tokens: 240
    });

    const story = completion.data.choices[0].message.content;
    console.log('>> 生成成功，花費時間：', (Date.now() - startTime), 'ms');
    res.json({ story });
  } catch (error) {
    console.error('>> 發生錯誤：', error.message);
    res.status(500).send('Error generating story');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
