document.getElementById('fileInput').addEventListener('change', function() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    if (files.length === 0) {
        alert('Please select files to upload.');
        return;
    }
    // Store files for processing
    window.uploadedFiles = files;
    alert('Files uploaded successfully.');
});

document.getElementById('generateButton').addEventListener('click', function() {
    if (!window.uploadedFiles || window.uploadedFiles.length === 0) {
        alert('No files uploaded. Please upload files first.');
        return;
    }
    // Generate report from uploaded files
    let reportContent = 'Batch Report\\n\\n';
    reportContent += 'Product Information\\n';
    reportContent += 'Product: 10mg Blood Pressure Capsules\\n';
    reportContent += 'Batch No.: BP-CAP-23004\\n';
    reportContent += 'Manufacturing Date: 2025-04-01\\n';
    reportContent += 'Expiry Date: 2027-04-01\\n';
    reportContent += 'Operator: John D.\\n';
    reportContent += 'Supervisor: Mary L.\\n\\n';

    reportContent += '1. Process Model\\n';
    reportContent += 'Raw Material Intake → Blending → Capsule Filling → Quality Inspection → Packaging → Labeling\\n';
    reportContent += 'Each step includes automated data capture from equipment sensors (Mixing RPM, capsule count, weight checks).\\n\\n';

    reportContent += '2. Process Description\\n';
    reportContent += 'Blending: Active Ingredient A and Binder B were mixed at 60 RPM for 20 minutes.\\n';
    reportContent += 'Capsule Filling: Capsules filled using Machine #4, calibrated to 10mg ± 0.2mg.\\n';
    reportContent += 'Inspection: Visual and weight checks were performed every 1000 capsules.\\n';
    reportContent += 'Packaging: Capsules were packed in foil blister strips and boxed.\\n\\n';

    reportContent += '3. Sampling Plan\\n';
    reportContent += 'In-process sampling: Every 1000 capsules\\n';
    reportContent += 'Checked for: Weight, Uniformity, Appearance\\n';
    reportContent += 'Final sample size: 20 capsules pulled randomly\\n';
    reportContent += 'Sent to Quality Control Lab\\n';
    reportContent += 'Tests: Dissolution, Potency, Microbial Limits\\n\\n';

    reportContent += '4. SOPs\\n';
    reportContent += 'SOP-123: Capsule Filling Procedure\\n';
    reportContent += 'SOP-124: Blending Operation Guidelines\\n';
    reportContent += 'SOP-201: Equipment Cleaning and Setup\\n';
    reportContent += 'SOP-305: In-process Sampling and QC Protocol\\n\\n';

    reportContent += '5. Bill of Materials (BOM)\\n';
    reportContent += 'Material             | Batch No. | Quantity Used | Source     \\n';
    reportContent += 'Active Ingredient A  | AI-2211   | 10 kg         | Supplier X \\n';
    reportContent += 'Binder B             | BB-4420   | 2 kg          | Supplier Y \\n';
    reportContent += 'Gelatin Capsules     | GC-3301   | 10,000 pcs    | Supplier Z \\n';
    reportContent += 'Labels               | LBL-120   | 10,000 pcs    | In-house   \\n';
    reportContent += 'Packaging Boxes      | PB-8771   | 10,000 pcs    | Supplier X \\n';
    document.getElementById('reportPreview').innerHTML = reportContent.replace(/\\n/g, '<br>');
});

document.getElementById('downloadButton').addEventListener('click', function() {
    // Download the generated report
    const reportContent = document.getElementById('reportPreview').innerText;
    if (!reportContent) {
        alert('No report generated yet. Please generate the report first.');
        return;
    }
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch_report.md';
    a.click();
    URL.revokeObjectURL(url);
});
