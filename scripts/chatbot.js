// Replace your existing chatbot code with this:

// ===== Chatbot UI Logic =====
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotMessages = document.getElementById('chatbot-messages');

// Toggle chatbot visibility
chatbotToggle.addEventListener('click', () => chatbotContainer.classList.toggle('active'));
chatbotClose.addEventListener('click', () => chatbotContainer.classList.remove('active'));

// Add a message to the chat UI
function addMessage(content, isUser) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');
  messageDiv.textContent = content;
  chatbotMessages.appendChild(messageDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// ===== Secure API Integration =====
async function sendToOpenAI(userInput) {
  showTypingIndicator();
  
  try {
    // Call Netlify Function (proxy)
    const response = await fetch('/.netlify/functions/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput })
    });
    
    if (!response.ok) throw new Error('API error');
    const reply = await response.json();
    addMessage(reply, false);
    
  } catch (error) {
    addMessage("Sorry, I couldn't process your request.", false);
    console.error("Chatbot error:", error);
  } finally {
    hideTypingIndicator();
  }
}

// Typing indicators
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typing-indicator';
  typingDiv.className = 'message bot-message typing-indicator';
  typingDiv.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  chatbotMessages.appendChild(typingDiv);
}

function hideTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

// ===== Event Listeners =====
chatbotSend.addEventListener('click', handleUserMessage);
chatbotInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleUserMessage();
});

async function handleUserMessage() {
  const userInput = chatbotInput.value.trim();
  if (!userInput) return;
  
  addMessage(userInput, true);
  chatbotInput.value = '';
  await sendToOpenAI(userInput);
}

// Initial welcome message
addMessage("Hi! I'm Kunal's AI assistant. Ask me about his skills, projects, or experience.", false);