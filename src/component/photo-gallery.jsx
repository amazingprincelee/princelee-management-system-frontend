import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";

function PhotoGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'masonry'
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${baseUrl}/school-info/get-gallery`);
      setGallery(data.photoGallery || []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      setError("Failed to load gallery images. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          navigateImage(-1);
          break;
        case 'ArrowRight':
          navigateImage(1);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  const openModal = (url, index) => {
    setSelectedImage(url);
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedIndex(0);
  };

  const navigateImage = (direction) => {
    const newIndex = selectedIndex + direction;
    if (newIndex >= 0 && newIndex < gallery.length) {
      setSelectedIndex(newIndex);
      setSelectedImage(gallery[newIndex]);
    }
  };

  const handleImageLoad = (index) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  const handleImageError = (index) => {
    console.error(`Failed to load image at index ${index}`);
  };

  const ImageCard = ({ url, index, className = "" }) => (
    <div
      className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${className}`}
      onClick={() => openModal(url, index)}
      role="button"
      tabIndex={0}
      aria-label={`View image ${index + 1} in gallery`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(url, index);
        }
      }}
    >
      {/* Loading placeholder */}
      {!loadedImages.has(index) && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      )}
      
      <img
        src={url}
        alt={`Gallery image ${index + 1}`}
        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
          loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => handleImageLoad(index)}
        onError={() => handleImageError(index)}
        loading="lazy"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* View icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      </div>
      
      {/* Image number */}
      <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {index + 1}
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
       {[...Array(8)].map((_, i) => (
         <div
           key={i}
           className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse"
           style={{
             animationDelay: `${i * 100}ms`,
             animationDuration: '1.5s'
           }}
         />
       ))}
     </div>
   );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Images Available</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        The photo gallery is currently empty. Check back later for new images.
      </p>
      <button
        onClick={fetchGallery}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Refresh Gallery
      </button>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Gallery</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">{error}</p>
      <button
        onClick={fetchGallery}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="py-8 mx-auto max-w-screen-xl"> {/* Changed max-w-7xl to max-w-screen-xl */}
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Photo Gallery</h2>
            <p className="text-gray-600">
              {!loading && gallery.length > 0 && `${gallery.length} ${gallery.length === 1 ? 'image' : 'images'}`}
            </p>
          </div>
          
          {/* View mode toggle */}
          {gallery.length > 0 && (
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Grid view"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'masonry'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Masonry view"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState />
      ) : gallery.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={
           viewMode === 'grid'
             ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
             : "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 space-y-8"
         }>
           {gallery.map((url, index) => (
             <ImageCard
               key={index}
               url={url}
               index={index}
               className={
                 viewMode === 'grid'
                   ? "h-80"
                   : "break-inside-avoid mb-8"
               }
             />
           ))}
         </div>
      )}

      {/* Enhanced Modal */}
      {selectedImage && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === modalRef.current) closeModal();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Navigation buttons */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage(-1)}
                  disabled={selectedIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => navigateImage(1)}
                  disabled={selectedIndex === gallery.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-200"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image counter */}
            {gallery.length > 1 && (
              <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                {selectedIndex + 1} / {gallery.length}
              </div>
            )}

            {/* Main image */}
            <img
              src={selectedImage}
              alt={`Gallery image ${selectedIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;