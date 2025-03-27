const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

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
            content: 'You are Kunal Sewal\'s assistant. He is a Data Science student at IIT Bhilai. Answer concisely about his: education, skills (Python, C++, ML), projects (Eaze It, Plant Classification), and experience (Techbairn, COSA).'
          },
          { role: 'user', content: userInput }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: data.choices[0].message.content
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request' })
    };
  }
};