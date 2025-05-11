import { X } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ImagePreviewModal({ imageUrl, onClose }: ImagePreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
        <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="overflow-hidden flex justify-center">
          <Zoom>
            <img src={imageUrl} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain" />
          </Zoom>
        </div>
      </div>
    </div>
  );
}
