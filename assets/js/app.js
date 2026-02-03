/* =====================================================
   BT Document Processor - Main Application Logic
   ===================================================== */

// Global Variables
let selectedFiles = [];
let processedDocuments = [];
let dataTable = null;
let statusChart = null;
let trendsChart = null;
let docTypeChart = null;
let performanceChart = null;
let volumeChart = null;

// =====================================================
// Document Upload Handling
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeDataTable();
    initializeCharts();
    loadMockData();
});

function initializeEventListeners() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const processBtn = document.getElementById('processBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exportBtn = document.getElementById('exportBtn');

    // Drag and drop events
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Button events
    processBtn.addEventListener('click', handleProcessDocuments);
    clearBtn.addEventListener('click', handleClearFiles);
    exportBtn.addEventListener('click', handleExportResults);

    // Filter and search
    document.getElementById('filterInput').addEventListener('keyup', filterTable);
    document.getElementById('statusFilter').addEventListener('change', filterTableByStatus);
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('drag-over');

    const files = Array.from(e.dataTransfer.files);
    addFilesToList(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    addFilesToList(files);
}

function addFilesToList(files) {
    // Validate and add files
    files.forEach(file => {
        // Check file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        const validExtensions = ['.pdf', '.docx', '.txt'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

        if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid File Type',
                text: `${file.name} is not a supported file type. Please upload PDF, DOCX, or TXT files.`,
                background: '#0F1B3F',
                color: '#F0F6FD',
                confirmButtonColor: '#4169e1'
            });
            return;
        }

        // Check file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'File Too Large',
                text: `${file.name} exceeds the 50MB limit.`,
                background: '#0F1B3F',
                color: '#F0F6FD',
                confirmButtonColor: '#4169e1'
            });
            return;
        }

        // Check if file already added
        if (selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
            Swal.fire({
                icon: 'warning',
                title: 'File Already Added',
                text: `${file.name} has already been added to the list.`,
                background: '#0F1B3F',
                color: '#F0F6FD',
                confirmButtonColor: '#4169e1'
            });
            return;
        }

        selectedFiles.push(file);
    });

    renderFileList();
    updateProcessButtonState();
}

function renderFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    if (selectedFiles.length === 0) {
        fileList.innerHTML = '<p class="text-muted text-center py-3">No files selected</p>';
        return;
    }

    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item fade-in';
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">
                    <i class="${getFileIcon(file.name)}"></i>
                </div>
                <div class="file-details">
                    <div class="file-name" title="${file.name}">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <div class="file-actions">
                <button class="btn btn-sm btn-danger" onclick="removeFile(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        fileList.appendChild(fileItem);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    renderFileList();
    updateProcessButtonState();
}

function handleClearFiles() {
    if (selectedFiles.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'No Files',
            text: 'There are no files to clear.',
            background: '#0F1B3F',
            color: '#F0F6FD',
            confirmButtonColor: '#4169e1'
        });
        return;
    }

    Swal.fire({
        title: 'Clear All Files?',
        text: `Are you sure you want to remove ${selectedFiles.length} file(s)?`,
        icon: 'warning',
        background: '#0F1B3F',
        color: '#F0F6FD',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        showCancelButton: true,
        confirmButtonText: 'Clear'
    }).then(result => {
        if (result.isConfirmed) {
            selectedFiles = [];
            renderFileList();
            updateProcessButtonState();
            Swal.fire({
                icon: 'success',
                title: 'Cleared',
                text: 'All files have been removed.',
                background: '#0F1B3F',
                color: '#F0F6FD',
                confirmButtonColor: '#4169e1'
            });
        }
    });
}

function updateProcessButtonState() {
    const processBtn = document.getElementById('processBtn');
    processBtn.disabled = selectedFiles.length === 0;
}

// =====================================================
// Document Processing
// =====================================================

