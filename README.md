# BT Document Processor - Smart RAG Pipeline Frontend

A modern, responsive web-based frontend for a Smart Document Processing Pipeline using Retrieval-Augmented Generation (RAG) technology. Built with HTML5, CSS3, JavaScript, Bootstrap 5.3, Chart.js, SweetAlert2, and DataTables.

## Features

### 📋 Dashboard
- **Real-time Statistics**: Track processed documents, success rates, insights generated, and average processing time
- **Visual Analytics**: Dynamic charts showing processing status distribution and trends
- **Performance Metrics**: Comprehensive overview of system performance

### 📁 Document Upload
- **Drag & Drop Interface**: User-friendly file upload with drag-and-drop support
- **Multiple Format Support**: PDF, DOCX, and TXT file uploads
- **Smart Validation**: File type and size validation (max 50MB)
- **Processing Options**:
  - Enable/Disable OCR (Optical Character Recognition)
  - Enable/Disable Data Extraction
  - Enable/Disable Summary Generation

### 📊 Results Management
- **DataTables Integration**: Sortable, filterable results table
- **Advanced Filtering**: Search by document name or filter by status
- **Status Tracking**: View document processing status (Completed, Processing, Failed)
- **Export Functionality**: Download results as CSV
- **Document Details**: View comprehensive information about each processed document

### 📈 Analytics & Insights
- **Document Type Distribution**: Pie/Bar charts showing document type breakdown
- **Processing Performance**: Radar chart displaying system performance metrics
- **Monthly Volume**: Area chart showing processing volume trends
- **Key Insights**: Summary of top insights and performance alerts

