# BT Document Processor - Quick Start Guide

## 🚀 Getting Started in 30 Seconds

### 1. **Open the Application**
Simply open the `index.html` file in your web browser:
- Double-click `index.html`
- Or open it in any modern browser (Chrome, Firefox, Safari, Edge)

### 2. **Navigate to Upload Section**
- Click "Upload" in the navigation bar
- Or scroll down to the Upload Documents section

### 3. **Upload Documents**
- Drag and drop PDF, DOCX, or TXT files
- Or click to select files from your computer
- Check processing options (OCR, Extraction, Summary)
- Click "Process Documents"

### 4. **View Results**
- Go to the "Results" section
- See your processed documents in the table
- Click the eye icon to view details
- Export results as CSV

### 5. **Analyze Data**
- Navigate to "Analytics" to see charts and insights
- Monitor processing trends
- Review performance metrics

---

## 📁 File Structure

```
BTDocProcessor/
├── index.html                 ← Open this file in your browser
├── assets/
│   ├── css/
│   │   └── style.css         ← All styling and colors
│   └── js/
│       └── app.js            ← Application logic and features
└── ReadMe.MD                 ← Full documentation
```

---

## 🎨 Customization Quick Tips

### Change Colors
Edit `/assets/css/style.css` - Look for the `:root` section at the top:

```css
:root {
    --primary-bg: #0F1B3F;      /* Dark blue background */
    --card-border: #3F4F7C;     /* Card borders */
    --text-primary: #F0F6FD;    /* Light text */
    --accent-color: #4169e1;    /* Royal blue accent */
}
```

### Add Custom Text
- Edit the HTML strings in `index.html`
- Modify chart labels in `app.js` under `initializeCharts()`
- Update stat titles in the HTML

### Change Processing Logic
- Modify `processFilesSimulation()` in `app.js` to connect to your backend API
- Update mock data generation in `loadMockData()`

---

## 🔌 Connect to Your Backend

Replace the mock processing with real API calls:

```javascript
// In app.js, modify the processFilesSimulation function:
async function processFiles(files, options) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('options', JSON.stringify(options));

    const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    processedDocuments = result.documents;
    updateDataTable();
    updateStats();
    updateCharts();
}
```

---

## ✨ Key Features at a Glance

| Feature | Location | Purpose |
|---------|----------|---------|
| Dashboard | Top Section | Real-time stats and trends |
| File Upload | Upload Section | Add documents for processing |
| Results Table | Results Section | View processed documents |
| Analytics | Analytics Section | Charts and insights |
| Export | Results Table | Download as CSV |

---

## 🛠️ Browser Testing

Works on all modern browsers:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

---

## 📞 Support

### Common Issues

**Charts not showing?**
- Check browser console for errors (F12)
- Ensure JavaScript is enabled
- Try refreshing the page

**Upload not working?**
- Check file size (max 50MB)
- Verify file format (PDF, DOCX, TXT)
- Check browser console for errors

**Styling looks wrong?**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Try different browser

---

## 🎯 Next Steps

1. **Customize the colors** - Change the color scheme to match your brand
2. **Connect your API** - Integrate with your backend processing service
3. **Add your logo** - Update the navbar brand text and icon
4. **Test thoroughly** - Verify all features work with your data
5. **Deploy** - Host on Netlify, Vercel, AWS S3, or your own server

---

## 📚 Full Documentation

For detailed information, see `ReadMe.MD` which includes:
- Complete feature descriptions
- Installation methods
- API integration examples
- Troubleshooting guide
- Performance optimization tips
- Security considerations
- Production deployment checklist

---

## 🎉 You're Ready!

Your Smart Document Processing Pipeline frontend is ready to use. Start by opening `index.html` in your browser and exploring the interface!

**Questions?** Check the ReadMe.MD file for comprehensive documentation.

Happy processing! 🚀
