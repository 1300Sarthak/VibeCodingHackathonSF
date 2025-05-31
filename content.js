// State
let isChatOpen = false;
let isSpanishMode = false;
let currentSimplifyBtn = null;
let currentTranslateBtn = null;
let isApiKeyValidated = false;
let chatUICreated = false;

// Check if API key exists and is valid
async function checkApiKeyStatus() {
    return new Promise((resolve) => {
        try {
            // Check if extension context is valid
            if (!chrome.runtime || !chrome.runtime.id) {
                console.error('Extension context invalidated in API key check');
                resolve(false);
                return;
            }
            
            chrome.storage.sync.get(['openaiApiKey'], (result) => {
                if (chrome.runtime.lastError) {
                    console.error('Error accessing storage:', chrome.runtime.lastError);
                    resolve(false);
                    return;
                }
                
                console.log('Content script checking API key status...');
                console.log('API key in storage:', result.openaiApiKey ? 'Found' : 'Not found');
                console.log('API key length:', result.openaiApiKey ? result.openaiApiKey.length : 0);
                
                const hasValidKey = result.openaiApiKey && 
                                   result.openaiApiKey.startsWith('sk-') && 
                                   result.openaiApiKey.length >= 20;
                
                console.log('API key is valid:', hasValidKey);
                resolve(hasValidKey);
            });
        } catch (error) {
            console.error('Error in checkApiKeyStatus:', error);
            resolve(false);
        }
    });
}

// Debug storage contents
async function debugStorage() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(null, (result) => {
            console.log('All storage contents from content script:', result);
            resolve(result);
        });
    });
}

// Create and inject the chat UI
function createChatUI() {
    if (chatUICreated) return; // Prevent duplicate creation
    
    const chatContainer = document.createElement('div');
    chatContainer.id = 'ghostgov-chat-container';
    chatContainer.innerHTML = `
        <div id="ghostgov-chat-bubble">
            <span>Gov</span>
        </div>
        <div id="ghostgov-chat-window" class="hidden">
            <div id="ghostgov-chat-header">
                <h3>GhostGov Assistant</h3>
                <div class="controls">
                    <label class="switch">
                        <input type="checkbox" id="spanish-toggle">
                        <span class="slider"></span>
                    </label>
                    <span>Español</span>
                    <button id="ghostgov-close">×</button>
                </div>
            </div>
            <div id="ghostgov-chat-messages">
                <div class="message assistant">
                    👋 Hi! I'm your California government assistant. Try asking:
                    <br>• "I just moved to California"
                    <br>• "How do I get a CA driver's license?"
                    <br>• "I need to register to vote"
                    <br><br>I'll provide direct links to official CA government sites!
                </div>
            </div>
            <div id="ghostgov-chat-input">
                <textarea placeholder="Ask about California government services..."></textarea>
                <button id="ghostgov-send">Send</button>
            </div>
        </div>
    `;
    document.body.appendChild(chatContainer);
    chatUICreated = true;
    attachEventListeners();
    
    // Load Spanish preference
    chrome.storage.sync.get(['spanishEnabled'], (result) => {
        isSpanishMode = result.spanishEnabled || false;
        const spanishToggle = document.getElementById('spanish-toggle');
        if (spanishToggle) {
            spanishToggle.checked = isSpanishMode;
        }
    });
}

// Remove chat UI
function removeChatUI() {
    const existingContainer = document.getElementById('ghostgov-chat-container');
    if (existingContainer) {
        existingContainer.remove();
        chatUICreated = false;
    }
}

