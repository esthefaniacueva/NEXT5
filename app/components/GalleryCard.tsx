'use strict';

import { Edit, Trash2 } from 'lucide-react';
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
      <img 
        src={image.image_url} 
        alt={image.title}
        className="w-full h-full object-contain group-hover:scale-105 active:scale-[2.5] active:z-50 active:fixed active:top-1/2 active:left-1/2 active:-translate-x-1/2 active:-translate-y-1/2 active:rounded-xl active:shadow-2xl transition-all duration-300 cursor-zoom-in"
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
  );
}