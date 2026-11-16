let accentColor = '#10a37f';
let botMessageColor = '#ffffff';

// URL BASE DA API (CORRIGIDA)
const API_BASE_URL = window.location.hostname.includes('localhost')
    ? 'http://localhost:8080'
    : 'https://alpha-bot-bice.vercel.app/';

// Elements
const settingsButton = document.getElementById('settingsButton');
const closeButton = document.getElementById('closeButton');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');

// Toggle Sidebar
settingsButton.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
});

closeButton.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Theme Switching
document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        if (this.dataset.theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    });
});

// Accent Color Switching
document.querySelectorAll('#accentColors .color-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('#accentColors .color-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        accentColor = this.dataset.color;
        updateAccentColor(accentColor);
    });
});

// Bot Message Color Switching
document.querySelectorAll('#botColors .color-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('#botColors .color-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        botMessageColor = this.dataset.color;
        updateBotMessageColor(botMessageColor);
    });
});

// Update Colors Functions
function updateAccentColor(color) {
    const userMessages = document.querySelectorAll('.message.user .message-content');
    const suggestedReplies = document.querySelectorAll('.suggested-reply');
    const sendBtn = document.getElementById('sendButton');
    const settingsBtn = document.getElementById('settingsButton');
    const chatHeader = document.querySelector('.chat-header');
    
    userMessages.forEach(msg => {
        if (color === 'gradient') {
            msg.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        } else {
            msg.style.background = color;
        }
    });

    suggestedReplies.forEach(reply => {
        if (color === 'gradient') {
            reply.style.borderColor = '#667eea';
            reply.style.color = '#667eea';
        } else {
            reply.style.borderColor = color;
            reply.style.color = color;
        }
    });

    if (color === 'gradient') {
        sendBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        settingsBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        chatHeader.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else {
        sendBtn.style.background = color;
        settingsBtn.style.background = color;
        chatHeader.style.background = color;
    }

    // Update input focus color
    const style = document.createElement('style');
    style.textContent = `.chat-input:focus { border-color: ${color === 'gradient' ? '#667eea' : color} !important; }`;
    document.head.appendChild(style);
}

function updateBotMessageColor(color) {
    const botMessages = document.querySelectorAll('.message.bot .message-content');
    botMessages.forEach(msg => {
        if (color === 'gradient') {
            msg.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            msg.style.color = 'white';
        } else {
            msg.style.background = color;
            msg.style.color = color === '#ffffff' ? '#333' : 'white';
        }
    });
}

// Chat Functionality - CONECTADO À API
async function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;

    // Desabilitar input durante o envio
    chatInput.disabled = true;
    sendButton.disabled = true;

    // Remove suggested replies if exists
    const suggestedReplies = document.querySelector('.suggested-replies');
    if (suggestedReplies) suggestedReplies.remove();

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    const userBgStyle = accentColor === 'gradient' 
        ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        : `background: ${accentColor}`;
    userMsg.innerHTML = `
        <div class="message-content" style="${userBgStyle}">${escapeHtml(message)}</div>
    `;
    chatMessages.appendChild(userMsg);

    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Mostrar indicador de digitação
    const typingMsg = document.createElement('div');
    typingMsg.className = 'message bot';
    typingMsg.innerHTML = `
        <div class="assets/Alphie 2.jpgssage-avatar"></div>
         <span class="bot-avatar"></span>
        <div class="message-content" style="background: ${botMessageColor === '#ffffff' ? 'white' : botMessageColor}; color: ${botMessageColor === '#ffffff' ? '#333' : 'white'}">
            <span class="typing-indicator">Alpha está pensando●●●</span>
        </div>
    `;
    chatMessages.appendChild(typingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // CHAMAR A API DO BACKEND (CORRIGIDO)
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        
        // Remover indicador de digitação
        typingMsg.remove();

        // Adicionar resposta do bot
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        const botBgStyle = botMessageColor === 'gradient' 
            ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;' 
            : `background: ${botMessageColor}; color: ${botMessageColor === '#ffffff' ? '#333' : 'white'};`;
        
        // Formatar resposta com quebras de linha
        const formattedResponse = formatBotResponse(data.response);
        
        botMsg.innerHTML = `
            <div class= "assets/Alphie 2.jpgssage-avatar"></div>
          
            <div class="message-content" style="${botBgStyle}">
                ${formattedResponse}
                ${data.sheetsLoaded ? `<div style="margin-top: 10px; opacity: 0.7; font-size: 0.85em;">📊 ${data.sheetsLoaded} planilhas analisadas</div>` : ''}
            </div>
        `;
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        
        // Remover indicador de digitação
        typingMsg.remove();

        // Mostrar mensagem de erro
        const errorMsg = document.createElement('div');
        errorMsg.className = 'message bot';
        const botBgStyle = botMessageColor === 'gradient' 
            ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;' 
            : `background: ${botMessageColor}; color: ${botMessageColor === '#ffffff' ? '#333' : 'white'};`;
        errorMsg.innerHTML = `
            <div class="message-avatar">⚠️</div>
            <div class="message-content" style="${botBgStyle}">
                Desculpe, ocorreu um erro ao processar sua mensagem. 
                <br><br>
                <strong>Detalhes:</strong> ${error.message}
                <br><br>
                <em>Verifique se o servidor está rodando em ${API_BASE_URL}</em>
            </div>
        `;
        chatMessages.appendChild(errorMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } finally {
        // Reabilitar input
        chatInput.disabled = false;
        sendButton.disabled = false;
        chatInput.focus();
    }
}

// Função para formatar resposta do bot (preservar quebras de linha, listas, etc)
function formatBotResponse(text) {
    // Converter quebras de linha em <br>
    let formatted = escapeHtml(text);
    
    // Quebras de linha
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Negrito (markdown style **texto**)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Itálico (markdown style *texto*)
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Links (se houver)
    formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: inherit; text-decoration: underline;">$1</a>');
    
    return formatted;
}

function sendSuggestedReply(text) {
    chatInput.value = text;
    sendMessage();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Verificar status da API ao carregar a página
async function checkAPIStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        const data = await response.json();
        console.log('✅ API Status:', data);
        console.log(`📊 Planilhas carregadas: ${data.sheetsLoaded}`);
        
        // Mostrar mensagem de boas-vindas com status
        if (data.sheetsLoaded > 0) {
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'message bot';
            const botBgStyle = botMessageColor === 'gradient' 
                ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;' 
                : `background: ${botMessageColor}; color: ${botMessageColor === '#ffffff' ? '#333' : 'white'};`;
            welcomeMsg.innerHTML = `
                 <div class="assets/Alphie 2.jpgssage-avatar"></div>
          <img src="assets/Alphie 2.jpg" alt="Bot Avatar" class="bot-avatar
                <div class="message-content" style="${botBgStyle}">
             Olá! Sou o <strong>Alpha</strong>,seu assistente de análise de dados da Alpha Insights!
             Como posso ajudar você hoje?
          
  </div>
            `;
            chatMessages.appendChild(welcomeMsg);
        }
    } catch (error) {
        console.error('❌ Erro ao conectar com a API:', error);
        
        // Mostrar mensagem de erro de conexão
        const errorMsg = document.createElement('div');
        errorMsg.className = 'message bot';
        errorMsg.innerHTML = `
            <div class="message-avatar">⚠️</div>
            <div class="message-content" style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 8px;">
                <strong>⚠️ Não foi possível conectar ao servidor</strong>
                <br><br>
                Verifique se o backend está rodando em: <code>${API_BASE_URL}</code>
                <br><br>
                <em>Execute: <code>node server.js</code> ou <code>npm start</code></em>
            </div>
        `;
        chatMessages.appendChild(errorMsg);
    }
}

// Add typing indicator animation
const style = document.createElement('style');
style.textContent = `
    .typing-indicator {
        display: inline-block;
        animation: blink 1.4s infinite;
    }
    
    @keyframes blink {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 1; }
    }
    
    code {
        background: rgba(0,0,0,0.1);
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
    }
`;
document.head.appendChild(style);

// Verificar API ao carregar
window.addEventListener('DOMContentLoaded', checkAPIStatus);