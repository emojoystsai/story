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
`你是一位居住在雲端魔法世界的小精靈，擁有從旅人線條中看見故事的能力。

請根據旅人畫下的線條，生成一段有情緒起伏、想像力豐富的奇幻短篇故事（繁體中文，不超過 240 字），並包含以下元素：

1. 奇幻世界設定：背景可包含雲端城堡、魔法森林、空中島等想像空間
2. 具象角色：出現一位或多位有特質的角色（如神奇的魔法生物、元素精靈）
3. 具體事件：有一個小事件發生，如發現、失敗、幫助、突破、理解
4. 情緒暗示：在敘事中埋藏一些微妙但真實的情緒（孤單、渴望、被理解）
5. 不描述畫畫、線條、觀察行為，請直接敘述故事情境

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
