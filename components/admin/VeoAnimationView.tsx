
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MovieIcon } from '../icons';

interface VeoAnimationViewProps {}

const VeoAnimationView: React.FC<VeoAnimationViewProps> = () => {
    const [image, setImage] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState<string>('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const result = event.target.result as string;
                    setImage(result);
                    // Extract base64 data (remove "data:image/jpeg;base64," part)
                    const base64 = result.split(',')[1];
                    setImageBase64(base64);
                    setGeneratedVideoUrl(null); // Reset video if new image uploaded
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const checkApiKey = async () => {
        const win = window as any;
        if (win.aistudio && win.aistudio.hasSelectedApiKey) {
            const hasKey = await win.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                await win.aistudio.openSelectKey();
                return await win.aistudio.hasSelectedApiKey();
            }
            return true;
        }
        return true; // Fallback if window.aistudio not present (development or different env)
    };

    const handleGenerate = async () => {
        if (!imageBase64) return;

        setLoading(true);
        setProgress('Iniciando geração...');
        setGeneratedVideoUrl(null);

        try {
            const hasKey = await checkApiKey();
            if (!hasKey) {
                setLoading(false);
                setProgress('API Key não selecionada.');
                return;
            }

            // Initialize AI client with the selected API Key
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            setProgress('Enviando solicitação para Veo...');
            
            // Call generateVideos with model, prompt, image, and config
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt || 'Animate this image naturally', // Default prompt if empty
                image: {
                    imageBytes: imageBase64,
                    mimeType: 'image/jpeg', // Assuming JPEG for simplicity, or could detect from file
                },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p', // Required for fast-generate-preview
                    aspectRatio: aspectRatio,
                }
            });

            setProgress('Processando vídeo (isso pode levar alguns minutos)...');

            // Polling loop
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
                operation = await ai.operations.getVideosOperation({ operation: operation });
                setProgress('Ainda processando...');
            }

            if (operation.response?.generatedVideos?.[0]?.video?.uri) {
                const downloadLink = operation.response.generatedVideos[0].video.uri;
                setProgress('Vídeo pronto! Baixando...');
                
                // Fetch the video blob using the URI and API Key
                const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const blob = await videoResponse.blob();
                const videoUrl = URL.createObjectURL(blob);
                
                setGeneratedVideoUrl(videoUrl);
                setProgress('');
            } else {
                throw new Error("Não foi possível recuperar a URI do vídeo gerado.");
            }

        } catch (error: any) {
            console.error('Erro na geração:', error);
            // Handle "Requested entity was not found" specifically for API Key race conditions
            if (error.message && error.message.includes("Requested entity was not found")) {
                setProgress('Erro de autenticação. Por favor, selecione a chave novamente.');
                 const win = window as any;
                 if (win.aistudio && win.aistudio.openSelectKey) {
                    await win.aistudio.openSelectKey();
                 }
            } else {
                setProgress(`Erro: ${error.message || 'Falha desconhecida'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <MovieIcon className="h-8 w-8 text-brand-red" />
                        Animação com Veo
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Transforme suas fotos em vídeos incríveis usando a inteligência artificial do Google Veo.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Controls */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6 h-fit">
                        
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                1. Escolha uma imagem
                            </label>
                            <div 
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${image ? 'border-brand-green bg-green-50' : 'border-gray-300 hover:border-brand-red hover:bg-gray-50'}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleImageUpload} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                                {image ? (
                                    <div className="text-green-700 font-medium flex flex-col items-center">
                                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Imagem selecionada! Clique para trocar.
                                    </div>
                                ) : (
                                    <div className="text-gray-500">
                                        <p className="font-medium">Clique para fazer upload</p>
                                        <p className="text-xs mt-1">JPG ou PNG</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Prompt Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                2. Descreva a animação (Prompt)
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ex: Câmera se aproximando lentamente, fumaça subindo da pizza..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none resize-none h-24"
                            />
                        </div>

                        {/* Aspect Ratio */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                3. Formato do Vídeo
                            </label>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setAspectRatio('16:9')}
                                    className={`flex-1 py-3 rounded-lg border font-medium transition-all ${aspectRatio === '16:9' ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                >
                                    Paisagem (16:9)
                                </button>
                                <button
                                    onClick={() => setAspectRatio('9:16')}
                                    className={`flex-1 py-3 rounded-lg border font-medium transition-all ${aspectRatio === '9:16' ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                >
                                    Retrato (9:16)
                                </button>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={!image || loading}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform ${
                                !image || loading 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-brand-red text-white hover:bg-red-700 hover:shadow-xl hover:-translate-y-1'
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Gerando...
                                </span>
                            ) : 'Gerar Vídeo'}
                        </button>
                        
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <p className="text-xs text-blue-700 text-center">
                                Nota: A geração de vídeo pode levar alguns minutos. O modelo utilizado é o <strong>veo-3.1-fast-generate-preview</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Preview */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[400px] bg-grid-pattern relative overflow-hidden">
                        
                        {/* Placeholder / Preview Logic */}
                        {!image && !loading && !generatedVideoUrl && (
                            <div className="text-center text-gray-400">
                                <MovieIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                <p>O preview aparecerá aqui</p>
                            </div>
                        )}

                        {/* Image Preview (Before Generation) */}
                        {image && !generatedVideoUrl && !loading && (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img 
                                    src={image} 
                                    alt="Preview" 
                                    className="max-w-full max-h-[400px] rounded-lg shadow-md object-contain" 
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                                    <p className="text-white font-bold">Imagem Original</p>
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center z-10 p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg max-w-sm">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
                                <h3 className="font-bold text-gray-800 text-lg mb-2">Criando Mágica ✨</h3>
                                <p className="text-gray-600 text-sm">{progress}</p>
                            </div>
                        )}

                        {/* Generated Video */}
                        {generatedVideoUrl && (
                            <div className="w-full h-full flex flex-col items-center">
                                <h3 className="text-green-600 font-bold mb-4 flex items-center gap-2">
                                    <span className="bg-green-100 p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span>
                                    Vídeo Gerado com Sucesso!
                                </h3>
                                <video 
                                    controls 
                                    autoPlay 
                                    loop 
                                    className="max-w-full max-h-[400px] rounded-lg shadow-xl border-4 border-white"
                                    src={generatedVideoUrl}
                                >
                                    Seu navegador não suporta a tag de vídeo.
                                </video>
                                <a 
                                    href={generatedVideoUrl} 
                                    download="veo-animation.mp4"
                                    className="mt-6 text-brand-red font-semibold hover:underline flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    Baixar Vídeo
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VeoAnimationView;
