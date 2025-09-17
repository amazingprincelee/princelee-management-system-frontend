import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";

function PhotoGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  async function fetchGallery() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseUrl}/school-info/get-gallery`);
      setGallery(data.photoGallery || []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
     

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-full h-48 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : gallery.length === 0 ? (
        <p className="text-center text-gray-500">No images available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {gallery.map((url, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => setSelectedImage(url)}
            >
              <img
                src={url}
                alt={`Gallery ${index}`}
                className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[80vh]">
            <img
              src={selectedImage}
              alt="Preview"
              className="object-contain w-full h-full rounded-lg"
            />
            <button
              className="absolute px-3 py-1 text-white bg-red-500 rounded-full top-2 right-2"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;
