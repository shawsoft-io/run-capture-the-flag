import React, { useState } from "react";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  skeletonClass?: string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  className = "w-full h-full object-cover",
  skeletonClass = "bg-gray-200 animate-pulse",
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">

      {!loaded && 
        <div className={`absolute inset-0 ${skeletonClass} flex items-center rounded-lg`}>
          <svg className="w-16 h-16 text-gray-100 mx-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
          </svg>
        </div>
      }

      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default ImageWithSkeleton;