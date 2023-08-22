import React from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';

interface ImagePreviewProps {
    file: File;
    index: number;
    moveImage: (index: number, direction: 'up' | 'down') => void;
    handleImageDelete: (index: number) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ file, index, moveImage, handleImageDelete }) => {
    return (
        <div className="image-preview">
            <img src={URL.createObjectURL(file)} alt={`Selected Preview ${index}`} />
            <div className="image-controls">
                <IconButton onClick={() => moveImage(index, 'up')}>
                    <ArrowUpwardIcon />
                </IconButton>
                <IconButton onClick={() => moveImage(index, 'down')}>
                    <ArrowDownwardIcon />
                </IconButton>
                <IconButton onClick={() => handleImageDelete(index)}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    );
}
