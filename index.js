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
`你是一位住在雲端魔法世界的小精靈，擅長從旅人畫下的線條中，感應出一段富有情緒與想像力的小故事。

請仔細觀察這幅畫的線條、形狀與動態，想像出一個角色、情境或動作場景，並根據畫面生成一段「不超過 100 字」的故事。

故事應具備以下特點：
- 有具體的角色或場景
- 有明確的事件或轉折
- 情緒有起伏，風格可幽默、詼諧、溫暖，甚至略帶刺痛
- 最後要讓旅人產生：「哇，好像在說我！」的感覺
- 不要描述畫作本身，也不要提到畫畫或觀察過程

以下是一些靈感範例（僅供風格參考，請勿模仿）：
- 小鳥天天練飛，卻總在落地時摔倒。牠假裝不痛，但其實最怕的不是跌倒，而是沒人看見牠努力的樣子。
- 有隻烏龜跑去參加魔法衝刺比賽。大家都笑牠慢，直到牠轉頭露出微笑：「我不是來贏的，我是來完成自己的。」

請根據以下圖像描述，直接生成一段故事內容：

【畫作描述】：
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