async function handleProcessDocuments() {
    if (selectedFiles.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'No Files',
            text: 'Please select files to process.',
            background: '#0F1B3F',
            color: '#F0F6FD',
            confirmButtonColor: '#4169e1'
        });
        return;
    }

    // Show processing confirmation
    const result = await Swal.fire({
        title: 'Start Processing?',
        text: `Process ${selectedFiles.length} file(s) with the selected options?`,
        icon: 'question',
        background: '#0F1B3F',
        color: '#F0F6FD',
        confirmButtonColor: '#4169e1',
        cancelButtonColor: '#6c757d',
        showCancelButton: true,
        confirmButtonText: 'Process'
    });

    if (!result.isConfirmed) return;

    // Get processing options
    const enableOCR = document.getElementById('enableOCR').checked;
    const enableExtraction = document.getElementById('enableExtraction').checked;
    const enableSummary = document.getElementById('enableSummary').checked;

    // Show progress dialog
    const { value: html } = await Swal.fire({
        title: 'Processing Documents',
        html: `
            <div class="processing-dialog">
                <div class="progress mb-3">
                    <div class="progress-bar" id="progressBar" role="progressbar" style="width: 0%"></div>
                </div>
                <p id="progressText">Initializing...</p>
            </div>
        `,
        background: '#0F1B3F',
        color: '#F0F6FD',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            processFilesSimulation(enableOCR, enableExtraction, enableSummary);
        }
    });
}

async function processFilesSimulation(ocr, extraction, summary) {
    const totalFiles = selectedFiles.length;
    let processed = 0;

    for (let i = 0; i < totalFiles; i++) {
        const file = selectedFiles[i];
        const startTime = Date.now();

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));

        const processingTime = (Date.now() - startTime) / 1000;
        const confidence = Math.random() * 30 + 70; // 70-100%

        // Add to processed documents
        processedDocuments.push({
            id: processedDocuments.length + 1,
            name: file.name,
            type: getFileType(file.name),
            status: Math.random() > 0.1 ? 'completed' : 'failed',
            processingTime: processingTime.toFixed(2),
            confidence: confidence.toFixed(2),
            dateProcessed: new Date().toLocaleString(),
            size: file.size,
            ocr: ocr,
            extraction: extraction,
            summary: summary,
            insights: generateMockInsights()
        });

        // Update progress
        processed++;
        const progress = (processed / totalFiles) * 100;
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');

        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (progressText) {
            progressText.textContent = `Processing: ${processed} of ${totalFiles} files...`;
        }
    }

    // Close loading dialog and show success
    Swal.close();

    Swal.fire({
        icon: 'success',
        title: 'Processing Complete',
        text: `Successfully processed ${processedDocuments.length} document(s).`,
        background: '#0F1B3F',
        color: '#F0F6FD',
        confirmButtonColor: '#4169e1'
    });

    // Clear files and update UI
    selectedFiles = [];
    renderFileList();
    updateProcessButtonState();
    updateDataTable();
    updateStats();
    updateCharts();
}

// =====================================================
// DataTable Initialization and Management
// =====================================================

function initializeDataTable() {
    dataTable = $('#resultsTable').DataTable({
        pageLength: 10,
        order: [[5, 'desc']],
        columnDefs: [
            { orderable: false, targets: 6 }
        ],
        language: {
            emptyTable: "No data available",
            zeroRecords: "No matching results found",
            info: "Showing _START_ to _END_ of _TOTAL_ results",
            infoEmpty: "No results available",
            infoFiltered: "(filtered from _MAX_ total results)",
            lengthMenu: "Show _MENU_ results",
            search: "Search:",
            paginate: {
                first: "First",
                last: "Last",
                next: "Next",
                previous: "Previous"
            }
        }
    });
}

function updateDataTable() {
    if (!dataTable) return;

    dataTable.clear();

    processedDocuments.forEach(doc => {
        const statusClass = `status-${doc.status}`;
        dataTable.row.add([
            doc.name,
            doc.type,
            `<span class="status-badge ${statusClass}">${doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span>`,
            doc.processingTime + 's',
            doc.confidence + '%',
            doc.dateProcessed,
            `<button class="btn btn-sm btn-primary" onclick="viewDocumentDetails(${doc.id})"><i class="fas fa-eye"></i></button>`
        ]).draw();
    });

    updateEmptyState();
}

function filterTable() {
    const searchTerm = document.getElementById('filterInput').value.toLowerCase();
    dataTable.search(searchTerm).draw();
}

function filterTableByStatus() {
    const status = document.getElementById('statusFilter').value;
    if (status === '') {
        dataTable.column(2).search('').draw();
    } else {
        const statusText = status.charAt(0).toUpperCase() + status.slice(1);
        dataTable.column(2).search(statusText).draw();
    }
}

