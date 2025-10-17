# 🎨 Healix Frontend - User Guide

Welcome to the Healix Frontend! This is the part of the application that users see and interact with. This guide explains everything about the frontend in simple terms. 😊

---

## 📖 What is This?

The Healix frontend is a modern web application built with **Next.js** (a popular framework for building websites). It provides a beautiful, user-friendly interface for all of Healix's health and wellness features.

### What You Can Do:
- 🏥 **Find Hospitals:** Locate nearby hospitals and emergency services on a map
- 💬 **Chat with AI:** Ask health questions to an intelligent chatbot
- 🧘 **Breathing Exercises:** Practice guided breathing exercises for relaxation
- 📊 **Health Dashboard:** Track your health metrics and wellness goals
- 👤 **User Profiles:** Manage your personal information and emergency contacts
- 🆘 **Emergency Features:** Quick access to emergency services and contacts
- 🍎 **Balanced Diet:** Get nutrition advice and meal planning tips

---

## 🚀 Getting Started

### Prerequisites

Before you start, make sure you have:
1. **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
2. **pnpm** - Install by running: `npm install -g pnpm`
3. **Supabase Account** - For database and authentication (see main README.md)
4. **Twilio Account** - For emergency calls and SMS features (see main README.md)

### Installation Steps

1. **Open your terminal** and navigate to the frontend folder:
```bash
cd frontend
```

2. **Install all required packages:**
```bash
pnpm install
```
This will download all the necessary libraries and tools. It might take 2-3 minutes.

3. **Set up your environment variables:**
   - Find the file named `.env.example`
   - Create a copy and rename it to `.env.local`
   - Open `.env.local` and fill in your Supabase details:

```env
# Supabase Configuration
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Only needed for server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Twilio Configuration (for emergency calls/SMS)
# Get these from https://console.twilio.com/
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

4. **Start the development server:**
```bash
pnpm dev
```

5. **Open your browser** and go to: http://localhost:3000

🎉 **You're all set!** The website should now be running on your computer.

---

## 📁 Project Structure Explained

Here's what each folder contains:

```
frontend/
├── app/                          # Main application pages
│   ├── page.tsx                 # Homepage (what you see first)
│   ├── dashboard/               # Dashboard and health features
│   │   ├── page.tsx            # Main dashboard
│   │   ├── breathing/          # Breathing exercises
│   │   ├── balanced-diet/      # Nutrition and diet info
│   │   └── ...                 # Other health features
│   ├── auth/                    # Login and signup pages
│   │   ├── callback/           # Handles login redirects
│   │   ├── confirm/            # Email confirmation
│   │   └── reset-password/     # Password reset
│   ├── profile/                 # User profile page
│   ├── upload/                  # File upload features
│   ├── api/                     # Backend API routes
│   │   ├── emergency/          # Emergency call/SMS features
│   │   └── health/             # Health-related APIs
│   └── ...                      # Other pages
│
├── components/                   # Reusable UI components
│   ├── ui/                      # Basic UI elements
│   │   ├── button.tsx          # Button component
│   │   ├── card.tsx            # Card component
│   │   ├── input.tsx           # Input field component
│   │   └── ...                 # Other UI components
│   ├── profile/                 # Profile-specific components
│   ├── image/                   # Image components
│   ├── auth-provider.tsx        # Authentication wrapper
│   ├── navbar.tsx               # Navigation bar
│   ├── footer.tsx               # Footer
│   └── ...                      # Other reusable components
│
├── lib/                          # Helper functions and utilities
│   ├── supabase-client.ts       # Supabase client setup
│   ├── supabase-server.ts       # Server-side Supabase
│   ├── chatbot-api.ts           # Chatbot API integration
│   ├── exercises.ts             # Breathing exercises data
│   └── utils.ts                 # General utility functions
│
├── types/                        # TypeScript type definitions
│   └── google-maps.d.ts         # Map types
│
├── public/                       # Static files (images, icons)
│
├── .env.local                    # Your environment variables (YOU CREATE THIS)
├── .env.example                  # Example environment file
├── package.json                  # Project dependencies
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Styling configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 🎨 Key Features Explained

### 1. **Homepage** (`app/page.tsx`)
The landing page that welcomes users. It shows:
- Hero section with main message
- Feature highlights
- Call-to-action buttons
- Navigation to other sections

