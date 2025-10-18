
import React, { useState, useCallback } from 'react';
import { removeImageBackground } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import Loader from './components/Loader';

const App: React.FC = () => {
    const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
    const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = useCallback((file: File) => {
        setOriginalImageFile(file);
        setProcessedImage(null);
        setError(null);
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setOriginalImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleRemoveBackground = useCallback(async () => {
        if (!originalImageFile || !originalImagePreview) return;

        setIsLoading(true);
        setError(null);
        setProcessedImage(null);

        try {
            const base64Image = originalImagePreview.split(',')[1];
            if (!base64Image) {
                throw new Error("Could not extract base64 data from image preview.");
            }

            const resultDataUrl = await removeImageBackground(base64Image, originalImageFile.type);
            setProcessedImage(resultDataUrl);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during processing.";
            setError(`Error: ${errorMessage}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [originalImageFile, originalImagePreview]);

    const resetState = useCallback(() => {
        setOriginalImageFile(null);
        setOriginalImagePreview(null);
        setProcessedImage(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
            <header className="w-full max-w-6xl text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                    AI Background Remover
                </h1>
                <p className="text-gray-400 mt-2 text-lg">
                    Powered by Gemini - Upload an image and watch the magic happen.
                </p>
            </header>

            <main className="w-full max-w-6xl flex flex-col items-center gap-8">
                {!originalImagePreview ? (
                    <ImageUploader onImageSelect={handleImageUpload} />
                ) : (
                    <>
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ImageViewer title="Original Image" imageUrl={originalImagePreview} />
                            <div className="w-full h-full bg-gray-800 rounded-lg shadow-lg flex items-center justify-center border-2 border-dashed border-gray-700 min-h-[300px]">
                                {isLoading ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader />
                                        <p className="text-gray-400">Removing background...</p>
                                    </div>
                                ) : processedImage ? (
                                    <ImageViewer title="Background Removed" imageUrl={processedImage} />
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <p>Processed image will appear here.</p>
                                        {error && <p className="text-red-400 mt-2">{error}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full flex flex-wrap justify-center gap-4 mt-4">
                            <Button 
                                onClick={handleRemoveBackground} 
                                disabled={isLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Processing...' : 'Remove Background'}
                            </Button>

                            {processedImage && (
                                <a
                                    href={processedImage}
                                    download="background-removed.png"
                                    className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 ease-in-out text-center"
                                >
                                    Download Image
                                </a>
                            )}
                            <Button onClick={resetState} className="bg-gray-600 hover:bg-gray-700">
                                Start Over
                            </Button>
                        </div>
                         {error && !isLoading && <p className="text-red-400 text-center mt-4">{error}</p>}
                    </>
                )}
            </main>
            <footer className="w-full max-w-6xl text-center text-gray-500 mt-12 text-sm">
                <p>&copy; {new Date().getFullYear()} AI Background Remover. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
