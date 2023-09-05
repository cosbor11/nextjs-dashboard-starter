import React, { useEffect, useState } from 'react';
import { Img } from 'react-image';
import "tailwindcss/tailwind.css";

interface Props {
  className: string;
  src: string;
  onImageChange: (url: string) => void;
}

const RandomLlamaImage: React.FC<Props> = ({ className, src, onImageChange }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (src) {
      onImageChange(src);
      setLoading(false);
    } else {
      fetch('/api/random-llama')
        .then((response) => response.json())
        .then((data) => {
          onImageChange(data.url);
          setLoading(false);
        });
    }
  }, [src, onImageChange]);

  return (
    <>
      {loading ? (
        <div className={`${className} animate-pulse bg-gray-200`}></div>
      ) : (
        <Img className={className} src={src} alt="Llama" />
      )}
    </>
  );
};

export default RandomLlamaImage;
