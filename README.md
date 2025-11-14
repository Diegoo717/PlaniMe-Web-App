<div align="center">

# 🍎 PlaniMe Web

**Your personalized nutrition assistant: smart meal plans and health tracking**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

🌐 **[Live Demo](https://planime.diecode.lat)**

</div>

---

## 🎯 About The Project

**PlaniMe Web** is a modern frontend interface developed with vanilla HTML, CSS, and JavaScript that interacts with the PlaniMe RESTful API. It allows users to view and manage personalized meal plans, optimizing the experience for both mobile and desktop devices with a mobile-first approach.

### What Makes PlaniMe Special?

- 🍽️ **Personalized Plans**: Complete management of meal plans adapted to each user
- 📱 **Responsive Design**: Optimized for mobile and desktop (Mobile First)
- 🔐 **Secure Authentication**: JWT-based authentication system
- ⚡ **High Performance**: Asset optimization and lazy loading
- 🎨 **Intuitive Interface**: Clean and easy-to-use design
- 🔄 **RESTful API**: Efficient communication with backend

---

## ✨ Key Features

### 🥗 Meal Plan Management

- Create and customize personalized nutrition plans
- Daily and weekly meal planning
- Nutritional information tracking
- Recipe recommendations

### 📊 Progress Tracking

- Weight monitoring over time
- Goal achievement tracking
- Visual statistics and charts
- Progress history

### 👤 User Dashboard

- Personal profile management
- Health metrics configuration
- Dietary preferences and restrictions
- Activity level settings

### 🎨 User Experience

- Modern and clean design
- Smooth CSS animations
- Responsive across all devices
- Optimized loading times

---

## 🛠️ Tech Stack

### Core

- **[HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML)** - Semantic and accessible structure
- **[CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS)** - Modern styles with animations
- **[JavaScript (Vanilla)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** - No external dependencies

### Architecture

- **Pattern**: Client-Server (REST API)
- **Communication**: Fetch API + JSON
- **Security**: JWT + Google OAuth + HTTPS + CORS
- **Performance**: Asset optimization and lazy loading

### CI/CD

- **GitHub Actions** - Automated deployment pipeline
- **Workflow**: `.github/workflows/main.yml`

---

## 📂 Project Structure

The project follows a modular structure with clear separation of concerns:

- **Assets Layer**: Contains all static resources including CSS (base styles, animations, responsive), images, JavaScript modules, and downloadable files
- **Pages Layer**: Organized by feature modules including authentication, contact, home, meal plans management, and user profile
- **Styling Architecture**: Modular CSS with separated concerns for animations, base styles, and responsive design
- **Scripts**: Vanilla JavaScript modules for API communication, authentication, and UI interactions

---

## 📦 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional for development)

---

## 🚀 Installation

### For Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/Diegoo717/PlaniMe-Web-App.git
   cd planime-webapp
   ```

2. **Start a local server**

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js (http-server)
   npx http-server
   ```

3. **Access the application**
   ```
   http://localhost:8000
   ```

### For Production

The application is optimized to be served from any static web server. Simply upload the files to your web server and configure your domain.

---

## 📱 Mobile Version

In addition to the responsive web version, we also have a native mobile application available:

- **Android APK**: Available at `assets/downloads/PlaniMe_v1.0.apk`
- **Repository**: [PlaniMe Mobile](https://github.com/Diegoo717/PlaniMe-MobileApp)

---

## 🔧 Development

### Development Workflow

Since the application uses vanilla JavaScript, it doesn't require a build process:

1. Make changes to source files
2. Reload the browser to see changes
3. Use browser developer tools for debugging

### CI/CD Pipeline

The project includes GitHub Actions configuration for automatic deployment:

- **File**: `.github/workflows/main.yml`
- **Triggers**: Push to main branch
- **Actions**: Automatic deployment to production server

---

## 🌐 API Integration

The application connects to PlaniMe's RESTful API:

- **Authentication**: JWT for secure sessions
- **Plans**: Complete CRUD for meal plans
- **Progress**: Weight tracking and goal monitoring
- **Profile**: Personal information management

---

## 📜 Available Scripts

```bash
# No build process required - just open index.html in a browser
# Or use any local server for development
```

---

## 📄 License

© 2025 PlaniMe. All rights reserved.

This project is a personal portfolio project and is not licensed for public use, modification, or distribution.

---

## 📞 Contact

**Diego Magaña Álvarez**  
_Full-Stack Developer_

soydiegoo71@gmail.com | +52 445 105 9192

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/diego-magana-dev)

---

## 🙏 Acknowledgments

- [MDN Web Docs](https://developer.mozilla.org/)
- [HTML5 Specification](https://html.spec.whatwg.org/)
- [CSS3 Documentation](https://www.w3.org/Style/CSS/)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

---

<div align="center">

**Made with ❤️ and ☕**

⭐ Don't forget to give the project a star if you liked it! ⭐

**PlaniMe** - Revolutionizing personalized nutrition with web technology 🚀

</div>