### 🎨 Design
- **Dark Theme**: Professional dark blue color scheme (#0F1B3F primary background)
- **Responsive Design**: Fully mobile-friendly interface
- **Smooth Animations**: Engaging hover effects and transitions
- **Accessibility**: Semantic HTML and WCAG compliant

## Color Scheme

\`\`\`
Primary Background:    #0F1B3F
Secondary Background:  #1a2847
Card/Button Borders:   #3F4F7C
Primary Text:          #F0F6FD
Secondary Text:        #ffffff
Accent Color:          #4169e1 (Royal Blue)
Success:               #28a745
Warning:               #ffc107
Danger:                #dc3545
Info:                  #17a2b8
\`\`\`

## Technology Stack

### Frontend Framework & UI
- **Bootstrap 5.3**: Responsive grid system and components
- **HTML5**: Semantic markup
- **CSS3**: Custom styling with CSS variables and animations

### Libraries & Tools
- **Chart.js 4.4.0**: Data visualization
- **DataTables 1.13.7**: Advanced table functionality
- **SweetAlert2 11.7.0**: Beautiful alert notifications
- **Font Awesome 6.4.0**: Icon library
- **jQuery 3.6.0**: DOM manipulation

## Project Structure

\`\`\`
BTDocProcessor/
├── index.html                 # Main application file
├── assets/
│   ├── css/
│   │   └── style.css         # Custom styles and theming
│   └── js/
│       └── app.js            # Main application logic
└── ReadMe.MD                 # Documentation
\`\`\`

## Installation & Setup

### Option 1: Direct File Opening
1. Clone or download the project files
2. Open \`index.html\` in your web browser
3. No server setup required - the application runs entirely in the browser

### Option 2: Local Development Server
For better development experience with CORS support:

\`\`\`bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
\`\`\`

Then navigate to \`http://localhost:8000\`

## Usage Guide

### Upload Documents
1. Click on the **Upload Documents** section
2. Drag and drop files or click to select
3. Supported formats: PDF, DOCX, TXT (max 50MB each)
4. Configure processing options:
   - OCR (for scanned documents)
   - Data Extraction (for structured data)
   - Summary Generation (for document summaries)
5. Click **Process Documents**

### View Results
1. Go to the **Results** section
2. Use the search bar to find specific documents
3. Filter by status (Completed, Processing, Failed)
4. Click the eye icon to view detailed information
5. Export results as CSV using the **Export Results** button

### Analyze Data
1. Navigate to the **Analytics** section
2. Review document type distribution
3. Monitor processing performance metrics
4. Track monthly processing volume trends

## API Integration (Backend Connection)

To connect this frontend to a backend API, modify the \`app.js\` file:

### Processing Documents Example
\`\`\`javascript
// Replace the processFilesSimulation function with:
async function processFiles(files, options) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('options', JSON.stringify(options));

    const response = await fetch('/api/process-documents', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    processedDocuments = result.documents;
    updateDataTable();
    updateStats();
    updateCharts();
}
\`\`\`

### Expected Backend Response Format
\`\`\`json
{
    "documents": [
        {
            "id": 1,
            "name": "document.pdf",
            "type": "PDF",
            "status": "completed",
            "processingTime": "2.45",
            "confidence": "92.5",
            "dateProcessed": "2026-02-02 10:30:00",
            "size": 2048576,
            "insights": [
                "Key finding 1",
                "Key finding 2"
            ]
        }
    ]
}
\`\`\`

## Browser Support

- Chrome/Edge: ✅ Latest versions
- Firefox: ✅ Latest versions
- Safari: ✅ Latest versions
- Mobile browsers: ✅ iOS Safari, Chrome Android

## Performance Considerations

- **Lazy Loading**: Charts render on section visibility (can be optimized)
- **File Upload**: Supports multiple files with validation
- **Table Rendering**: DataTables handles large datasets efficiently
- **Responsive Images**: Optimized for all screen sizes

## Accessibility Features

- ✅ Semantic HTML structure
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ High contrast color scheme
- ✅ Focus indicators on form elements

## Troubleshooting

### Charts Not Displaying
- Ensure Chart.js CDN is accessible
- Check browser console for errors
- Verify canvas elements are present in HTML

### DataTable Not Sorting
- Ensure DataTables JS is loaded
- Check that column data types are correct
- Verify table structure is valid

### File Upload Issues
- Check file type is supported (PDF, DOCX, TXT)
- Verify file size is under 50MB
- Clear browser cache if issues persist

### Styling Issues
- Clear browser cache
- Check that Bootstrap CSS is loaded
- Verify custom CSS file path is correct

## Security Considerations

⚠️ **Important**: This frontend requires a secure backend API
- Never send sensitive data to public endpoints
- Implement proper authentication/authorization
- Use HTTPS in production
- Validate all user inputs on backend
- Implement rate limiting for API calls

## Future Enhancement Ideas

- 🔐 User authentication system
- 📱 Native mobile app version
- 🌍 Multi-language support
- 🎨 Theme customization UI
- 📧 Email export functionality
- 🔔 Real-time push notifications
- 📱 Progressive Web App (PWA) features
- 🤖 AI-powered document classification
- 🔄 Batch processing scheduling
- 📦 Document versioning system

## Performance Optimization Tips

1. **Lazy load charts** - Render only when visible
2. **Pagination** - DataTables handles large datasets
3. **Debounce search** - Reduce filtering frequency
4. **Optimize images** - Compress any image assets
5. **Minify assets** - Use minified CSS/JS in production

## Production Deployment

### Checklist
- [ ] Update API endpoints in \`app.js\`
- [ ] Minify CSS and JavaScript
- [ ] Enable GZIP compression
- [ ] Set proper CORS headers
- [ ] Implement error handling
- [ ] Add analytics tracking
- [ ] Test across browsers
- [ ] Optimize images
- [ ] Set up SSL/TLS
- [ ] Configure CDN for assets

### Suggested Hosting
- AWS S3 + CloudFront
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

## Support & Contribution

For issues, questions, or contributions:
1. Check the troubleshooting section
2. Review the code comments
3. Test in multiple browsers
4. Document any custom modifications

## License

This project is provided as-is for use in document processing applications.

## Version History

**v1.0.0** (Feb 2, 2026)
- Initial release
- Core dashboard and analytics
- Document upload and processing
- Results management
- Export functionality
- Responsive design

---

**Created with ❤️ for Smart Document Processing**

For detailed technical questions or backend integration support, please refer to the Smart Document Processing Pipeline (RAG) main documentation.
