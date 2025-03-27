const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { userInput } = JSON.parse(event.body);
    
    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Free ultra-fast model
        messages: [
          {
            role: "system",
            content: "You are Kunal's assistant. Respond concisely about his: 1) Projects 2) Skills 3) Education"
          },
          { role: "user", content: userInput }
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
      body: JSON.stringify({ error: error.message })
    };
  }
};