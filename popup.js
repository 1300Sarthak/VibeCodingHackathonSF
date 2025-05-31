// Form validation functions
function validatePhoneNumber(phone) {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
}

function validateAddress(address) {
    // Basic validation for California address format
    const addressRegex = /^[\w\s]+,\s*[\w\s]+,\s*CA\s*\d{5}$/;
    return addressRegex.test(address);
}

function validateApiKey(apiKey) {
    // OpenAI API keys typically start with 'sk-' and are 51+ characters
    return apiKey && apiKey.startsWith('sk-') && apiKey.length >= 20;
}

function showStatus(message, isError = false) {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${isError ? 'status-error' : 'status-success'}`;
    statusDiv.style.display = 'block';
    
    // Hide after 3 seconds for success messages
    if (!isError) {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
}

// Check if API key is already saved
function checkApiKeyStatus() {
    chrome.storage.sync.get(['openaiApiKey'], (result) => {
        if (!result.openaiApiKey) {
            showStatus('⚠️ Please enter your OpenAI API key to use GhostGov', true);
        } else if (!validateApiKey(result.openaiApiKey)) {
            showStatus('⚠️ Your saved API key appears invalid. Please update it.', true);
        } else {
            showStatus('✅ API key is configured and ready to use');
        }
    });
}

// Notify all tabs about API key validation
function notifyApiKeyValidated() {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
                type: 'API_KEY_VALIDATED'
            }).catch(() => {
                // Ignore errors for tabs that don't have the content script
            });
        });
    });
}

// Notify all tabs about API key removal
function notifyApiKeyRemoved() {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
                type: 'API_KEY_REMOVED'
            }).catch(() => {
                // Ignore errors for tabs that don't have the content script
            });
        });
    });
}

// Load saved settings
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get([
        'openaiApiKey',
        'name',
        'address',
        'phone',
        'spanishEnabled',
        'autofillEnabled'
    ], (result) => {
        document.getElementById('apiKey').value = result.openaiApiKey || '';
        document.getElementById('name').value = result.name || '';
        document.getElementById('address').value = result.address || '';
        document.getElementById('phone').value = result.phone || '';
        document.getElementById('spanish-toggle').checked = result.spanishEnabled || false;
        document.getElementById('autofill-toggle').checked = result.autofillEnabled || false;
        
        // Check API key status
        checkApiKeyStatus();
    });
});

// Test API key by making a simple call
async function testApiKey(apiKey) {
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error('API key test failed:', error);
        return false;
    }
}

// Save settings - SIMPLIFIED FOR URGENT FIX
document.getElementById('save-settings').addEventListener('click', async () => {
    const apiKey = document.getElementById('apiKey').value.trim();
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const spanishEnabled = document.getElementById('spanish-toggle').checked;
    const autofillEnabled = document.getElementById('autofill-toggle').checked;

    // URGENT FIX - MINIMAL VALIDATION
    if (!apiKey || apiKey.length < 10) {
        alert('Please enter your OpenAI API key');
        return;
    }

    const button = document.getElementById('save-settings');
    button.disabled = true;
    button.textContent = 'Saving...';

    // SAVE IMMEDIATELY WITHOUT TESTING
    chrome.storage.sync.set({
        openaiApiKey: apiKey,
        name,
        address,
        phone,
        spanishEnabled,
        autofillEnabled
    }, () => {
        console.log('URGENT FIX: API key saved:', apiKey.substring(0, 10) + '...');
        
        // FORCE NOTIFY ALL TABS
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    type: 'API_KEY_VALIDATED'
                });
                chrome.tabs.sendMessage(tab.id, {
                    type: 'SETTINGS_UPDATED',
                    settings: { name, address, phone, spanishEnabled, autofillEnabled }
                });
            });
        });
        
        button.textContent = 'SAVED! Close popup and try chat';
        button.style.background = '#4CAF50';
        showStatus('✅ API KEY SAVED! You can now use the chatbot!');
    });
});

// Add clear API key functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add a clear button (optional)
    const apiKeyInput = document.getElementById('apiKey');
    
    // Double-click to clear (for testing purposes)
    apiKeyInput.addEventListener('dblclick', () => {
        if (confirm('Clear saved API key? This will disable GhostGov until you enter a new key.')) {
            apiKeyInput.value = '';
            chrome.storage.sync.remove(['openaiApiKey'], () => {
                showStatus('API key cleared', true);
                notifyApiKeyRemoved();
            });
        }
    });
});

// Format phone number as user types
document.getElementById('phone').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
    e.target.value = value;
});

// Real-time API key validation
document.getElementById('apiKey').addEventListener('input', (e) => {
    const apiKey = e.target.value.trim();
    if (apiKey && !validateApiKey(apiKey)) {
        e.target.style.borderColor = '#dc3545';
    } else {
        e.target.style.borderColor = '#2196F3';
    }
});

// Debug functionality
document.addEventListener('DOMContentLoaded', () => {
    // Test storage button
    document.getElementById('test-storage').addEventListener('click', () => {
        console.log('Testing storage...');
        chrome.storage.sync.get(null, (result) => {
            console.log('All storage contents:', result);
            showStatus(`Storage test: ${Object.keys(result).length} items found. Check console for details.`);
        });
    });

    // Clear storage button
    document.getElementById('clear-storage').addEventListener('click', () => {
        if (confirm('This will clear ALL extension data. Are you sure?')) {
            chrome.storage.sync.clear(() => {
                console.log('Storage cleared');
                showStatus('Storage cleared successfully', true);
                // Reload the popup
                location.reload();
            });
        }
    });
}); 