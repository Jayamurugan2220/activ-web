import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn,
  Heart,
  Share2
} from "lucide-react";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  onFavorite?: () => void;
  favorited?: boolean;
  onShare?: () => void;
}

const ProductImageGallery = ({ 
  images, 
  productName,
  onFavorite,
  favorited,
  onShare
}: ProductImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleZoom = () => {
    setZoomed(!zoomed);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
        <img 
          src={images[currentIndex]?.url || "/placeholder.svg"} 
          alt={images[currentIndex]?.alt || productName}
          className={`w-full h-full object-contain ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
          onClick={toggleZoom}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}
        
        {/* Zoom Indicator */}
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute bottom-2 right-2 bg-black/30 hover:bg-black/50 text-white"
          onClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
        >
          <ZoomIn className={`w-5 h-5 ${zoomed ? "fill-white" : ""}`} />
        </Button>
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          {onFavorite && (
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
            >
              <Heart className={`w-5 h-5 ${favorited ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          )}
          
          {onShare && (
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
            >
              <Share2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                currentIndex === index ? "border-primary" : "border-transparent"
              }`}
              onClick={() => goToImage(index)}
            >
              <img 
                src={image.url} 
                alt={image.alt || productName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;