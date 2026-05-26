'use strict';

import { Edit, Trash2, Maximize2 } from 'lucide-react';
import { Image } from '@/types';

interface GalleryCardProps {
  image: Image;
  onEdit: (image: Image) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function GalleryCard({ image, onEdit, onDelete, isDeleting }: GalleryCardProps) {
  return (
    <div className="group relative w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
      
      {/* CONTENEDOR DE LA IMAGEN */}
      <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden">
        
        {/* Imagen clickable para ver original */}
        <div 
          onClick={() => window.open(image.image_url, '_blank')}
          className="w-full h-full cursor-pointer group/image"
          title="Haz clic para ver imagen original"
        >
          <img 
            src={image.image_url} 
            alt={image.title}
            className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-300"
          />
          {/* Lupa indicativa que aparece al pasar el mouse */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="text-white drop-shadow-md" size={32} />
          </div>
        </div>

        {/* CONTENEDOR FLOTANTE PARA LOS BOTONES (Aparece solo en HOVER) */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
  );
}