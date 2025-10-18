
import React, { useCallback, useRef } from 'react';

interface ImageUploaderProps {
    onImageSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onImageSelect(file);
        }
    }, [onImageSelect]);


    return (
        <div className="w-full max-w-2xl">
            <label
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="w-full flex flex-col items-center justify-center p-12 border-4 border-dashed border-gray-700 rounded-xl cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
            >
                <div className="text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8L22.05 2.05a2 2 0 00-2.83 0L14 8h14zM8 44h32a4 4 0 004-4V24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 28v12a4 4 0 004 4h24m-12-28v16m-8-8h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-4 text-lg font-semibold text-gray-300">
                        Click to upload or drag and drop
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB
                    </p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleFileChange}
                />
            </label>
        </div>
    );
};

export default ImageUploader;
