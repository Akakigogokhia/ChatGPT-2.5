import { useContext, useEffect, useState } from 'react';
import '../chat.css';
import Send from '@mui/icons-material/Send';
import Mic from '@mui/icons-material/Mic';
import MicOff from '@mui/icons-material/MicOff';
import SpeechRecognition from 'react-speech-recognition';
import { ChatContext } from '../../contexts/ChatContext';

function Input({
  mode,
  listening,
  loading,
  changeFormat,
  visual,
  transcript,
  setPrompt,
  setImagePrompt,
  setSame,
  setIsScrolling,
  resetTranscript,
}) {
  const [question, setQuestion] = useState('');
  const input = document.querySelector('.chat_input');
  const { example } = useContext(ChatContext);

  const send = () => {
    if (visual) {
      setImagePrompt(question);
    } else {
      setPrompt(question);
    }
    if (listening) SpeechRecognition.stopListening();
    setQuestion('');
    setSame(false);
    setIsScrolling(false);
    resetTranscript();
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (visual) {
        setImagePrompt(question);
      } else {
        setPrompt(question);
      }
      if (listening) SpeechRecognition.stopListening();
      setQuestion('');
      setSame(false);
      setIsScrolling(false);
      resetTranscript();
    }
  };

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
    const input = document.querySelector('.chat_input');
    input.focus();
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
    const input = document.querySelector('.chat_input');
    input.focus();
  };

  useEffect(() => {
    if (transcript) {
      setQuestion(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (input) {
      input.style.height = '51px';
      input.style.height = `${input.scrollHeight}px`;
    }
  }, [question]);

  useEffect(() => {
    setQuestion(example);
  }, [example]);

  return (
    <div className='chat_inputWrapper'>
      <textarea
        placeholder='Send a message...'
        tabIndex='0'
        className='chat_input'
        id={mode ? 'lightInput' : 'chatInput'}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleEnter}
      ></textarea>
      <div className='chat_icons'>
        {!listening ? (
          <Mic
            id={mode ? 'lightIcon' : ''}
            className='chat_mic'
            onClick={startListening}
          />
        ) : (
          <MicOff
            id={mode ? 'lightIcon' : ''}
            className='chat_mic'
            onClick={stopListening}
          />
        )}
        {loading ? (
          <div id='send_loading'></div>
        ) : (
          <Send
            id={mode ? 'lightIcon' : ''}
            className='chat_send'
            onClick={send}
          ></Send>
        )}

        <div
          className='chat_select'
          id={mode ? 'lightSelect' : ''}
          onClick={changeFormat}
        >
          {visual ? 'Image' : 'Text'}{' '}
          <img
            className='select'
            src={mode ? './select_light.png' : './select.png'}
          />
        </div>
      </div>
    </div>
  );
}

export default Input;
