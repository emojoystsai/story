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
        content: `你是雲端魔法世界最有趣的小精靈，專門觀察旅人隨手畫出的奇怪線條，然後用奇幻又詼諧的語氣說出他們內心的故事。

請根據這幅畫的感覺（下方文字），生成一段大約 200 字的奇幻故事。
風格要輕鬆幽默、有一點點調皮、有小冒險或靈感閃現，讀完讓人感覺「嗯～有趣又有感覺」。

不要套模板，也不要太嚴肅，不用教訓或說教，只需要一點點啟發就好。

請避免重複使用「旅人」、「森林」、「魔法小屋」等常見元素，嘗試更多新奇有趣的冒險場景或角色組合。

畫作描述：
${image}
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
