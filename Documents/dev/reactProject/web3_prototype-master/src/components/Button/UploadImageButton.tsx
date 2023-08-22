import React, { useState, useRef, ChangeEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import './UploadImageButton.scss';
import { ImagePreview } from './ImagePreview';

interface Props {
  onFilesSelected: (files: File[]) => void;
}

export const UploadImageButton: React.FC<Props> = ({ onFilesSelected }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length + selectedFiles.length <= 10) {
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
      onFilesSelected([...selectedFiles, ...files]); // 修正: すべての選択されたファイルを渡す
    } else {
      console.warn('You can only upload up to 10 images.');
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...selectedFiles];
    if (direction === 'up' && index > 0) {
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    } else if (direction === 'down' && index < newFiles.length - 1) {
      [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
    }
    setSelectedFiles(newFiles);
  };

  const handleImageDelete = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="app">
      <div className="file-upload">
        {selectedFiles.map((file, index) => (
          <ImagePreview
            key={index}
            file={file}
            index={index}
            moveImage={moveImage}
            handleImageDelete={handleImageDelete}
          />
        ))}
        <div className="upload-controls">
          <IconButton onClick={triggerFileInput}>
            <AddPhotoAlternateIcon />
          </IconButton>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            multiple
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
