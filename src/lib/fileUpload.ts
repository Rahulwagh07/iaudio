import { ACCEPTED_TYPES } from "./constant";

interface FileUploadResult {
  files: File[];
}

interface FileUploadOptions {
  maxFiles?: number;
  acceptedTypes?: string[];
}

export const handleFileUpload = (
  fileList: FileList,
  options: FileUploadOptions = {}
): FileUploadResult => {
  const { maxFiles = 4, acceptedTypes = ACCEPTED_TYPES } = options;
  
  const files = Array.from(fileList)
    .filter(file => 
      acceptedTypes.some(type => file.name.toLowerCase().endsWith(type))
    )
    .slice(0, maxFiles);

  return { files };
};

export const createFileInput = (
  onFileSelect: (files: File[]) => void,
  options: FileUploadOptions = {}
) => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ACCEPTED_TYPES.join(",");
  fileInput.multiple = true;
  
  fileInput.onchange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      const { files: processedFiles } = handleFileUpload(files, options);
      onFileSelect(processedFiles);
    }
  };
  
  return fileInput;
}; 