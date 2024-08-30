# metadata-generator

# Metadata Extraction Tool

This project is a web-based tool for extracting and processing metadata from various file types, including text files, PowerPoint presentations, PDFs, Excel spreadsheets, and images. It provides a simple user interface for uploading files, editing extracted metadata, and downloading the metadata as JSON files.

## Features

- **File Upload and Processing**: Users can upload a single file or a zip archive containing multiple files. The tool extracts content from the supported file types and generates corresponding metadata.
- **Supported File Types**:
  - Text files (`.txt`)
  - PowerPoint presentations (`.pptx`)
  - PDF documents (`.pdf`)
  - Excel spreadsheets (`.xlsx`)
  - Image files (`.png`, `.jpg`, `.jpeg`, `.bmp`, `.tiff`, `.gif`)
  - Zip archives (`.zip`)
- **Metadata Extraction**: The tool extracts and processes metadata such as title, creator, subject areas, description, publisher, date, type, format, unique identifier, and keywords.
- **NLP Integration**: Uses SpaCy and other NLP techniques to extract keywords and generate summaries from the content.
- **Image Metadata Extraction**: Extracts text from images using OCR and retrieves EXIF metadata.
- **User Interface**: A simple, intuitive UI for uploading files, viewing, editing metadata, and downloading JSON files.

## Installation

To run the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/metadata-extraction-tool.git
   cd metadata-extraction-tool
