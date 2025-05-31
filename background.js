// Constants
const SYSTEM_PROMPT = `You are GhostGov, an AI assistant specifically for California residents. You help with California government services, forms, and life tasks. 

IMPORTANT: When users mention moving to California, changing address, getting licenses, or similar life changes, ALWAYS provide specific California government website links.

For common scenarios, provide these links:
- DMV services (license, registration): https://www.dmv.ca.gov/
- Voter registration: https://registertovote.ca.gov/
- State benefits (CalFresh, Medi-Cal): https://www.benefits.ca.gov/
- Tax information: https://www.ftb.ca.gov/
- Business registration: https://bizfile.sos.ca.gov/
- Employment services: https://www.edd.ca.gov/
- Healthcare enrollment: https://www.coveredca.com/
- Housing assistance: https://www.hcd.ca.gov/
- Education info: https://www.cde.ca.gov/

Always assume the user is in California. Provide practical, actionable advice with direct links to official California government websites. Be helpful, clear, and guide users to the exact resources they need.`;

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'OPENAI_REQUEST') {
        console.log('Received OpenAI request from content script');
        handleOpenAIRequest(request.prompt, request.isSpanish)
            .then(response => {
                console.log('OpenAI request successful, sending response back');
                sendResponse({ success: true, response });
            })
            .catch(error => {
                console.error('OpenAI request failed:', error.message);
                sendResponse({ success: false, error: error.message });
            });
        return true; // Required for async sendResponse
    }
});

// Enhance prompt with California-specific context
function enhancePromptWithLinks(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    let enhancement = "";
    
    if (lowerPrompt.includes('moved') || lowerPrompt.includes('moving') || lowerPrompt.includes('new to california')) {
        enhancement = "\n\nSince you're asking about moving to California, make sure to include these 3 essential links:\n1. DMV for license/registration: https://www.dmv.ca.gov/\n2. Voter registration: https://registertovote.ca.gov/\n3. State benefits enrollment: https://www.benefits.ca.gov/";
    } else if (lowerPrompt.includes('dmv') || lowerPrompt.includes('license') || lowerPrompt.includes('registration')) {
        enhancement = "\n\nFor DMV services, direct them to: https://www.dmv.ca.gov/";
    } else if (lowerPrompt.includes('vote') || lowerPrompt.includes('election')) {
        enhancement = "\n\nFor voter registration: https://registertovote.ca.gov/";
    } else if (lowerPrompt.includes('benefits') || lowerPrompt.includes('food stamps') || lowerPrompt.includes('medical')) {
        enhancement = "\n\nFor state benefits: https://www.benefits.ca.gov/";
    } else if (lowerPrompt.includes('business') || lowerPrompt.includes('company')) {
        enhancement = "\n\nFor business registration: https://bizfile.sos.ca.gov/";
    } else if (lowerPrompt.includes('job') || lowerPrompt.includes('unemployment')) {
        enhancement = "\n\nFor employment services: https://www.edd.ca.gov/";
    }
    
    return prompt + enhancement;
}

// Handle OpenAI API calls
async function handleOpenAIRequest(prompt, isSpanish) {
    try {
        console.log('URGENT FIX: Getting API key...');
        const result = await chrome.storage.sync.get(['openaiApiKey']);
        const apiKey = result.openaiApiKey;
        
        console.log('API key found:', apiKey ? 'YES' : 'NO');
        
        if (!apiKey) {
            throw new Error('API key not found. Please enter it in the extension popup.');
        }

        console.log('Making OpenAI request...');

        // Enhance prompt with California-specific links
        const enhancedPrompt = enhancePromptWithLinks(prompt);

        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: enhancedPrompt }
        ];

        if (isSpanish) {
            messages.push({ role: 'system', content: 'Please respond in Spanish and include the links.' });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7
            })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error:', errorText);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            console.log('SUCCESS: Got response from OpenAI');
            return data.choices[0].message.content;
        }
        
        throw new Error('Invalid response format');
        
    } catch (error) {
        console.error('URGENT FIX ERROR:', error);
        throw error;
    }
}

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('GhostGov extension installed');
    // Set default settings
    chrome.storage.sync.set({
        spanishEnabled: false,
        autofillEnabled: false
    });
});

// Handle tab updates for form autofill
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        chrome.storage.sync.get(['autofillEnabled', 'name', 'address', 'phone'], (result) => {
            if (result.autofillEnabled) {
                chrome.tabs.sendMessage(tabId, {
                    type: 'AUTOFILL_FORM',
                    data: {
                        name: result.name,
                        address: result.address,
                        phone: result.phone
                    }
                }).catch(() => {
                    // Ignore errors for tabs without content script
                });
            }
        });
    }
}); 