// Show setup message instead of chat
function showSetupMessage() {
    if (document.getElementById('ghostgov-setup-message')) return;
    
    const setupMessage = document.createElement('div');
    setupMessage.id = 'ghostgov-setup-message';
    setupMessage.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #f8f9fa;
            border: 2px solid #2196F3;
            border-radius: 12px;
            padding: 15px;
            max-width: 300px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
            <div style="color: #2196F3; font-weight: bold; margin-bottom: 8px;">
                🏛️ GhostGov Setup Required
            </div>
            <div style="font-size: 13px; color: #666; margin-bottom: 10px;">
                Click the extension icon to enter your OpenAI API key and start using GhostGov.
            </div>
            <button id="close-setup-message" style="
                background: #2196F3;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            ">Got it</button>
        </div>
    `;
    
    document.body.appendChild(setupMessage);
    
    // Add close functionality
    document.getElementById('close-setup-message').onclick = () => {
        setupMessage.remove();
    };
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (setupMessage.parentNode) {
            setupMessage.remove();
        }
    }, 10000);
}

// Handle text selection
function handleTextSelection() {
    // Remove existing buttons first
    if (currentSimplifyBtn) {
        currentSimplifyBtn.remove();
        currentSimplifyBtn = null;
    }
    if (currentTranslateBtn) {
        currentTranslateBtn.remove();
        currentTranslateBtn = null;
    }

    // Small delay to ensure selection is complete
    setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            // Create simplify button
            currentSimplifyBtn = document.createElement('button');
            currentSimplifyBtn.id = 'ghostgov-simplify';
            currentSimplifyBtn.textContent = 'Simplify';
            currentSimplifyBtn.style.cssText = `
                position: fixed;
                left: ${rect.left}px;
                top: ${rect.bottom + 5}px;
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                font-size: 12px;
                cursor: pointer;
                z-index: 10001;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            `;
            
            // Create translate button
            currentTranslateBtn = document.createElement('button');
            currentTranslateBtn.id = 'ghostgov-translate';
            currentTranslateBtn.textContent = 'Translate';
            currentTranslateBtn.style.cssText = `
                position: fixed;
                left: ${rect.left + 80}px;
                top: ${rect.bottom + 5}px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                font-size: 12px;
                cursor: pointer;
                z-index: 10001;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            `;
            
            currentSimplifyBtn.onclick = async (e) => {
                e.stopPropagation();
                showResultPopup('🔄 Simplifying...', rect);
                currentSimplifyBtn.remove();
                currentTranslateBtn.remove();
                
                try {
                    const response = await callOpenAI(`Simplify this government text in plain English for easier understanding: ${selectedText}`, false);
                    showResultPopup(response, rect, '📝 Simplified Text');
                } catch (error) {
                    showResultPopup('Error simplifying text. Please try again.', rect, '❌ Error');
                }
            };

            currentTranslateBtn.onclick = async (e) => {
                e.stopPropagation();
                showResultPopup('🔄 Translating...', rect);
                currentSimplifyBtn.remove();
                currentTranslateBtn.remove();
                
                try {
                    const response = await callOpenAI(`Translate this text to Spanish: ${selectedText}`, false);
                    showResultPopup(response, rect, '🇪🇸 Spanish Translation');
                } catch (error) {
                    showResultPopup('Error translating text. Please try again.', rect, '❌ Error');
                }
            };
            
            document.body.appendChild(currentSimplifyBtn);
            document.body.appendChild(currentTranslateBtn);
        }
    }, 100);
}

// Convert URLs to clickable links
function linkifyText(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank" style="color: #2196F3; text-decoration: underline;">$1</a>');
}

// Show result in popup window
function showResultPopup(content, rect, title = 'Result') {
    // Remove existing popup
    const existingPopup = document.getElementById('ghostgov-result-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Calculate better positioning
    const popupLeft = Math.min(rect.left, window.innerWidth - 370); // Ensure it fits on screen
    const popupTop = rect.bottom + 40;
    
    const popup = document.createElement('div');
    popup.id = 'ghostgov-result-popup';
    popup.innerHTML = `
        <div style="
            position: fixed;
            top: ${popupTop}px;
            left: ${popupLeft}px;
            max-width: 350px;
            background: white;
            border: 2px solid #2196F3;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
            z-index: 10002;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            max-height: 300px;
            overflow-y: auto;
        ">
            <div style="
                color: #2196F3;
                font-weight: bold;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                ${title}
                <button id="close-result-popup" style="
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    margin: 0;
                ">×</button>
            </div>
            <div style="color: #333; word-wrap: break-word;">${linkifyText(content)}</div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Add close functionality
    const closeBtn = document.getElementById('close-result-popup');
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            popup.remove();
        };
    }
    
    // Auto-remove after 20 seconds
    setTimeout(() => {
        if (popup.parentNode) {
            popup.remove();
        }
    }, 20000);
    
    // Close when clicking outside (with delay to prevent immediate closing)
    setTimeout(() => {
        document.addEventListener('click', function closeOnOutside(e) {
            if (!popup.contains(e.target)) {
                popup.remove();
                document.removeEventListener('click', closeOnOutside);
            }
        });
    }, 100);
}

