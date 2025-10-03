# Optimus Prime 3D Web App (Three.js)

This project is an interactive **3D Optimus Prime** built with **Three.js**.  
It allows the user to manipulate different parts of the robot (feet, legs, arms, head) and connect/disconnect the trailer in real time.  

The project was developed as a way to explore **computer graphics, 3D modeling with code, and interactive animations** using only JavaScript and Three.js — without external 3D models.

---

## 🎮 Features

- Fully coded Optimus Prime robot (no imported meshes).
- Movable trailer with arrow keys.
- Control over different robot parts:
  - Rotate feet, legs, and head.
  - Translate arms.
- Collision detection: trailer automatically connects when touching the robot.
- Multiple cameras (front, side, top, isometric).
- Wireframe mode toggle.

---

## ⌨️ Controls

| Key | Action |
|-----|--------|
| **Arrow Keys** | Move trailer (← → ↑ ↓) |
| **1 – 5** | Switch cameras |
| **6** | Toggle wireframe mode |
| **Q / A** | Rotate feet forward / backward |
| **W / S** | Rotate legs forward / backward |
| **E / D** | Translate arms in / out |
| **R / F** | Rotate head up / down |
| **QWER** | Truck Mode |
| **ASDF** | Prime Mode |

---

## 🛠️ Tech Stack

- **Three.js** – 3D rendering
- **JavaScript** – logic and animation
- **HTML + CSS** – project structure and controls overlay

---

## ▶️ How to Run

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/optimus-prime-3d.git
   cd optimus-prime-3d
   ```

2. Start a simple local server (Python example):
   ```bash
   # For Python 3
   python -m http.server
   ```
   or
   ```bash
   # For Python on Windows (sometimes python is py)
   py -m http.server
   ```

3. Open your browser and go to:
   ```
   http://localhost:8000
   ```

4. Enjoy manipulating Optimus Prime!

---

## 📂 Project Structure

```
/optimus-prime-3d
 ├── index.html          # Main HTML file
 ├── css/
 │   └── style.css       # Controls box and layout
 └── js/
     ├── three.js        # Three.js library
     └── main-script.js  # Project code (Optimus Prime)
```

---

## 📸 Demo

---

## 📌 Notes

- Built entirely with Three.js primitives (`BoxGeometry`, `CylinderGeometry`, etc.).
- No external 3D models used.
- Focused on **learning computer graphics** and **interactive control systems**.
