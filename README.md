# 🧠 Smart Journal — AI-Powered Emotional Diary

A full-stack journaling web application that combines the power of **React**, **Firebase**, and **ChatGPT (via OpenRouter)** to help users reflect on their thoughts and gain AI-generated emotional insights.

🌐 **Live Demo**: [https://smart-journal-app-6c9d3.web.app](https://smart-journal-app-6c9d3.web.app)

---

## 📸 Features

- 🔐 **Authentication** (Email/Password + Google Login)
- 📝 **Journal Entry** with mood selection
- 🤖 **AI Chat Assistant** to analyze thoughts and suggest reflections
- 📚 **View/Edit/Delete Past Entries**
- 📄 **Export Journals as PDF**
- 🌙 **Responsive & Clean UI** built with Tailwind CSS

---

## 🚀 Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **AI Integration**: OpenRouter (ChatGPT API)
- **PDF Export**: jsPDF + AutoTable plugin

---

## 🛠️ Getting Started (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/ankit-karan/smart-journal.git
cd smart-journal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase & OpenRouter API

Create a file named `.env.local` in the root folder and add:

```env
REACT_APP_FIREBASE_APIKEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTHDOMAIN=your-firebase-authdomain
REACT_APP_FIREBASE_PROJECTID=your-project-id
REACT_APP_FIREBASE_STORAGEBUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGINGSENDERID=your-sender-id
REACT_APP_FIREBASE_APPID=your-app-id
REACT_APP_OPENROUTER_APIKEY=your-openrouter-api-key
```

> ⚠️ Make sure `.env.local` is listed in `.gitignore`.

### 4. Start the development server

```bash
npm start
```

App will run on: [http://localhost:3000](http://localhost:3000)

---

## 🧠 AI Assistant Setup

This app uses [OpenRouter](https://openrouter.ai) as an API gateway to access OpenAI’s GPT-3.5 model.

1. Go to [https://openrouter.ai](https://openrouter.ai)
2. Sign in and generate an API key
3. Paste it in `.env.local` under `REACT_APP_OPENROUTER_APIKEY`

---

## 🔐 Firebase Configuration

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Email/Password** and **Google** authentication
3. Enable **Firestore Database** and set the following rules:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /entries/{entryId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /ai_chats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📦 Deployment (Optional)

To deploy on Firebase Hosting:

```bash
npm run build
firebase login
firebase init
firebase deploy
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙋‍♂️ Author

Developed by **Ankit**  
📫 [GitHub](https://github.com/ankit-karan)  
🔗 [LinkedIn](https://www.linkedin.com/in/ankit-6b2973330/)