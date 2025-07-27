// script.js

// Ensure PDFLib, JSZip, and FileSaver are loaded from CDNs in index.html
// These will be available in the global scope.
const { PDFDocument } = PDFLib; // pdf-lib is loaded globally as PDFLib
// JSZip is loaded globally as JSZip
// saveAs is from FileSaver.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Helper Functions ---
    function showStatus(elementId, message, type = 'info') {
        const el = document.getElementById(elementId);
        el.textContent = message;
        el.className = 'status-message'; // Reset classes
        if (type === 'success') el.classList.add('status-success');
        else if (type === 'error') el.classList.add('status-error');
        else el.classList.add('status-info');
        el.classList.remove('hidden');
    }


    function toggleButtonLoading(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        const textEl = button.querySelector('.btn-text');
        const spinnerEl = button.querySelector('.spinner');

        if (isLoading) {
            button.disabled = true;
            textEl.classList.add('hidden');
            spinnerEl.classList.remove('hidden');
        } else {
            button.disabled = false;
            textEl.classList.remove('hidden');
            spinnerEl.classList.add('hidden');
        }
    }

    async function readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    // --- Merge PDFs ---
    const mergeBtn = document.getElementById('merge-btn');
    if (mergeBtn) {
        mergeBtn.addEventListener('click', async () => {
            const filesInput = document.getElementById('merge-files');
            const files = Array.from(filesInput.files);
            const statusEl = 'merge-status';
            const buttonId = 'merge-btn';

            if (files.length < 2) return alert('Please select at least two PDF files to merge.');

            toggleButtonLoading(buttonId, true);
            showStatus(statusEl, 'Merging PDFs...', 'info');

            try {
                const fileList = files.map((file,index) => `${index}: ${file.name}`).join('\n')
                const input = prompt(fileList) || "0"
                const indices = input.split(" ").map(str => parseInt(str,10));
                for (let i = 0; i < files.length; i++)
                    if (!indices.includes(i)) 
                        indices.push(i)
                const orderedFiles = []
                for (let i = 0; i < files.length; i++)
                    orderedFiles.push(files[indices[i]])
                

                const mergedPdf = await PDFDocument.create();
                for (const file of orderedFiles) {
                    if (file.type !== "application/pdf") {
                        showStatus(statusEl, `Skipping non-PDF file: ${file.name}`, 'info');
                        continue;
                    }
                    const pdfBytes = await readFileAsArrayBuffer(file);
                    // ignoreEncryption: true allows loading PDFs with owner passwords (restrictions)
                    // but not user passwords (for opening).
                    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
                    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                    copiedPages.forEach(page => mergedPdf.addPage(page));
                    showStatus(statusEl, `Processed ${file.name}...`, 'info');
                }

                const mergedPdfBytes = await mergedPdf.save();
                saveAs(new Blob([mergedPdfBytes], { type: 'application/pdf' }), 'merged.pdf');
                showStatus(statusEl, 'PDFs merged successfully! Download started.', 'success');
                if (filesInput) filesInput.value = ''; // Clear file input
            } finally {
                toggleButtonLoading(buttonId, false);
            }
        });
    } 


    // --- Split PDF ---
    const splitBtn = document.getElementById('split-btn');
    if (splitBtn) {
        splitBtn.addEventListener('click', async () => {
            const filesInput = document.getElementById('split-files');
            const files = filesInput.files;
            const statusEl = 'split-status';
            const buttonId = 'split-btn';

            if (files.length === 0) return

            toggleButtonLoading(buttonId, true);
            showStatus(statusEl, 'Splitting PDFs...', 'info');

            try {
                const zip = new JSZip();
                let pagesProcessed = 0;

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file.type !== "application/pdf") {
                        showStatus(statusEl, `Skipping non-PDF file: ${file.name}`, 'info');
                        continue;
                    }
                    showStatus(statusEl, `Processing ${file.name}...`, 'info');
                    const pdfBytes = await readFileAsArrayBuffer(file);
                    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
                    
                    const baseFileName = file.name.replace(/\.pdf$/i, '');

                    for (let j = 0; j < pdfDoc.getPageCount(); j++) {
                        const newPdf = await PDFDocument.create();
                        const [copiedPage] = await newPdf.copyPages(pdfDoc, [j]);
                        newPdf.addPage(copiedPage);
                        const newPdfBytes = await newPdf.save();
                        zip.file(`${baseFileName}_page_${j + 1}.pdf`, newPdfBytes);
                        pagesProcessed++;
                    }
                }
                
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                saveAs(zipBlob, 'split_pages.zip');
                showStatus(statusEl, 'PDFs split successfully! ZIP download started.', 'success'); 
                if (filesInput) filesInput.value = '';
            } finally {
                toggleButtonLoading(buttonId, false);
            }
        });
    } 


});
