const chatbox = document.querySelector('.chatbox');
const chatInput = document.querySelector('.chat-input textarea');
const sendButton = document.getElementById('sendBTN');

// Replace with your actual Gemini API key
const GEMINI_API_KEY = 'AIzaSyC_Z4P0a4iqwA9Win51W-BQICYCnHdnBqM';

// Function to add a message to the chat
function addMessage(message, isOutgoing = false) {
    const li = document.createElement('li');
    li.classList.add(isOutgoing ? 'outgoing' : 'incoming');
    li.textContent = message;
    chatbox.appendChild(li);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Function to handle sending messages
async function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    chatInput.value = '';

    try {
        const response = await fetch('/chat', {   // 🔥 call your Flask backend, not Gemini
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        if (data.response) {
            addMessage(data.response);
        } else {
            addMessage('Sorry, I encountered an error. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, I encountered an error. Please try again.');
    }
}


// Event listeners
sendButton.addEventListener('click', handleSendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

// Function to handle the close button
function cancel() {
    chatbox.innerHTML = '';
    chatInput.value = '';
}