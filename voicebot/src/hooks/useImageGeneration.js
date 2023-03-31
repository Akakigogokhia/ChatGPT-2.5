import { useEffect, useState } from 'react';

const useImageGeneration = (prompt) => {
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const generateImage = async () => {
      if (!prompt) return;
      setImageLoading(true);
      const response = await fetch('https://chatgpt-2-5.onrender.com/dalle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt }),
      });
      const data = await response.json();
      setImage(data.url);
      setImageLoading(false);
    };
    generateImage();
  }, [prompt]);

  return { image, imageLoading };
};

export default useImageGeneration;
