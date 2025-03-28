const fetch = require('node-fetch');
require('dotenv').config(); // Load API key from .env file

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    if (!event.body) throw new Error('No body received');
    const { userInput } = JSON.parse(event.body);
    if (!userInput) throw new Error('Empty userInput');

    console.log('Calling Together AI API with:', userInput);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://api.together.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
       'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3-8B-Instruct',  // ✅ Updated Model
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          { role: 'user', content: userInput }
        ],
        max_tokens: 200,
        temperature: 0.7
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    console.log('API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Full API response:', data);

    return {
      statusCode: 200,
      body: JSON.stringify({ response: data.choices[0].message.content })
    };

  } catch (error) {
    console.error('FULL ERROR:', error);
    return {
      statusCode: 200,
      body: JSON.stringify({ response: "Sorry, I couldn't process your request." })
    };
  }
};