// URGENT FIX - SIMPLIFIED API CALL WITH ERROR HANDLING
async function callOpenAI(prompt, useSpanish = false) {
    try {
        console.log('URGENT FIX: Making API call...');
        
        return new Promise((resolve, reject) => {
            // Check if extension context is valid
            if (!chrome.runtime || !chrome.runtime.id) {
                console.error('Extension context invalidated');
                resolve('Extension was reloaded. Please refresh the page to use GhostGov again.');
                return;
            }
            
            chrome.runtime.sendMessage({
                type: 'OPENAI_REQUEST',
                prompt: prompt,
                isSpanish: useSpanish
            }, (response) => {
                // Handle extension context errors
                if (chrome.runtime.lastError) {
                    console.error('Chrome runtime error:', chrome.runtime.lastError);
                    
                    if (chrome.runtime.lastError.message.includes('Extension context invalidated') ||
                        chrome.runtime.lastError.message.includes('Receiving end does not exist')) {
                        resolve('Extension was reloaded. Please refresh the page to use GhostGov again.');
                    } else {
                        resolve('Connection error: ' + chrome.runtime.lastError.message);
                    }
                    return;
                }
                
                if (!response) {
                    console.error('No response received');
                    resolve('No response from extension. Please refresh the page and try again.');
                    return;
                }
                
                if (response.success) {
                    resolve(response.response);
                } else {
                    resolve('Error: ' + (response.error || 'Unknown error'));
                }
            });
        });
    } catch (error) {
        console.error('API call error:', error);
        return `Error: ${error.message}. Please refresh the page and try again.`;
    }
}

