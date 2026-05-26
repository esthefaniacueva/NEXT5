'use client';

import { useState, useRef } from 'react';
import { Image } from '@/types';

interface ImageFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    file?: File;
  }) => Promise<void>;
  initialData?: Image;
  isLoading: boolean;
}

export function ImageForm({ onSubmit, initialData, isLoading }: ImageFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialData?.image_url || '');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      description,
      file: file || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* CONTENEDOR DRAG & DROP / SELECCIÓN DE IMAGEN */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Imagen
        </label>
        
        {/* Input real pero oculto */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          required={!initialData}
          className="hidden"
        />

        {/* Caja interactiva idéntica a la imagen del docente */}
        <div 
          onClick={handleContainerClick}
          className="border-2 border-dashed border-blue-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/30 transition-colors bg-gray-50/50 min-h-[160px] relative overflow-hidden"
        >
          {preview ? (
            <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                Cambiar imagen
              </div>
            </div>
          ) : (
            <>
              <div className="text-gray-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600">Haz clic para subir imagen</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP (máx. 5MB)</p>
            </>
          )}
        </div>
      </div>

      {/* CAMPO TÍTULO */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Título de la imagen"
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* CAMPO DESCRIPCIÓN */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          placeholder="Descripción opcional"
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 resize-none"
        />
      </div>

      {/* BOTÓN SUBMIT COMPLETAMENTE AZUL PLANO */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2 mt-2 disabled:bg-gray-300"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : initialData ? (
          'Actualizar Datos'
        ) : (
          'Crear imagen'
        )}
      </button>
    </form>
  );
}