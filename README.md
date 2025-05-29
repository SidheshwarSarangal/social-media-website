### Working Video

Working Video: [Link](https://drive.google.com/file/d/1fQHmYI_pEkLQ7-bsPQlJXyolkSrzSmmL/view)

---

### node modules should be reinstalled

It may happen that the node modules get currupted with time so you need to remove and then reinstall them in both main repo and server folder 

command for removing :  

    rm -rf node_modules package-lock.json
    
command for installing: 

    npm install

It may also happen that permissions are denied for sertain packages by the operating system so you need to grant the system the permissions.
If it is ok with you then try to grant all the permissions with commands : 

    sudo chmod -R 777 /usr/local/lib/node_modules
    
    sudo chmod -R 777 ~/.npm
    
These are for Linux

---

### `npm run dev' to start both the backend and frontend

In the main repo run this command `npm run dev` and start the server and the frontend.

# 📱 Full Stack Social Media Website

A complete **social media web application** built using **Express.js** for the backend and **React.js** for the frontend, implementing major features like authentication, content sharing, chatting, and more.

---

## 🔧 Main Functionality

This project includes both the **backend** and **frontend** of a modern social media platform.


### 🧠 Backend – Node.js + Express.js  
📅 _Sep 2024 – Oct 2024_

A full-featured backend for a social media platform written in JavaScript using Express.js. It provides RESTful APIs and handles all the core business logic.

#### ✅ Features Implemented:

- **User Authentication & Security**
  - OTP generation and email delivery
  - Account creation and login
  - Password reset via email
  - User profile update and deletion

- **User Management**
  - Get user details
  - Edit bio and update display picture
  - Follow/unfollow users

- **Posts & Interactions**
  - Create, edit, and delete posts
  - Like/dislike posts

- **Reels (Short Videos)**
  - Upload, edit, delete reels
  - Like/dislike reels

- **Stories/Status Updates**
  - Create and delete status videos
  - Like/dislike stories

- **Chat Mechanism**
  - Create chat sessions
  - Retrieve previous messages

#### 📁 Backend Components:

- `controllers/` - Logic for routes
- `routes/` - API endpoints
- `middlewares/` - Auth & validation logic
- `models/` - MongoDB models (OTP, User, Profile, Post, Reel, Status, Chat)

---

### 🎨 Frontend – React.js  
📅 _Oct 2024 – Nov 2024_

A responsive and feature-rich frontend built using React.js. Users can interact with the platform through an intuitive UI.

#### ✅ Features Implemented:

- **Authentication Pages**
  - Sign up with OTP
  - Login
  - Reset password via email

- **Home Page**
  - View posts from followed users
  - View and upload stories

- **Search Page**
  - Search for users by name
  - Suggested users to follow

- **Posts**
  - View others’ posts
  - Like, comment, and create posts

- **Reels Page**
  - View short videos
  - Like/dislike reels

- **Messaging System**
  - Search and chat with users
  - Chats enabled only if both users follow each other

- **Notifications**
  - See who followed or unfollowed you

- **Profile Page**
  - View and edit personal profile
  - Manage posts, reels, and stories

- **Other Pages**
  - Bio editing page
  - Logout functionality