### 2. **Authentication** (`app/auth/`)
Handles user login and signup:
- **Sign Up:** Create a new account
- **Login:** Access your existing account
- **Password Reset:** Recover forgotten passwords
- **Email Confirmation:** Verify your email address

Uses **Supabase Auth** for secure authentication.

### 3. **Dashboard** (`app/dashboard/`)
The main hub after logging in:
- **Health Overview:** See your health stats at a glance
- **Quick Actions:** Access features quickly
- **Recent Activity:** View your recent health activities
- **Personalized Recommendations:** Get health tips

### 4. **Breathing Exercises** (`app/dashboard/breathing-exercises/`)
Guided breathing exercises for relaxation:
- Multiple exercise types (4-7-8, Box Breathing, etc.)
- Visual guides and timers
- Progress tracking
- Calming animations

### 5. **Hospital Locator** (Map Feature)
Find nearby hospitals and emergency services:
- Uses **OpenStreetMap** (free, no API key needed!)
- Shows hospitals, clinics, and pharmacies
- Get directions and contact information
- Filter by service type

### 6. **AI Chatbot** (Integrated)
Ask health questions and get AI-powered answers:
- Connects to the RAG chatbot backend
- Natural language understanding
- Context-aware responses
- Medical knowledge base

### 7. **User Profile** (`app/profile/`)
Manage your personal information:
- Edit profile details
- Add emergency contacts
- Set health goals
- Manage preferences
- View activity history

### 8. **Emergency Features** (`app/api/emergency/`)
Quick access to emergency services powered by **Twilio**:
- One-tap emergency calls to your saved contacts
- Send emergency SMS with your location
- Automatic location sharing via Google Maps
- Rate limiting to prevent abuse

**How it works:**
- Uses Twilio API to make real phone calls and send SMS
- Retrieves emergency contacts from your Supabase profile
- Includes your GPS coordinates in emergency messages
- Free trial: $15.50 credit (calls ~$0.013/min, SMS ~$0.0075 each)

---

## 🛠️ Technologies Used

Here's what powers the frontend (in simple terms):

### Core Framework:
- **Next.js 14** - The main framework (like the foundation of a house)
- **React 18** - The UI library (builds the visual components)
- **TypeScript** - Adds type safety (prevents bugs)

### Styling:
- **Tailwind CSS** - Modern styling system (makes things look pretty)
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible UI components
- **Lucide Icons** - Beautiful icons

### Database & Auth:
- **Supabase** - Backend database and authentication
- **@supabase/ssr** - Server-side rendering support

### Communication:
- **Twilio** - Emergency calls and SMS messaging
- Enables real phone calls and text messages to emergency contacts

### Maps & Location:
- **Leaflet** - Map display
- **React Leaflet** - React integration for maps
- **OpenStreetMap** - Free map data (no API key needed!)

### Forms & Validation:
- **React Hook Form** - Easy form handling
- **Zod** - Form validation

### Other Cool Stuff:
- **Three.js** - 3D graphics (for cool visual effects)
- **Recharts** - Beautiful charts and graphs
- **date-fns** - Date formatting
- **Sonner** - Toast notifications

---

## 🎯 How to Use Each Feature

### Running the Development Server:
```bash
pnpm dev
```
Opens at: http://localhost:3000

### Building for Production:
```bash
pnpm build
```
Creates an optimized version ready to deploy.

### Starting Production Server:
```bash
pnpm start
```
Runs the built version.

### Running Tests:
```bash
pnpm test
```
Runs automated tests to check everything works.

### Linting (Check Code Quality):
```bash
pnpm lint
```
Checks your code for errors and style issues.

---

## 🎨 Customizing the Frontend

### Changing Colors:
Edit `tailwind.config.ts` to change the color scheme:
```typescript
colors: {
  primary: '#your-color',
  secondary: '#your-color',
  // ... more colors
}
```

### Adding a New Page:
1. Create a new folder in `app/`
2. Add a `page.tsx` file
3. Write your component:
```tsx
export default function MyNewPage() {
  return (
    <div>
      <h1>My New Page</h1>
      <p>Content goes here!</p>
    </div>
  )
}
```
4. The page is automatically available at `/my-new-page`