// Add message to chat
function addMessage(content, role) {
    const messagesContainer = document.getElementById('ghostgov-chat-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.innerHTML = linkifyText(content); // Convert URLs to links
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Open chat window
function openChatWindow() {
    const chatWindow = document.getElementById('ghostgov-chat-window');
    if (chatWindow && chatWindow.classList.contains('hidden')) {
        isChatOpen = true;
        chatWindow.classList.remove('hidden');
    }
}

// Attach event listeners
function attachEventListeners() {
    const chatBubble = document.getElementById('ghostgov-chat-bubble');
    const chatWindow = document.getElementById('ghostgov-chat-window');
    const closeBtn = document.getElementById('ghostgov-close');
    const sendBtn = document.getElementById('ghostgov-send');
    const input = document.querySelector('#ghostgov-chat-input textarea');
    const spanishToggle = document.getElementById('spanish-toggle');

    if (!chatBubble || !chatWindow || !closeBtn || !sendBtn || !input || !spanishToggle) {
        console.error('Some chat UI elements not found');
        return;
    }

    chatBubble.onclick = () => {
        isChatOpen = !isChatOpen;
        chatWindow.classList.toggle('hidden');
    };

    closeBtn.onclick = () => {
        isChatOpen = false;
        chatWindow.classList.add('hidden');
    };

    sendBtn.onclick = async () => {
        const message = input.value.trim();
        if (message) {
            addMessage(message, 'user');
            input.value = '';
            
            const response = await callOpenAI(message, isSpanishMode);
            addMessage(response, 'assistant');
        }
    };

    input.onkeypress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    };

    spanishToggle.onchange = () => {
        isSpanishMode = spanishToggle.checked;
        chrome.storage.sync.set({ spanishEnabled: isSpanishMode });
    };

    // Handle text selection
    document.addEventListener('mouseup', handleTextSelection);
    
    // Remove buttons when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#ghostgov-simplify') && 
            !e.target.closest('#ghostgov-translate') && 
            !e.target.closest('#ghostgov-result-popup')) {
            
            if (currentSimplifyBtn) {
                currentSimplifyBtn.remove();
                currentSimplifyBtn = null;
            }
            if (currentTranslateBtn) {
                currentTranslateBtn.remove();
                currentTranslateBtn = null;
            }
            
            // Also remove result popup if clicking elsewhere
            const resultPopup = document.getElementById('ghostgov-result-popup');
            if (resultPopup && !resultPopup.contains(e.target)) {
                resultPopup.remove();
            }
        }
    });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        // Check if extension context is valid
        if (!chrome.runtime || !chrome.runtime.id) {
            console.error('Extension context invalidated in message listener');
            return false;
        }
        
        if (request.type === 'SETTINGS_UPDATED') {
            isSpanishMode = request.settings.spanishEnabled;
            const spanishToggle = document.getElementById('spanish-toggle');
            if (spanishToggle) {
                spanishToggle.checked = isSpanishMode;
            }
        } else if (request.type === 'API_KEY_VALIDATED') {
            isApiKeyValidated = true;
            const setupMessage = document.getElementById('ghostgov-setup-message');
            if (setupMessage) {
                setupMessage.remove();
            }
            createChatUI();
        } else if (request.type === 'API_KEY_REMOVED') {
            isApiKeyValidated = false;
            removeChatUI();
            showSetupMessage();
        }
        
        return true; // Keep channel open for async response
    } catch (error) {
        console.error('Error in message listener:', error);
        return false;
    }
});

// URGENT FIX - SIMPLIFIED INITIALIZATION
async function initialize() {
    try {
        console.log('URGENT FIX: Initializing content script...');
        
        // Check if extension context is valid
        if (!checkExtensionContext()) {
            return; // Stop initialization if context is invalid
        }
        
        // ALWAYS CREATE CHAT UI IMMEDIATELY
        createChatUI();
        isApiKeyValidated = true;
        
        // Check for API key in background
        setTimeout(async () => {
            try {
                if (!checkExtensionContext()) return;
                
                const hasValidKey = await checkApiKeyStatus();
                console.log('URGENT FIX: API key check result:', hasValidKey);
                
                if (!hasValidKey) {
                    console.log('No API key found, showing setup message');
                    showSetupMessage();
                }
            } catch (error) {
                console.error('Error during API key check:', error);
            }
        }, 100);
    } catch (error) {
        console.error('Error during initialization:', error);
        showRefreshNotification();
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Show page refresh notification
function showRefreshNotification() {
    // Remove existing notification
    const existingNotification = document.getElementById('ghostgov-refresh-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.id = 'ghostgov-refresh-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff5722;
            color: white;
            border-radius: 8px;
            padding: 15px 20px;
            max-width: 350px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            z-index: 10003;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
        ">
            <div style="font-weight: bold; margin-bottom: 8px;">
                🔄 GhostGov Extension Updated
            </div>
            <div style="margin-bottom: 12px;">
                Please refresh this page to continue using GhostGov.
            </div>
            <button id="refresh-page-now" style="
                background: white;
                color: #ff5722;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                margin-right: 10px;
            ">Refresh Now</button>
            <button id="dismiss-refresh-notification" style="
                background: transparent;
                color: white;
                border: 1px solid white;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
            ">Dismiss</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add functionality
    document.getElementById('refresh-page-now').onclick = () => {
        window.location.reload();
    };
    
    document.getElementById('dismiss-refresh-notification').onclick = () => {
        notification.remove();
    };
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 30000);
}

// Check extension context validity
function checkExtensionContext() {
    if (!chrome.runtime || !chrome.runtime.id) {
        console.error('Extension context invalidated');
        showRefreshNotification();
        return false;
    }
    return true;
}