function updateEmptyState() {
    const emptyState = document.getElementById('emptyState');
    const table = document.getElementById('resultsTable');
    
    if (processedDocuments.length === 0) {
        emptyState.style.display = 'block';
        table.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        table.style.display = 'table';
    }
}

// =====================================================
// Document Details Modal
// =====================================================

function viewDocumentDetails(docId) {
    const doc = processedDocuments.find(d => d.id === docId);
    if (!doc) return;

    const modal = new bootstrap.Modal(document.getElementById('detailModal'));
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');

    modalTitle.textContent = doc.name;

    let detailsHtml = `
        <div class="detail-container">
            <div class="detail-row">
                <label>File Type:</label>
                <span>${doc.type}</span>
            </div>
            <div class="detail-row">
                <label>File Size:</label>
                <span>${formatFileSize(doc.size)}</span>
            </div>
            <div class="detail-row">
                <label>Status:</label>
                <span><span class="status-badge status-${doc.status}">${doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span></span>
            </div>
            <div class="detail-row">
                <label>Processing Time:</label>
                <span>${doc.processingTime}s</span>
            </div>
            <div class="detail-row">
                <label>Confidence Score:</label>
                <span>${doc.confidence}%</span>
            </div>
            <div class="detail-row">
                <label>Date Processed:</label>
                <span>${doc.dateProcessed}</span>
            </div>
            <hr>
            <h6>Processing Options</h6>
            <div class="detail-row">
                <label>OCR Enabled:</label>
                <span><i class="fas fa-${doc.ocr ? 'check text-success' : 'times text-danger'}"></i></span>
            </div>
            <div class="detail-row">
                <label>Data Extraction:</label>
                <span><i class="fas fa-${doc.extraction ? 'check text-success' : 'times text-danger'}"></i></span>
            </div>
            <div class="detail-row">
                <label>Summary Generated:</label>
                <span><i class="fas fa-${doc.summary ? 'check text-success' : 'times text-danger'}"></i></span>
            </div>
            <hr>
            <h6>Key Insights</h6>
            <ul class="insights-list">
                ${doc.insights.map(insight => `<li>${insight}</li>`).join('')}
            </ul>
        </div>
    `;

    modalContent.innerHTML = detailsHtml;
    modal.show();
}

// =====================================================
// Export Functionality
// =====================================================

function handleExportResults() {
    if (processedDocuments.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'No Data',
            text: 'No results to export. Process documents first.',
            background: '#0F1B3F',
            color: '#F0F6FD',
            confirmButtonColor: '#4169e1'
        });
        return;
    }

    // Export as CSV
    const csv = convertToCSV(processedDocuments);
    downloadCSV(csv, 'bt-document-processor-results.csv');

    Swal.fire({
        icon: 'success',
        title: 'Exported',
        text: 'Results have been exported as CSV.',
        background: '#0F1B3F',
        color: '#F0F6FD',
        confirmButtonColor: '#4169e1'
    });
}

