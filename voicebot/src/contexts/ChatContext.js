import { createContext, useEffect, useState } from 'react';
import useOpenaiApi from '../hooks/useOpenaiApi';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [conversation, setConversation] = useState([]);
  const [prompt, setPrompt] = useState(null);
  const { response, loading } = useOpenaiApi(prompt, conversation);
  const [conversations, setConversations] = useState(
    JSON.parse(localStorage.getItem('conversations')) || [[]]
  );
  const [index, setIndex] = useState(localStorage.getItem('index') || 0);
  const [typed, setTyped] = useState(true);
  const [names, setNames] = useState(
    JSON.parse(localStorage.getItem('names')) || ['New chat']
  );
  const [answerIndex, setAnswerIndex] = useState(
    JSON.parse(localStorage.getItem('answerIndex')) || []
  );
  const [example, setExample] = useState('');

  useEffect(() => {
    const handleUnload = () => {
      localStorage.setItem('index', index);
      if (conversations.length != 0)
        localStorage.setItem('conversations', JSON.stringify(conversations));
      if (names !== ['New chat'])
        localStorage.setItem('names', JSON.stringify(names));
    };
    window.addEventListener('visibilitychange', handleUnload);

    return () => {
      window.removeEventListener('visibilitychange', handleUnload);
    };
  }, [names, conversations, index]);

  useEffect(() => {
    const newConversations = [...conversations];
    newConversations[index] = conversation;
    setConversations(newConversations);
  }, [conversation]);

  useEffect(() => {
    setConversation(conversations[index]);
  }, []);

  const newConversation = () => {
    if (!loading) {
      setIndex(0);
      const newConv = [...conversations];
      newConv.unshift([]);
      setConversations(newConv);
      setConversation([]);
      setNames((prev) => ['New chat', ...prev]);
    }
  };

  const changeConversation = (idx) => {
    if (!loading) {
      setConversation(conversations[idx]);
      setIndex(idx);
      setTyped(true);
    }
  };

  const changeName = (name, idx) => {
    const newNames = [...names];
    newNames[idx] = name;
    setNames(newNames);
    setIndex(idx);
  };

  const clearConversations = () => {
    if (!loading) {
      setConversations([[]]);
      setConversation([]);
      setNames(['New chat']);
      setAnswerIndex([]);
      setIndex(0);
    }
  };

  const deleteConversation = (idx) => {
    if (!loading) {
      const newConversations = [...conversations];
      newConversations.splice(idx, 1);
      setConversations(newConversations);
      const newIndex = idx !== 0 ? 0 : 1;
      if (idx === index) setIndex(0);
      else if (idx < index) setIndex((prev) => prev - 1);
      setConversation(conversations[newIndex]);
      const newNames = [...names];
      newNames.splice(idx, 1);
      setNames(newNames);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversation,
        setConversation,
        conversations,
        setConversations,
        newConversation,
        changeConversation,
        changeName,
        clearConversations,
        deleteConversation,
        typed,
        setTyped,
        names,
        index,
        example,
        setExample,
        answerIndex,
        setAnswerIndex,
        prompt,
        setPrompt,
        response,
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
