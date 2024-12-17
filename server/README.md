# Collaborative Whiteboard

This project is a **real-time collaborative whiteboard** application built using **React**, **Canvas API**, and **Socket.IO**. It allows multiple users to draw, edit, and interact with a shared whiteboard simultaneously, facilitating seamless collaboration.

---

## Features 🚀

- **Drawing Tools**: Users can draw lines, rectangles, and text on the whiteboard.
- **Real-Time Updates**: Changes made by one user are immediately reflected for all connected users.
- **Multi-User Support**: Multiple participants can collaborate on the same board in real-time.
- **Responsive UI**: Designed for usability across devices and screen sizes.
- **Socket.IO Integration**: Low-latency communication for an interactive experience.
- **Cursor Position Indicators**: Displays cursor positions of other connected users.

---

## Technologies Used 🛠️

### Frontend:
- **React.js, Redux** - For building the user interface.
- **Canvas API** - For drawing and managing shapes on the whiteboard.

### Backend:
- **Node.js** - Server-side runtime environment.
- **Express.js** - Web server framework for handling routes.
- **Socket.IO** - Real-time, bidirectional communication.

### Other Tools:
- **React Hooks, Redux** - State management and side effects.
- **CSS** - Styling components for a responsive design.

---

## Prerequisites 📋

Make sure you have the following installed on your machine:

- **Node.js** (v14 or above)
- **npm** or **yarn** (Package manager)

---

## Installation and Setup 🧩

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd collaborative-whiteboard
   ```

2. **Install dependencies**:
    - Install backend and frontend dependencies:
   ```bash
   npm install
   ```

3. **Run the server**:
   ```bash
   npm start
   ```
   The server will start at `http://localhost:3000`.

4. **Run the client**:
    - Open another terminal window and navigate to the frontend folder (if split).
   ```bash
   npm start
   ```

---

## Project Structure 📁

```
collaborative-whiteboard/
├── public/               # Static assets
├── src/                  # Main application code
│   ├── components/       # React components
│   ├── constants/        # Shared constants (e.g., tool types, cursor positions)
│   ├── hooks/            # Custom React hooks
│   ├── App.js            # Main app component
│   ├── index.js          # Entry point
├── server/               # Backend server (Node.js + Socket.IO)
├── package.json          # Project dependencies and scripts
└── README.md             # Documentation
```

---

## How It Works ⚙️

1. **Tool Selection**:
    - Users can select tools like **LINE**, **PENCIL**, **RECTANGLE**, or **TEXT** to draw on the canvas.
2. **Real-Time Drawing**:
    - User actions are captured on the frontend and broadcasted to all connected users using Socket.IO.
3. **Canvas Updates**:
    - The Canvas API renders shapes and text in real time based on shared data.

---

## Scripts 📜

- **Start Application**:
   ```bash
   npm start
   ```
- **Build for Production**:
   ```bash
   npm run build
   ```

---

## Future Improvements ✨

- Add color picker and thickness options for drawing tools.
- Implement undo/redo functionality.
- Enable saving whiteboard content as an image or PDF.
- Add user authentication for session management.
- Add collaborative cursors and name tags.

---

## Contributing 🤝

Contributions are welcome! Please fork this repository and submit a pull request.

---


## Acknowledgments 🙌

- Tools: React, Redux, Canvas API, Socket.IO

---

## Contact 📧

For any questions or feedback, feel free to reach out:
- **Kobi Peretz**
- Email: `makegood2you@gmail.com`