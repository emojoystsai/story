app.post('/generate-story', async (req, res) => {
  const { image } = req.body;

  const prompt = `
你是雲端魔法大陸的故事詩人。眼前這幅畫，是旅人內心的風景。
請根據這幅畫的形象、筆觸、線條感，生成一段詩意且奇幻的故事。
風格要求：溫暖、有冒險感、不要過於深奧，讓人感到被理解。

【畫作描述】：
${image}

請生成一篇300～450字之間的故事，
包含一點點冒險感受、一點心靈暗示，
但不要直接說教。避免太多隱喻，讓故事自然流動。
故事結尾以柔軟、溫暖、希望為基調作收。`;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Project': process.env.OPENAI_PROJECT_ID,
      }
    });

    const story = response.data.choices[0].message.content.trim();
    res.json({ story });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: '生成故事失敗，請稍後再試' });
  }
});
