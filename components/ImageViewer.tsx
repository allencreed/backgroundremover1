
import React from 'react';

interface ImageViewerProps {
    title: string;
    imageUrl: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ title, imageUrl }) => {
    return (
        <div className="w-full flex flex-col items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-300">{title}</h3>
            <div className="w-full h-auto aspect-square flex items-center justify-center overflow-hidden rounded-md bg-dots-pattern">
                <img
                    src={imageUrl}
                    alt={title}
                    className="max-w-full max-h-full object-contain"
                />
            </div>
             <style>{`
                .bg-dots-pattern {
                    background-image: radial-gradient(#4a5568 1px, transparent 1px);
                    background-size: 16px 16px;
                }
            `}</style>
        </div>
    );
};

export default ImageViewer;
