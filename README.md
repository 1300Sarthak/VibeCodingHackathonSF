# GhostGov Chrome Extension

A Chrome extension that provides an AI-powered assistant for California government services and information. The assistant helps users with tasks like understanding legal documents, finding government services, and filling out forms.

## Features

- Floating chat bubble on all websites
- AI-powered responses using OpenAI GPT-4
- Text simplification for highlighted content
- Spanish translation support
- Form autofill capabilities
- California-specific government information and resources

## Setup

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. Replace `YOUR_API_KEY` in `background.js` with your OpenAI API key

## Usage

### Chat Interface
- Click the floating chat bubble to open the chat window
- Type your questions about California government services
- Use the Spanish toggle to get responses in Spanish

### Text Simplification
1. Highlight any text on a webpage
2. Click the "Simplify" button that appears
3. Get a simplified explanation in the chat window

### Form Autofill
1. Open the extension popup
2. Enter your profile information
3. Enable "Auto-fill Forms" in settings
4. Visit government websites to automatically fill forms

## Development

### Project Structure
- `manifest.json`: Extension configuration
- `content.js`: Injects UI and handles page interactions
- `popup.html/js`: Extension popup interface
- `background.js`: Handles API calls and background tasks
- `styles.css`: UI styling

### API Integration
The extension uses OpenAI's GPT-4 API for generating responses. Make sure to:
1. Have a valid OpenAI API key
2. Replace the placeholder in `background.js`
3. Keep your API key secure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details 