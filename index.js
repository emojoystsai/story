cconst express = require('express');
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
        content: `你是雲端魔法世界最會說故事的小精靈，擅長根據旅人畫作的筆觸與線條，說出既詼諧又奇幻的冒險故事。

請根據這幅畫作的感覺（下方描述）， 輕鬆小故事。語氣風格要活潑幽默一點，有點調皮但不油膩，讓人閱讀時會微笑，並能夠感受到一點奇幻的魔法氛圍。



最後，用一個溫柔但不說教的方式收尾，像是給旅人的一句提醒或祝福。。眼前這幅畫，是旅人內心的風景。
請根據這幅畫的形象、筆觸、線條感，生成一段詩意且奇幻的故事，風格偏活潑詼諧，不要過於長篇，控制在 100 字左右。

【畫作描述】：
${image}

請創造一段奇妙、具有想像力的故事，不需要使用過多隱喻，重點是讓觀看者有感，覺得被理解。`
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