function convertToCSV(data) {
    const headers = ['Document Name', 'Type', 'Status', 'Processing Time (s)', 'Confidence (%)', 'Date Processed'];
    const rows = data.map(doc => [
        doc.name,
        doc.type,
        doc.status,
        doc.processingTime,
        doc.confidence,
        doc.dateProcessed
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// =====================================================
// Statistics and Dashboard
// =====================================================

function updateStats() {
    const total = processedDocuments.length;
    const completed = processedDocuments.filter(d => d.status === 'completed').length;
    const successRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
    const avgTime = total > 0 ? (processedDocuments.reduce((sum, d) => sum + parseFloat(d.processingTime), 0) / total).toFixed(2) : 0;

    document.getElementById('statsProcessed').textContent = total;
    document.getElementById('statsSuccess').textContent = successRate + '%';
    document.getElementById('statsInsights').textContent = total * 3; // Mock: 3 insights per document
    document.getElementById('statsTime').textContent = avgTime + 's';
}

// =====================================================
// Chart Initialization
// =====================================================

function initializeCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: '#F0F6FD',
                    font: { size: 12, weight: 'bold' }
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#F0F6FD' },
                grid: { color: 'rgba(63, 79, 124, 0.2)' }
            },
            y: {
                ticks: { color: '#F0F6FD' },
                grid: { color: 'rgba(63, 79, 124, 0.2)' }
            }
        }
    };

    // Status Chart (Pie)
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Processing', 'Failed'],
            datasets: [{
                data: [65, 20, 15],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(220, 53, 69, 0.8)'
                ],
                borderColor: [
                    '#28a745',
                    '#ffc107',
                    '#dc3545'
                ],
                borderWidth: 2
            }]
        },
        options: chartOptions
    });

    // Trends Chart (Line)
    const trendsCtx = document.getElementById('trendsChart').getContext('2d');
    trendsChart = new Chart(trendsCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Documents Processed',
                data: [12, 19, 15, 25, 22, 18, 20],
                borderColor: '#4169e1',
                backgroundColor: 'rgba(65, 105, 225, 0.1)',
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#4169e1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: { ...chartOptions, scales: { ...chartOptions.scales, y: { beginAtZero: true, ...chartOptions.scales.y } } }
    });

    // Document Type Chart (Bar)
    const docTypeCtx = document.getElementById('docTypeChart').getContext('2d');
    docTypeChart = new Chart(docTypeCtx, {
        type: 'bar',
        data: {
            labels: ['PDF', 'DOCX', 'TXT'],
            datasets: [{
                label: 'Document Count',
                data: [45, 30, 25],
                backgroundColor: [
                    'rgba(65, 105, 225, 0.8)',
                    'rgba(63, 79, 124, 0.8)',
                    'rgba(40, 167, 69, 0.8)'
                ],
                borderColor: [
                    '#4169e1',
                    '#3F4F7C',
                    '#28a745'
                ],
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: chartOptions
    });

    // Performance Chart (Radar)
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    performanceChart = new Chart(performanceCtx, {
        type: 'radar',
        data: {
            labels: ['Speed', 'Accuracy', 'Reliability', 'Efficiency', 'Completeness'],
            datasets: [{
                label: 'Current Performance',
                data: [85, 92, 88, 78, 95],
                borderColor: '#4169e1',
                backgroundColor: 'rgba(65, 105, 225, 0.2)',
                pointBackgroundColor: '#4169e1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                r: {
                    ticks: { color: '#F0F6FD' },
                    grid: { color: 'rgba(63, 79, 124, 0.2)' },
                    pointLabels: { color: '#F0F6FD' }
                }
            }
        }
    });

    // Volume Chart (Area)
    const volumeCtx = document.getElementById('volumeChart').getContext('2d');
    volumeChart = new Chart(volumeCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Volume',
                data: [150, 180, 165, 210, 195, 240, 220, 260, 275, 290, 310, 340],
                borderColor: '#4169e1',
                backgroundColor: 'rgba(65, 105, 225, 0.1)',
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#4169e1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: { ...chartOptions, scales: { ...chartOptions.scales, y: { beginAtZero: true, ...chartOptions.scales.y } } }
    });
}

function updateCharts() {
    if (!processedDocuments.length) return;

    const completed = processedDocuments.filter(d => d.status === 'completed').length;
    const processing = processedDocuments.filter(d => d.status === 'processing').length;
    const failed = processedDocuments.filter(d => d.status === 'failed').length;

    if (statusChart) {
        statusChart.data.datasets[0].data = [completed, processing, failed];
        statusChart.update();
    }
}

// =====================================================
// Utility Functions
// =====================================================

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
        'pdf': 'fas fa-file-pdf',
        'docx': 'fas fa-file-word',
        'doc': 'fas fa-file-word',
        'txt': 'fas fa-file-alt'
    };
    return iconMap[ext] || 'fas fa-file';
}

function getFileType(filename) {
    const ext = filename.split('.').pop().toUpperCase();
    return ext;
}

function generateMockInsights() {
    const insights = [
        'Document structure is clear and well-organized',
        'Key entities identified with high confidence',
        'Content matches expected format patterns',
        'No anomalies detected during processing',
        'All required fields successfully extracted'
    ];
    return insights.slice(0, Math.floor(Math.random() * 3) + 2);
}

function loadMockData() {
    // Load some mock data on initialization
    Swal.fire({
        title: 'BT Document Processor',
        html: '<p>Welcome to the Smart Document Processing Pipeline!</p><p>Upload documents to get started.</p>',
        icon: 'info',
        background: '#0F1B3F',
        color: '#F0F6FD',
        confirmButtonColor: '#4169e1',
        confirmButtonText: 'Get Started'
    });
}
