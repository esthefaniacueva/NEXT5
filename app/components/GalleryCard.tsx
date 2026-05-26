'use strict';

import { useState } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import { Image } from '@/types';
import { motion } from 'framer-motion';

interface GalleryCardProps {
  image: Image;
  onEdit: (image: Image) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function GalleryCard({ image, onEdit, onDelete, isDeleting }: GalleryCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="group relative w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
        
        {/* CONTENEDOR DE LA IMAGEN */}
        <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden">
        <img 
          src={image.image_url} 
          alt={image.title}
          onClick={() => setIsModalOpen(true)}
          className="w-full h-full object-contain group-hover:scale-105 transition-all duration-300 cursor-zoom-in"
        />

        {/* CONTENEDOR FLOTANTE PARA LOS BOTONES (Aparece solo en HOVER) */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-start justify-end p-3 gap-2">
          {/* BOTÓN EDITAR */}
          <button
            onClick={() => onEdit(image)}
            className="p-2 rounded-xl bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white hover:scale-105 transition-all shadow-sm"
            title="Editar"
          >
            <Edit size={16} />
          </button>

          {/* BOTÓN BORRAR */}
          <button
            onClick={() => onDelete(image.id)}
            disabled={isDeleting}
            className="p-2 rounded-xl bg-white/90 backdrop-blur-sm text-red-600 hover:bg-white hover:scale-105 transition-all shadow-sm disabled:opacity-50"
            title="Eliminar"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>

      {/* TEXTOS DEBAJO DE LA IMAGEN */}
      <div className="p-4 bg-white">
        <h3 className="text-base font-bold text-gray-900 truncate leading-snug">
          {image.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[40px] leading-relaxed">
          {image.description || 'Sin descripción'}
        </p>
      </div>
    </div>

    {/* MODAL PARA VER IMAGEN COMPLETA */}
    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* FONDO OSCURECIDO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />
        
        {/* MODAL CON LA IMAGEN */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative z-10 max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* HEADER DEL MODAL */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">{image.title}</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* CONTENEDOR DE LA IMAGEN */}
          <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-50 p-6">
            <img
              src={image.image_url}
              alt={image.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* DESCRIPCIÓN */}
          {image.description && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <p className="text-sm text-gray-600">{image.description}</p>
            </div>
          )}
        </motion.div>
      </div>
    )}
    </>
  );
}