import { useState, useEffect, useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext';

export const useOpenaiApi = (prompt, conversation) => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateAnswer = async () => {
      if (!prompt) return;
      setLoading(true);
      const response = await fetch('https://chatgpt-2-5.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          conversation: JSON.stringify(conversation),
        }),
      });
      const data = await response.json();
      setResponse((prev) => (data.bot === prev ? prev + ' ' : data.bot));
      setTimeout(() => {
        setLoading(false);
      }, 30);
    };
    generateAnswer();
  }, [prompt]);

  return { response, loading };
};

export default useOpenaiApi;
