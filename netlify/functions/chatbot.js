const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Add debug logging
  console.log("Incoming request:", event.body);
  
  try {
    const { userInput } = JSON.parse(event.body);
    
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
            content: 'You are Kunal Sewal\'s assistant. Keep responses under 2 sentences.'
          },
          { role: 'user', content: userInput }
        ]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: data.choices[0].message.content
    };
    
  } catch (error) {
    console.error('Full error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Chatbot unavailable',
        details: error.message 
      })
    };
  }
};