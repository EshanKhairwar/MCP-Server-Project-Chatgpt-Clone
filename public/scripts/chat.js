   // ===== Socket.IO Setup =====


    // ===== DOM Elements =====
    const app = document.getElementById('app');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const newChatBtn = document.getElementById('new-chat-btn');
    const conversationList = document.getElementById('conversation-list');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    const initialMessage = `
        <div class="message model">
            <div class="message-icon">AI</div>
            <div class="message-content">
                Hello there! I'm a simple AI chat interface. How can I help you today?
            </div>
        </div>
    `;

    // ===== Store All Conversations =====
    let conversations = [
        {
            id: Date.now(),
            title: "New Chat",
            lastMessage: "Hello there! I'm a simple AI chat interface. How can I help you today?",
            messages: [
                { sender: "model", text: "Hello there! I'm a simple AI chat interface. How can I help you today?" }
            ]
        }
    ];
    let currentConversationId = conversations[0].id;

    // ===== Theme Toggling =====
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

    // ===== Sidebar Toggling =====
    function toggleSidebar() {
        sidebar.classList.toggle('hidden');
    }
    sidebarToggleBtn.addEventListener('click', toggleSidebar);

    // ===== New Chat =====
    function createNewChat() {
        const newConv = {
            id: Date.now(),
            title: `Chat ${conversations.length + 1}`,
            lastMessage: "",
            messages: []
        };
        conversations.push(newConv);
        currentConversationId = newConv.id;
        chatMessages.innerHTML = initialMessage;
        userInput.value = '';
        renderConversations();
    }
    newChatBtn.addEventListener('click', createNewChat);

    // ===== Render Conversations in Sidebar =====
    function renderConversations() {
        conversationList.innerHTML = '';
        conversations.forEach(conv => {
            const listItem = document.createElement('li');
            listItem.classList.add('conversation-item');
            listItem.dataset.id = conv.id;
            listItem.innerHTML = `
                <h3>${conv.title}</h3>
                <p>${conv.lastMessage || 'No messages yet'}</p>
            `;
            listItem.addEventListener('click', () => loadConversation(conv.id));
            conversationList.appendChild(listItem);
        });
    }

    // ===== Load Selected Conversation =====
    function loadConversation(id) {
        currentConversationId = id;
        const conv = conversations.find(c => c.id === id);
        chatMessages.innerHTML = '';
        conv.messages.forEach(msg => addMessage(msg.text, msg.sender, false));
    }

    // ===== Add Message to Chat & Conversations =====
    function addMessage(text, sender, save = true) {
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
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (save) {
            const conv = conversations.find(c => c.id === currentConversationId);
            conv.messages.push({ sender, text });
            conv.lastMessage = text;
            renderConversations();
        }
    }

    // ===== Handle Sending Message =====
    function handleSendMessage() {
        const messageText = userInput.value.trim();
        if (!messageText) return;

        addMessage(messageText, 'user');
        userInput.value = '';
        socket.emit('ai-message', messageText);
    }

    // ===== Socket Listener for AI Response =====
    socket.on('ai-message-response', (response) => {
        addMessage(response, 'model');
    });

    // ===== Event Listeners =====
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    });

    // ===== Delete Conversation =====
function deleteConversation(id) {
    conversations = conversations.filter(conv => conv.id !== id);

    // If the deleted one was the current, load another conversation
    if (currentConversationId === id && conversations.length > 0) {
        currentConversationId = conversations[0].id;
        loadConversation(currentConversationId);
    } else if (conversations.length === 0) {
        // No chats left — reset to default
        const newConv = {
            id: Date.now(),
            title: "New Chat",
            lastMessage: "Hello there! I'm a simple AI chat interface. How can I help you today?",
            messages: [
                { sender: "model", text: "Hello there! I'm a simple AI chat interface. How can I help you today?" }
            ]
        };
        conversations.push(newConv);
        currentConversationId = newConv.id;
        loadConversation(currentConversationId);
    }

    renderConversations();
}

// Logout

const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/auth/logout', {
            method: 'GET',  // usually logout is a POST request
            credentials: 'include', // send cookies if your auth uses them
        });

        if (response.ok) {
            // Redirect to login page or home page after logout
            window.location.href = '/auth/login';
        } else {
            const data = await response.json();
            alert(data.message || 'Logout failed');
        }
    } catch (err) {
        console.error('Logout error:', err);
        alert('An error occurred during logout.');
    }
});

// ===== Render Conversations in Sidebar =====
function renderConversations() {
    conversationList.innerHTML = '';
    conversations.forEach(conv => {
        const listItem = document.createElement('li');
        listItem.classList.add('conversation-item');
        listItem.dataset.id = conv.id;

        // Title & Last Message
        const convInfo = document.createElement('div');
        convInfo.classList.add('conv-info');
        convInfo.innerHTML = `
            <h3>${conv.title}</h3>
            <p>${conv.lastMessage || 'No messages yet'}</p>
        `;
        convInfo.addEventListener('click', () => loadConversation(conv.id));

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering loadConversation
            deleteConversation(conv.id);
        });

        listItem.appendChild(convInfo);
        listItem.appendChild(deleteBtn);
        conversationList.appendChild(listItem);
    });
}


    // ===== Initial Load =====
    renderConversations();
    loadConversation(currentConversationId);