### Creating a New Component:
1. Create a new file in `components/`
2. Write your component:
```tsx
export function MyComponent() {
  return <div>My Component</div>
}
```
3. Use it anywhere:
```tsx
import { MyComponent } from '@/components/MyComponent'
```

---

## 🔧 Common Tasks

### Adding a New Feature:
1. Create the page in `app/`
2. Create components in `components/`
3. Add any API routes in `app/api/`
4. Update navigation in `components/navbar.tsx`

### Connecting to the Chatbot:
The chatbot API is already integrated in `lib/chatbot-api.ts`. Use it like this:
```typescript
import { sendChatMessage } from '@/lib/chatbot-api'

const response = await sendChatMessage('What are flu symptoms?')
console.log(response.answer)
```

### Working with Supabase:
```typescript
import { createClient } from '@/lib/supabase-client'

const supabase = createClient()

// Get user data
const { data: user } = await supabase.auth.getUser()

// Query database
const { data, error } = await supabase
  .from('your_table')
  .select('*')
```

---

## 🐛 Troubleshooting

### Issue: "Module not found"
**Solution:** Run `pnpm install` again

### Issue: "Port 3000 already in use"
**Solution:** Either:
- Stop the other program using port 3000
- Or run on a different port: `pnpm dev -p 3001`

### Issue: "Supabase connection error"
**Solution:**
- Check your `.env.local` file
- Make sure the Supabase URL and key are correct
- Verify your Supabase project is active

### Issue: "Emergency service not configured"
**Solution:**
- Make sure you added Twilio credentials to `.env.local`
- Check that all three Twilio variables are set (SID, Token, Phone Number)
- Verify your Twilio account is active at https://console.twilio.com/
- For free trial: Make sure emergency contact numbers are verified in Twilio

### Issue: Page not updating
**Solution:**
- Hard refresh: Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Restart the dev server

### Issue: Styles not applying
**Solution:**
- Check if Tailwind classes are correct
- Restart the dev server
- Clear `.next` folder: `rm -rf .next` then `pnpm dev`

---

## 📱 Responsive Design

The frontend is fully responsive and works on:
- 📱 **Mobile phones** (320px and up)
- 📱 **Tablets** (768px and up)
- 💻 **Laptops** (1024px and up)
- 🖥️ **Desktops** (1280px and up)

Test responsive design:
1. Open browser DevTools (F12)
2. Click the device icon (top-left)
3. Select different device sizes

---

## 🚀 Deployment

### Deploy to Vercel (Recommended):
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables (your Supabase keys)
6. Click "Deploy"

Done! Your site is live! 🎉

### Deploy to Netlify:
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site"
4. Connect your GitHub repository
5. Build command: `pnpm build`
6. Publish directory: `.next`
7. Add environment variables
8. Deploy!

---

## 📚 Learning Resources

Want to learn more? Check these out:

- **Next.js:** https://nextjs.org/docs
- **React:** https://react.dev/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs
- **Supabase:** https://supabase.com/docs

---

## 🎓 Best Practices

1. **Always use TypeScript** - It prevents bugs
2. **Keep components small** - Easier to understand and maintain
3. **Use Tailwind classes** - Consistent styling
4. **Test on mobile** - Many users are on phones
5. **Optimize images** - Use Next.js Image component
6. **Handle errors** - Always show user-friendly error messages
7. **Keep .env.local private** - Never commit it to Git

---

## 💡 Tips for Non-Developers

- **Don't be afraid to experiment!** You can't break anything permanently
- **Read error messages carefully** - They often tell you exactly what's wrong
- **Use browser DevTools** - Press F12 to inspect elements and see console logs
- **Google is your friend** - Search for error messages or questions
- **Take it step by step** - Don't try to understand everything at once
- **Ask for help** - The developer community is very friendly!

---

## 📝 Important Notes

- **Never commit `.env.local`** - It contains sensitive keys
- **Keep dependencies updated** - Run `pnpm update` regularly
- **Test before deploying** - Always test changes locally first
- **Backup your work** - Use Git to commit changes regularly
- **Medical Disclaimer** - This is educational. Always consult real doctors!

---

## 🎉 You're Ready!

You now know everything about the Healix frontend! Start exploring, make changes, and build something amazing! 🌟

Need help? Check the main README.md or the rag-chatbot README.md for more information.

Happy coding! 💻✨
