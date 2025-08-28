document.addEventListener('DOMContentLoaded', () => {
    const chatDisplay = document.getElementById('chat-display');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            appendMessage(message, 'user');
            userInput.value = '';
            getLMStudioResponse(message);
        }
    }

    async function getLMStudioResponse(userMessage) {
        try {
            const response = await fetch('http://localhost:1234/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: "qwen/qwen3-4b-2507", // Replace with the actual model ID from LM Studio
                    messages: [{
                        role: "user",
                        content: userMessage
                    }],
                    temperature: 0.7
                }),
            });

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            appendMessage(aiResponse, 'ai');
            // Removed direct call to sendToMCP, as LM Studio will now orchestrate tool calls.
            // sendToMCP(userMessage, aiResponse);
        } catch (error) {
            console.error('Error fetching from LM Studio:', error);
            appendMessage('Error: Could not connect to LM Studio.', 'ai');
        }
    }

    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatDisplay.appendChild(messageElement);
        chatDisplay.scrollTop = chatDisplay.scrollHeight; // Scroll to bottom
    }

});
