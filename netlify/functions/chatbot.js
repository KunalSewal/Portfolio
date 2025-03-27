const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    // Verify request method
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Parse input safely
    const { userInput } = JSON.parse(event.body || '{}');
    if (!userInput) {
      return { statusCode: 400, body: 'Missing userInput' };
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are Kunal Sewal\'s assistant. He studies Data Science at IIT Bhilai. Respond in 1-2 sentences.'
          },
          { role: 'user', content: userInput }
        ],
        temperature: 0.7
      })
    });

    // Handle API response
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: data.choices?.[0]?.message?.content || 'No response from AI'
    };

  } catch (error) {
    console.error('Full error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Chatbot failed',
        details: error.message 
      })
    };
  }
};