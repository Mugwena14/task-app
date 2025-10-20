# 🧭 TaskFlow – Smart Task Management App

**TaskFlow** is a full-stack productivity platform built to help you stay organized and work smarter.  
You can create, edit, and delete tasks, add supporting notes and documents, record voice tasks, and even summarize your content using AI — all in one sleek, minimalistic interface.

---

## 🚀 Features

- ✅ **Task Management** – Add, edit, delete, and mark tasks as completed.  
- 🧠 **AI Summarization** – Summarize your notes or documents using an integrated AI model for quick insights.  
- 🗒️ **Notes & Documents** – Keep track of all your ideas and files in one organized workspace.  
- 🎙️ **Voice Task Input** – Add new tasks hands-free through voice commands or recorded notes.  
- 🔐 **User Authentication** – Secure registration, login, and session handling for protected user data.  
- 🖥️ **Modern UI** – A clean, minimal, and responsive interface for both desktop and mobile use.

---

## 🛠️ Tech Stack

**Frontend:**
- React (with Hooks & Redux Toolkit for state management)
- React Router for navigation
- TailwindCSS for fast, responsive styling
- Lucide Icons for sleek UI elements

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- OpenAI API for AI summarization
- Multer for file handling (documents, audio)

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
- git clone https://github.com/langavi/taskflow.git
- cd taskflow
```

---

### 2. Install dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

---

### Environment Variables
```bash
- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_secret_key
- OPENAI_API_KEY=your_openai_api_key
```

---

### Project Structure
```bash

taskflow/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   └── App.js
└── README.md
```

---

# 💡 What Makes This Project Special
This app represents my passion for clean UI, scalable architecture, and real-world functionality.
It’s built from scratch — from designing the API routes and backend controllers to creating a smooth, minimal frontend experience.

I focused on:

- Writing maintainable, modular code.
- Integrating AI and voice functionality for enhanced usability.
- Building a secure authentication system with JWT.
- Ensuring a responsive, modern user experience that feels natural on any device.

# 🔮 Future Improvements
- 📱 Develop a mobile version using React Native.
- 🧑‍🤝‍🧑 Add team collaboration features for shared task boards.
- 🌗 Introduce a dark/light mode toggle for better accessibility.
- 📅 Integrate a calendar view for scheduling and reminders.
- 💬 Implement real-time notifications for task updates.

# 👨‍💻 About the Developer
Hi, I’m Langavi, a junior full-stack developer passionate about creating smart, intuitive digital experiences.
I love building tools that make people’s lives easier, combining logic, design, and innovation.

- 💬 Ask me about: React, Redux, Node.js, MongoDB, and API design
- 🌍 Portfolio: [https://langavi.dev](https://langavi-portfolio.vercel.app/)
- 📫 Contact: mlangaviclyde@gmail.com
