      //   JavaScript for UI Functionality
        //
        const app = document.getElementById('app');
        const sidebar = document.getElementById('sidebar');
        const sidebarToggleBtn = document.getElementById('sidebar-toggle');
        const themeToggleBtn = document.getElementById('theme-toggle');
        const conversationList = document.getElementById('conversation-list');
        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');

        // --- Theme Toggling ---
        function toggleTheme() {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.body.removeAttribute('data-theme');
                themeToggleBtn.textContent = '🌙';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                themeToggleBtn.textContent = '☀️';
            }
        }
        themeToggleBtn.addEventListener('click', toggleTheme);

        // --- Sidebar Toggling ---
        function toggleSidebar() {
            sidebar.classList.toggle('hidden');
        }
        sidebarToggleBtn.addEventListener('click', toggleSidebar);

        // --- Conversation List Logic ---
        const conversations = [
            { id: 1, title: 'Introduction to Web Dev', lastMessage: 'What is a CSS Flexbox?' },
            { id: 2, title: 'Summer Vacation Plans', lastMessage: 'I am planning a trip to Italy.' },
            { id: 3, title: 'Recipe for Lasagna', lastMessage: 'What are the ingredients?' },
            { id: 4, title: 'The History of Rome', lastMessage: 'Can you tell me about the Roman Empire?' },
            { id: 5, title: 'Learning Python', lastMessage: 'Write a simple "Hello, World!" script.' },
            { id: 6, title: 'Modern Art Movements', lastMessage: 'Tell me about Cubism.' },
        ];

        function renderConversations() {
            conversationList.innerHTML = ''; // Clear existing list
            conversations.forEach(conv => {
                const listItem = document.createElement('li');
                listItem.classList.add('conversation-item');
                listItem.dataset.id = conv.id;
                listItem.innerHTML = `<h3>${conv.title}</h3><p>${conv.lastMessage}</p>`;
                conversationList.appendChild(listItem);
            });
        }

        // --- Chat Message Logic ---
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender);
            
            const iconDiv = document.createElement('div');
            iconDiv.classList.add('message-icon');
            iconDiv.textContent = sender === 'user' ? 'You' : 'AI';

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('message-content');
            contentDiv.textContent = text;
            
            messageDiv.appendChild(iconDiv);
            messageDiv.appendChild(contentDiv);
            chatMessages.appendChild(messageDiv);

            // Scroll to the bottom to show the new message
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function handleSendMessage() {
            const messageText = userInput.value.trim();
            if (messageText) {
                // Add user message to the chat
                addMessage(messageText, 'user');
                userInput.value = '';

                // Simulate an AI response after a short delay
                setTimeout(() => {
                    addMessage("This is a simulated AI response to your message: '" + messageText + "'.", 'model');
                }, 1000);
            }
        }

        // --- Event Listeners ---
        sendButton.addEventListener('click', handleSendMessage);
        userInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault(); // Prevent a newline
                handleSendMessage();
            }
        });

        // Initial setup
        renderConversations();