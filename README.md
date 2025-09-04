# Telegram Mini App with Debug Panel

A modern Telegram Mini App built with Next.js, TypeScript, and Tailwind CSS, featuring a comprehensive debug panel for development and troubleshooting.

## 🚀 Features

- **Telegram Integration**: Full support for Telegram WebApp API and official SDK
- **Debug Panel**: Real-time console log capture and environment information
- **User Data Display**: Shows user information from Telegram or mock data
- **Theme Support**: Automatic theme adaptation based on Telegram's color scheme
- **TypeScript**: Fully typed for better development experience
- **Modern UI**: Beautiful interface built with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Telegram SDK**: @telegram-apps/sdk
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd telegram-mini-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Development

### Debug Panel

The app includes a comprehensive debug panel that helps with development and troubleshooting:

- **Console Log Capture**: Automatically captures all console logs and displays them in the UI
- **Environment Information**: Shows detailed environment data including:
  - User agent, platform, language
  - Current URL, hash, and search parameters
  - Telegram WebApp availability and properties
  - WebApp version, platform, color scheme
  - Init data and theme parameters
- **Real-time Status**: Displays current app status (Telegram vs Mock, Loading vs Ready)
- **Interactive Controls**:
  - Toggle panel visibility
  - Show/hide console logs
  - Copy all logs to clipboard
  - Clear logs

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🤖 Telegram Setup

To test with real Telegram data:

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Set up your Mini App URL with `/newapp`
3. Open the app through Telegram (bot menu, inline button, etc.)

## 📱 Usage

### Local Development

When running locally, the app will use mock user data and show a warning banner with setup instructions.

### Telegram Environment

When opened in Telegram, the app will:
- Automatically detect the Telegram environment
- Load real user data from Telegram
- Apply theme colors based on Telegram's settings
- Show debug information in the debug panel

### Debug Panel Usage

1. Click the red "Debug Panel" button in the bottom-right corner
2. View real-time console logs and environment information
3. Use the controls to manage logs and copy data
4. Check the "Data Source" badge to see if you're using Telegram or mock data

## 🏗️ Project Structure

```
├── app/
│   ├── globals.css          # Global styles and Tailwind configuration
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   └── card.tsx
│   └── DebugPanel.tsx       # Debug panel component
├── lib/
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## 🔍 Debugging

The debug panel provides comprehensive debugging information:

### Console Logs
- All console.log, console.warn, console.error, and console.info messages
- Timestamps and log levels
- Additional data objects (if any)

### Environment Info
- Browser and platform information
- Telegram WebApp object properties
- Launch parameters and init data
- Theme parameters and color scheme

### User Data
- Current user information being displayed
- Data source (Telegram vs Mock)
- Loading status

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 📝 Configuration

### Environment Variables

No environment variables are required for basic functionality.

### Telegram Bot Configuration

1. Set your bot's webhook URL to your deployed app
2. Configure the Mini App URL in your bot settings
3. Test the integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the debug panel for error messages
2. Verify your Telegram bot configuration
3. Check the browser console for additional errors
4. Open an issue on GitHub

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Telegram Mini Apps](https://docs.telegram-mini-apps.com/) - Platform documentation