# Athlete Journal - Personal Performance Tracking App

A Progressive Web App (PWA) designed for athletes to track their mental performance throughout practice and daily life through a point-based rating system with visual charts.

## Features

### My Progress Screen
- **Performance Overview**: 2D vertical bar chart showing average grades for each point
- **Life Balance Wheel**: Radar chart displaying category averages 
- **Deleted Points Chart**: Toggle-able chart showing deleted points with their last known averages
- **Past Ratings List**: Chronological list of all recorded days
- **Date Filtering**: Week, Month, Year, or custom date range filtering

### Points of Grading Screen
- **Category Management**: Create categories with custom names and colors
- **Point Management**: Create points within categories, edit names, delete to trash
- **Collapsible Interface**: Categories can be expanded/collapsed for better organization
- **Trash System**: Deleted points are stored and can be viewed in charts

### Recording System
- **Daily Recording**: Rate each point on a 1-10 scale
- **Visual Sliders**: Interactive sliders with real-time value display
- **Category Organization**: Points grouped by category during recording
- **Data Persistence**: All data stored locally on your device

## Installation & Setup

### Quick Start
1. Open `index.html` in your web browser
2. The app will work immediately with all features
3. Data is automatically saved to your browser's local storage

### Mobile Installation (Android)
1. Open Chrome browser on your Android device
2. Navigate to the app URL (if hosted) or open the HTML file
3. Tap the Chrome menu (3 dots) → "Add to Home screen"
4. The app will install as a standalone app
5. Access it from your home screen like any other app

### Hosting Options
For mobile use, you'll need to host the files. Here are simple options:

#### Option 1: GitHub Pages (Free)
1. Create a GitHub repository
2. Upload all files to the repository
3. Enable GitHub Pages in repository settings
4. Access your app at `https://yourusername.github.io/repository-name`

#### Option 2: Local Network Server
1. Install Python (if not already installed)
2. Navigate to the project folder in terminal/command prompt
3. Run: `python -m http.server 8000` (Python 3) or `python -m SimpleHTTPServer 8000` (Python 2)
4. Access at `http://localhost:8000` or `http://your-ip:8000` from any device on your network

#### Option 3: Netlify Drop (Free)
1. Visit netlify.com
2. Drag and drop your entire project folder
3. Get instant hosting with HTTPS

## Usage Guide

### First Time Setup
1. **Create Categories**: Start by creating categories (e.g., "Mental Focus", "Physical Energy", "Motivation")
2. **Add Points**: Create specific points within each category (e.g., "Concentration during drills", "Energy level")
3. **Record Your First Day**: Use the "Record a Day" button to rate all your points

### Daily Use
1. **Record Performance**: At the end of each day, click "Record a Day"
2. **Rate Each Point**: Use the sliders to rate each point from 1-10
3. **Save**: Click Save to store your ratings
4. **Review Progress**: Check your charts to see trends and patterns

### Data Management
- **View Progress**: Use date filters to analyze different time periods
- **Edit Points**: Click the edit button (✏️) to rename points
- **Delete Points**: Click delete button (🗑️) to move points to trash
- **Toggle Views**: Show/hide deleted points and past ratings as needed

## Technical Details

### File Structure
```
athlete-journal/
├── index.html          # Main application file
├── manifest.json       # PWA manifest for mobile installation
├── sw.js              # Service worker for offline functionality
├── css/
│   └── styles.css     # All styling and responsive design
├── js/
│   ├── storage.js     # Local storage management
│   ├── charts.js      # Chart generation and updates
│   └── app.js         # Main application logic
└── images/
    └── (app icons)    # Various sized icons for mobile installation
```

### Data Storage
- **Local Storage**: All data is stored in your browser's local storage
- **No Server Required**: Fully client-side application
- **Data Persistence**: Data survives browser restarts and device reboots
- **Privacy**: Your data never leaves your device

### Offline Support
- **Service Worker**: App works completely offline after first load
- **Resource Caching**: All files cached for offline use
- **Data Recording**: Can record data even without internet connection

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: Android Chrome, iOS Safari
- **PWA Features**: Full PWA support on Android, partial on iOS

## Customization

### Colors
Edit `css/styles.css` to change:
- Primary color: Search for `#2196F3`
- Category colors: Set when creating categories
- Chart colors: Automatically inherit from category colors

### Layout
- **Responsive Design**: Automatically adapts to screen size
- **Dark Mode**: Respects system dark mode preference
- **Mobile First**: Optimized for mobile use

## Troubleshooting

### Data Not Saving
- Check if browser allows local storage
- Clear browser cache and try again
- Ensure you're not in incognito/private mode

### Charts Not Loading
- Check internet connection (for Chart.js library)
- Refresh the page
- Clear browser cache

### Mobile Installation Issues
- Use Chrome browser on Android
- Ensure the site is served over HTTPS (for some features)
- Check that all manifest files are present

## Future Enhancements

Possible improvements you could add:
- Data export/import functionality
- Goal setting and achievement tracking
- Streak counters and rewards
- Reminder notifications
- Team sharing capabilities
- Advanced analytics and insights

## License

This is a personal project created for individual use. Feel free to modify and adapt for your own needs.

## Support

Since this is a personal project, support is limited. However, you can:
- Check the browser console for error messages
- Verify all files are in the correct locations
- Ensure your browser supports modern JavaScript features

Enjoy tracking your athletic performance! 🏃‍♂️📊
