# Simon Says Game 🎮

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![SimpleKit](https://img.shields.io/badge/SimpleKit-Framework-green.svg)](https://github.com/dvogel/simplekit)
[![Vite](https://img.shields.io/badge/Vite-4.5.0-purple.svg)](https://vitejs.dev/)

A modern web-based implementation of the classic Simon Says memory game, featuring smooth animations and interactive gameplay. Built with TypeScript and SimpleKit framework for the User Interfaces course at the University of Waterloo (Fall 2023), taught by Daniel Vogel.

</div>

## ✨ Features

- 🎯 **Classic Gameplay**: Remember and repeat the sequence of colors
- 🎨 **Smooth Animations**: Beautiful circle animations for all game states
- 🎭 **Interactive UI**: Responsive design with hover effects and visual feedback
- 🎮 **Game Modes**:
  - Normal Mode: Test your memory
  - Cheat Mode: Press '?' to see the sequence
- ⚙️ **Customization**:
  - Press '+' to increase number of circles
  - Press '-' to decrease number of circles
- 🎯 **Score Tracking**: Keep track of your progress
- 🌈 **Visual Feedback**: Clear animations for game states (start, win, lose)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/SimonSaysGame.git
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Play

1. Watch the sequence of circles as they light up
2. Click the circles in the same order
3. Each successful round adds one more step to the sequence
4. Make a mistake and the game ends
5. Try to achieve the highest score possible!

### Special Controls

- `?` - Toggle cheat mode (shows the sequence)
- `+` - Increase number of circles
- `-` - Decrease number of circles

## 🛠️ Built With

- [TypeScript](https://www.typescriptlang.org/) - Type safety and better developer experience
- [SimpleKit](https://github.com/dvogel/simplekit) - UI Framework by Daniel Vogel
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling

## 📦 Project Structure

```
SimonSaysGame/
├── src/
│   ├── components/     # Game components
│   ├── styles/        # CSS and animations
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── package.json       # Project dependencies
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  Made with ❤️ by Omar Elserwi
</div>