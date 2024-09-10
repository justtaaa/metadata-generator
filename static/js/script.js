const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const cancelButton = document.getElementById('cancelButton');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const status = document.getElementById('status');
const metadataSection = document.getElementById('metadataSection');
const metadataTextarea = document.getElementById('metadataTextarea');
const saveChangesButton = document.getElementById('saveChangesButton');
const downloadJsonButton = document.getElementById('downloadJsonButton');
const saveStatus = document.getElementById('saveStatus');
const processedFilesList = document.getElementById('processedFilesList');
const spinner = document.getElementById('spinner');
const filePreview = document.getElementById('filePreview');
let selectedFile;
let currentJsonFilePath;

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

metadataTextarea.addEventListener('input', function() {
    autoResizeTextarea(metadataTextarea);
});

uploadArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (event) => {
    selectedFile = event.target.files[0];
    if (selectedFile) {
        fileName.textContent = `Selected File: ${selectedFile.name}`;
        fileInfo.style.display = 'block';

        // Clear previous preview
        filePreview.innerHTML = '';
        filePreview.style.display = 'block';

        const fileType = selectedFile.type;

        // Image preview
        if (fileType.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(selectedFile);
            img.style.maxWidth = '100%';
            filePreview.appendChild(img);

        // PDF preview
        } else if (fileType === 'application/pdf') {
            const iframe = document.createElement('iframe');
            iframe.src = URL.createObjectURL(selectedFile);
            iframe.width = '100%';
            iframe.height = '600px';
            filePreview.appendChild(iframe);

        // Text file preview
        } else if (fileType === 'text/plain') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const textPreview = document.createElement('pre');
                textPreview.textContent = e.target.result;
                filePreview.appendChild(textPreview);
            };
            reader.readAsText(selectedFile);

        // Unsupported file type
        } else {
            filePreview.textContent = 'File preview not supported for this file type.';
        }
    }
});
uploadButton.addEventListener('click', () => {
    if (selectedFile) {
        spinner.style.display = 'inline-block';

        const formData = new FormData();
        formData.append('textFile', selectedFile);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload', true);

        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progress.style.width = percentComplete + '%';
            }
        };

        xhr.onload = function() {
            if (xhr.status === 200) {
                status.textContent = 'Upload successful!';
                const response = JSON.parse(xhr.responseText);
                status.textContent += '\n' + response.message;

                if (response.processed_files) {
                    response.processed_files.forEach(file => addFileToList(file));
                } else {
                    addFileToList({
                        filename: response.metadata.title,
                        json_file_path: response.json_file_path
                    });
                }

                selectedFile = null;
                fileInput.value = '';
                fileInfo.style.display = 'none';
                progressBar.style.display = 'none';
                progress.style.width = '0%';
            } else {
                status.textContent = 'Upload failed!';
            }
            spinner.style.display = 'none';
        };

        xhr.send(formData);
    } else {
        status.textContent = 'No file selected!';
    }
});

cancelButton.addEventListener('click', () => {
    fileInput.value = '';
    fileInfo.style.display = 'none';
    progressBar.style.display = 'none';
    progress.style.width = '0%';
    status.textContent = '';
    metadataSection.style.display = 'none';
    processedFilesList.innerHTML = '';
});

saveChangesButton.addEventListener('click', () => {
    const modifiedMetadata = metadataTextarea.value;

    fetch('/update_json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            json_file_path: currentJsonFilePath,
            modified_metadata: JSON.parse(modifiedMetadata)
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            saveStatus.textContent = 'Error: ' + data.error;
        } else {
            saveStatus.textContent = data.message;
        }
    })
    .catch(error => {
        saveStatus.textContent = 'Error: ' + error;
    });
});

downloadJsonButton.addEventListener('click', () => {
    const downloadUrl = '/download_json?json_file_path=' + encodeURIComponent(currentJsonFilePath);
    window.location.href = downloadUrl;
});

function addFileToList(file) {
    const li = document.createElement('li');
    li.textContent = file.filename;

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('file-actions');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit JSON';
    editButton.onclick = function() {
        fetch('/json_outputs/' + file.json_file_path.split('/').pop())
            .then(res => res.json())
            .then(jsonData => {
                metadataTextarea.value = JSON.stringify(jsonData, null, 2);
                currentJsonFilePath = file.json_file_path;
                metadataSection.style.display = 'block';
                autoResizeTextarea(metadataTextarea);
            })
            .catch(error => console.error('Error:', error));
    };

    const downloadLink = document.createElement('a');
    downloadLink.href = '/download_json?json_file_path=' + encodeURIComponent(file.json_file_path);
    downloadLink.textContent = 'Download JSON';

    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(downloadLink);
    li.appendChild(actionsDiv);
    processedFilesList.appendChild(li);
}


// Add download all functionality
const downloadAllButton = document.getElementById('downloadAllButton');

downloadAllButton.addEventListener('click', () => {
    const downloadUrl = '/download_all';
    window.location.href = downloadUrl;  // Trigger the download of the ZIP file
});
