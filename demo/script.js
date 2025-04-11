document.getElementById('fileInput').addEventListener('change', function(event) {
    // Store the selected files in a globally accessible place
    window.uploadedFiles = event.target.files;
    console.log(`Files selected: ${window.uploadedFiles.length}`);
    if (window.uploadedFiles.length > 0) {
        alert(`${window.uploadedFiles.length} file(s) ready for processing.`);
    }
});

document.getElementById('generateButton').addEventListener('click', async function() {
    const reportPreview = document.getElementById('reportPreview');
    const generateButton = document.getElementById('generateButton');

    if (!window.uploadedFiles || window.uploadedFiles.length === 0) {
        alert('No files selected. Please select .txt files first.');
        return;
    }

    // Create FormData to send files
    const formData = new FormData();
    for (let i = 0; i < window.uploadedFiles.length; i++) {
        // Optional: Client-side check for .txt files (backend also checks)
        if (!window.uploadedFiles[i].name.toLowerCase().endsWith('.txt')) {
            alert(`Skipping non-txt file: ${window.uploadedFiles[i].name}. Only .txt files are processed.`);
            continue; // Skip this file
        }
        formData.append('files', window.uploadedFiles[i]);
    }

    // Check if any valid files remain after filtering
    if (!formData.has('files')) {
         alert('No valid .txt files selected to upload.');
         return;
    }


    // Update UI to indicate processing
    generateButton.textContent = 'Generating...';
    generateButton.disabled = true;
    reportPreview.innerHTML = 'Processing files...';
    window.generatedReport = null; // Clear previous report

    try {
        // Send files to the backend
        const response = await fetch('http://localhost:8000/upload/', { // Ensure this URL matches your backend server
            method: 'POST',
            body: formData
            // 'Content-Type' header is automatically set by browser for FormData
        });

        if (!response.ok) {
            // Handle HTTP errors (like 400 or 500)
            const errorData = await response.json().catch(() => ({ detail: 'Unknown server error' })); // Try to parse error JSON
            throw new Error(`Server error: ${response.status} ${response.statusText}. ${errorData.detail || ''}`);
        }

        // Get the report data from the JSON response
        const data = await response.json();

        if (data && data.report !== undefined) {
            // Store the raw report text for download
            window.generatedReport = data.report;
            // Display the report in the preview div, converting newlines to <br> for HTML
            reportPreview.innerHTML = data.report.replace(/\n/g, '<br>');
            alert('Report generated successfully!');
        } else {
            throw new Error('Invalid response format from server.');
        }

    } catch (error) {
        console.error('Error generating report:', error);
        reportPreview.innerHTML = `Error generating report: ${error.message}`;
        alert(`Failed to generate report: ${error.message}`);
    } finally {
        // Re-enable button and reset text
        generateButton.textContent = 'Generate Report';
        generateButton.disabled = false;
    }
});

document.getElementById('downloadButton').addEventListener('click', function() {
    // Use the stored raw report content
    const reportContent = window.generatedReport;

    if (!reportContent) {
        alert('No report generated yet or generation failed. Please generate the report first.');
        return;
    }

    // Create a Blob from the raw text content
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element for download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch_report.txt'; // Set the desired filename
    document.body.appendChild(a); // Append to body to ensure click works in all browsers
    a.click(); // Simulate click to trigger download

    // Clean up: remove the temporary anchor and revoke the URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Report download initiated.');
});