import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import './chat.css';
import { ChatContext } from '../contexts/ChatContext';
import Regenerate from '@mui/icons-material/Cached';
import Left from '@mui/icons-material/ChevronLeft';
import Right from '@mui/icons-material/ChevronRight';
import useImageGeneration from '../hooks/useImageGeneration';
import { MenuContext } from '../contexts/MenuContext';
import Header from '../header/Header';
import Input from './input/Input';
import Response from './response/Response';
import ChatInfo from './chatInfo/ChatInfo';
import Stop from '@mui/icons-material/StopOutlined';

export default function Chat() {
  const [imagePrompt, setImagePrompt] = useState(null);

  const { image, imageLoading } = useImageGeneration(imagePrompt);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const {
    conversation,
    setConversation,
    typed,
    setTyped,
    answerIndex,
    setAnswerIndex,
    prompt,
    setPrompt,
    response,
    loading,
  } = useContext(ChatContext);
  const { mode, voice, speaker, menu } = useContext(MenuContext);
  const [same, setSame] = useState(true);
  const [visual, setVisual] = useState(false);
  const chatRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const voices = window.speechSynthesis.getVoices();
  const speech = new SpeechSynthesisUtterance();
  const lastIndex = conversation.length > 0 ? conversation.length - 1 : 0;
  const [savedPrompt, setSavedPrompt] = useState(null);
  const [savedImagePrompt, setSavedImagePrompt] = useState(null);

  const load = document.querySelector('.chat_load');

  useEffect(() => {
    load?.remove();
    const user = new Image();
    const ai = new Image();
    ai.src = './ai.png';
    user.src = './hacker.png';
  }, [load]);

  useEffect(() => {
    if (conversation[lastIndex]?.question) {
      if (conversation[lastIndex]?.answers) {
        setSavedPrompt(conversation[lastIndex].question);
      } else if (conversation[lastIndex]?.urls) {
        setSavedImagePrompt(conversation[lastIndex].question);
      }
    } else {
      setSavedPrompt(null);
      setSavedImagePrompt(null);
    }
  }, [conversation]);

  useEffect(() => {
    const saveAnswerIndex = () => {
      localStorage.setItem('answerIndex', JSON.stringify(answerIndex));
    };
    window.addEventListener('visibilitychange', saveAnswerIndex);

    return () => {
      window.removeEventListener('visibilitychange', saveAnswerIndex);
    };
  }, [answerIndex]);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [conversation]);

  const regenerate = () => {
    if (!visual && savedPrompt) {
      setPrompt(savedPrompt);
      setSavedPrompt((prev) => prev + ' ');
      setSavedImagePrompt(null);
    } else if (savedImagePrompt) {
      setImagePrompt(savedImagePrompt);
      setSavedImagePrompt((prev) => prev + ' ');
      setSavedPrompt(null);
    }
    setSame(true);
    setIsScrolling(false);
  };

  useEffect(() => {
    if (voice) {
      speech.text = response;
      speech.voice = voices[speaker];
      window.speechSynthesis.speak(speech);
    } else {
      window.speechSynthesis.cancel();
    }
  }, [response, voice]);

  const handleScroll = () => {
    if (typed) {
      setIsScrolling(true);
      return;
    }
    if (
      chatRef.current.scrollHeight - chatRef.current.scrollTop ===
      chatRef.current.clientHeight
    )
      setIsScrolling(false);
    else setIsScrolling(true);
  };

  const changeFormat = () => {
    setVisual((prev) => !prev);
    const input = document.querySelector('.chat_input');
    input.focus();
  };

  useEffect(() => {
    const chatElement = chatRef.current;
    if (chatElement && !isScrolling) {
      const observer = new MutationObserver((mutations) => {
        chatElement.scrollTop = chatElement.scrollHeight;
      });

      const observerConfig = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      };
      observer.observe(chatElement, observerConfig);

      return () => observer.disconnect();
    }
  }, [isScrolling]);

  useEffect(() => {
    if (prompt && !same) {
      setConversation((prev) => [...prev, { question: prompt }]);
      setSavedPrompt(prompt);
      setSavedImagePrompt(null);
    }
    setPrompt(null);
  }, [prompt]);

  useEffect(() => {
    if (imagePrompt && !same) {
      setConversation((prev) => [...prev, { question: imagePrompt }]);
      setSavedImagePrompt(imagePrompt);
      setSavedPrompt(null);
    }
    setImagePrompt(null);
  }, [imagePrompt]);

  const changeIndex = (index, value, max) => {
    if (value === 1) {
      const newIndexes = [...answerIndex];
      newIndexes[index] = Math.min(Number(answerIndex[index]) + 1, max - 1);
      setAnswerIndex(newIndexes);
    } else {
      const newIndexes = [...answerIndex];
      newIndexes[index] = Math.max(Number(answerIndex[index]) - 1, 0);
      setAnswerIndex(newIndexes);
    }
  };

  useEffect(() => {
    if (response && !visual) {
      const updatedConversation = [...conversation];
      updatedConversation[lastIndex].answers = same
        ? [...updatedConversation[lastIndex].answers, response]
        : [response];
      setTyped(false);
      setConversation(updatedConversation);
    }
  }, [response]);

  useEffect(() => {
    if (image && visual) {
      const updatedConversation = [...conversation];
      updatedConversation[lastIndex].urls = same
        ? [...updatedConversation[lastIndex].urls, image]
        : [image];
      setConversation(updatedConversation);
    }
  }, [image]);

  useEffect(() => {
    if (conversation[lastIndex]?.answers) {
      const newIndexes = [...answerIndex];
      newIndexes[lastIndex] = conversation[lastIndex].answers.length - 1;
      setAnswerIndex(newIndexes);
    } else if (conversation[lastIndex]?.urls) {
      const newIndexes = [...answerIndex];
      newIndexes[lastIndex] = conversation[lastIndex].urls.length - 1;
      setAnswerIndex(newIndexes);
    } else {
      const newIndexes = [...answerIndex];
      newIndexes[lastIndex] = 0;
      setAnswerIndex(newIndexes);
    }
  }, [conversation]);

  return (
    <div
      className='chat'
      id={mode ? 'lightMode' : ''}
      style={{ opacity: menu && '0.8', filter: menu && 'brightness(70%)' }}
    >
      <div className='header_container'>
        <Header />
      </div>

      <div
        id={mode ? 'chatContainer' : ''}
        className='chat_container'
        onScroll={handleScroll}
        ref={chatRef}
      >
        <div className='chat_load'>
          <img src='./load.png'></img>
        </div>
        {conversation.length === 0 && (
          <ChatInfo mode={mode} setVisual={setVisual} />
        )}
        {conversation.map((conv, idx) => (
          <div className='chat_pair' key={idx}>
            <div id={mode ? 'lightMode' : ''} className='chat_question'>
              <img className='profile' src='./hacker.png' />
              <pre>{conv.question}</pre>
            </div>

            {conv?.urls ? (
              <div className='chat_answer' id={mode ? 'light' : ''}>
                {conv.urls.length > 1 && (
                  <div className='chat_changeAnswers'>
                    <Left onClick={() => changeIndex(idx, -1)} id='left' />
                    <span>
                      {Number(answerIndex[idx]) + 1 + '/' + conv.urls.length}
                    </span>
                    <Right
                      onClick={() => changeIndex(idx, 1, conv.urls.length)}
                      id='right'
                    />
                  </div>
                )}
                <img className='profile' src='./ai.png' />
                {idx === lastIndex && imageLoading && (
                  <div className='chat_loading'>Loading</div>
                )}

                {idx === lastIndex ? (
                  !imageLoading && <img src={conv.urls[answerIndex[idx]]}></img>
                ) : (
                  <img src={conv.urls[answerIndex[idx]]}></img>
                )}
              </div>
            ) : (
              <div className='chat_answer' id={mode ? 'light' : ''}>
                <img className='profile' src='./ai.png' />
                {idx === lastIndex && imageLoading && (
                  <div className='chat_loading'>Loading</div>
                )}
                {conv.answers?.length > 1 && (
                  <div className='chat_changeAnswers'>
                    <Left
                      style={{
                        opacity: answerIndex[idx] === 0 ? '0.5' : '',
                      }}
                      onClick={() => changeIndex(idx, -1)}
                      id='left'
                    />
                    <span>
                      {Number(answerIndex[idx]) +
                        1 +
                        '/' +
                        conv.answers?.length}
                    </span>
                    <Right
                      style={{
                        opacity:
                          answerIndex[idx] === conv.answers.length - 1
                            ? '0.5'
                            : '',
                      }}
                      onClick={() => changeIndex(idx, 1, conv.answers?.length)}
                      id='right'
                    />
                  </div>
                )}

                {idx === lastIndex && loading && (
                  <div className='chat_loading'>Loading</div>
                )}

                {idx === lastIndex &&
                answerIndex[idx] === conv.answers?.length - 1 &&
                !typed ? (
                  <Response
                    type={true}
                    setTyped={setTyped}
                    answer={conv.answers?.[answerIndex[idx]]}
                  />
                ) : (
                  (!loading || idx !== lastIndex) && (
                    <Response
                      type={false}
                      setTyped={setTyped}
                      answer={conv.answers?.[answerIndex[idx]]}
                    />
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <div className='chat_inputContainer'>
          {!loading &&
            typed &&
            ((visual && savedImagePrompt) || (!visual && savedPrompt)) && (
              <button
                onClick={regenerate}
                className='chat_regenerate'
                id={mode ? 'lightButton' : ''}
              >
                <Regenerate id='regenerate' /> Regenerate response
              </button>
            )}
          {!typed && (
            <button
              onClick={() => setTyped(true)}
              className='chat_regenerate'
              id={mode ? 'lightButton' : ''}
            >
              <Stop id='stopGenerate' /> Stop generating
            </button>
          )}

          <Input
            mode={mode}
            listening={listening}
            loading={loading}
            changeFormat={changeFormat}
            visual={visual}
            transcript={transcript}
            setPrompt={setPrompt}
            setSame={setSame}
            setIsScrolling={setIsScrolling}
            setImagePrompt={setImagePrompt}
            resetTranscript={resetTranscript}
          />
        </div>
      </div>
    </div>
  );
}
