'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import { Modal } from './components/Modal';
import { ImageForm } from './components/ImageForm';
import { GalleryCard } from './components/GalleryCard';

import { Image } from '@/types';

export default function Home() {
  const [images, setImages] = useState<Image[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, [searchTerm]);

  async function fetchImages() {
    try {
      setIsFetching(true);
      const url = new URL('/api/images', window.location.origin);
      if (searchTerm) {
        url.searchParams.set('search', searchTerm);
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      toast.error('Error al cargar imágenes');
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  }

  async function handleCreateOrUpdate(formData: {
    title: string;
    description: string;
    file?: File;
  }) {
    try {
      setIsLoading(true);
      const data = new FormData();
      data.set('title', formData.title);
      data.set('description', formData.description);

      if (formData.file) {
        data.set('file', formData.file);
      }

      const url = selectedImage ? `/api/images/${selectedImage.id}` : '/api/images';
      const response = await fetch(url, {
        method: selectedImage ? 'PATCH' : 'POST',
        body: data,
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMsg = `Error ${response.status}`;
        try {
          const errorJson = JSON.parse(responseText);
          errorMsg = errorJson.error || errorMsg;
        } catch (e) {
          errorMsg = responseText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      toast.success(selectedImage ? 'Imagen actualizada!' : 'Imagen creada!');
      setIsModalOpen(false);
      setSelectedImage(null);
      await fetchImages();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al guardar imagen';
      toast.error(msg);
      console.error('[DEBUG]', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      const response = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete image');
      toast.success('Imagen eliminada!');
      await fetchImages();
    } catch (error) {
      toast.error('Error al eliminar imagen');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  }

  const handleEditClick = (image: Image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-white w-full">
      {/* HEADER PRINCIPAL CON DISTRIBUCIÓN FLEX REFORZADA */}
      <header className="w-full border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">
          
          {/* IDENTIFICADOR IZQUIERDO */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#2563eb" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H2.25A1.5 1.5 0 00.75 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="text-xl font-bold text-gray-900 tracking-tight select-none">Galería</span>
          </div>

          {/* ELEMENTOS DE ACCIÓN DERECHOS CONTENIDOS */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* BUSCADOR CON LUPA INTERNA */}
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 h-10 border border-gray-200 rounded-xl pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* BOTÓN AÑADIR CON FORMATO EXACTO */}
            <button
              onClick={() => {
                setSelectedImage(null);
                setIsModalOpen(true);
              }}
              className="h-10 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus size={15} strokeWidth={2.5} />
              Añadir
            </button>
          </div>
        </div>
      </header>

      {/* CONTENEDOR CENTRAL DEL GRID CON MÁXIMO ANCHO DE PÁGINA */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        {isFetching ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : images.length === 0 ? (
          
          /* CASO TOTALMENTE VACÍO */
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="text-gray-300 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H2.25A1.5 1.5 0 00.75 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">Galería vacía</h2>
            <p className="text-sm text-gray-400 mb-6">Comienza añadiendo imágenes a tu galería</p>
            <button
              onClick={() => {
                setSelectedImage(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl inline-flex items-center gap-2 transition-colors text-sm shadow-sm"
            >
              <Plus size={16} />
              Añadir primera imagen
            </button>
          </div>
        ) : (
          /* GRID DE 4 COLUMNAS CORREGIDO CON ESPACIADO PROPORCIONAL */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {images.map((image) => (
              <div key={image.id} className="w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <GalleryCard
                  image={image}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  isDeleting={deletingId === image.id}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ELEMENTO MODAL INYECTADO */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedImage ? 'Editar imagen' : 'Nueva imagen'}
      >
      <ImageForm
          onSubmit={handleCreateOrUpdate}
          initialData={selectedImage || undefined}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}