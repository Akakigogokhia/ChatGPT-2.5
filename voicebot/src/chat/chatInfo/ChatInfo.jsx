import React, { useContext } from 'react';
import Arrow from '@mui/icons-material/ArrowRightAlt';
import './chatInfo.css';
import { ChatContext } from '../../contexts/ChatContext';

function ChatInfo({ mode, setVisual }) {
  const examples = [
    'Explain quantum computing in simple terms',
    'futuristic city with flying cars andtowering skyscrapers.',
    'How do I make an HTTP request in Javascript?',
  ];
  const { setExample } = useContext(ChatContext);

  const example = (prompt, image) => {
    setExample((prev) => (prev === prompt ? prev + ' ' : prompt));
    setVisual(image ? true : false);
    document.querySelector('.chat_input').focus();
  };

  return (
    <div className='chatInfo' style={{ color: mode ? 'black' : '' }}>
      <h1>ChatGPT 2.5</h1>
      <div className='chatInfo_container'>
        <div className='examples'>
          <img
            id='info_icon'
            src={mode ? 'sun_dark.png' : 'sun_light.png'}
          ></img>
          <h3>Examples</h3>
          <div>
            <div
              id={mode ? 'info_block' : 'example'}
              onClick={() => example(examples[0])}
            >
              {`"${examples[0]}"`} <Arrow id='arrow' />
            </div>
            <div
              id={mode ? 'info_block' : 'example'}
              onClick={() => example(examples[1], true)}
            >
              {`"${examples[1]}"`} <Arrow id='arrow' />
            </div>
            <div
              id={mode ? 'info_block' : 'example'}
              onClick={() => example(examples[2])}
            >
              {`"${examples[2]}"`}
              <Arrow id='arrow' />
            </div>
          </div>
        </div>
        <div className='examples'>
          <img id='info_icon' src={mode ? 'flash_dark.png' : 'flash.png'}></img>
          <h3>Capabilities</h3>
          <div>
            <div id={mode ? 'info_info' : ''}>
              Remembers conversation and allows follow-up corrections
            </div>
            <div id={mode ? 'info_info' : ''}>
              Generates unique images based on provided text
            </div>
            <div id={mode ? 'info_info' : ''}>
              Voice assistant and speech recognition
            </div>
          </div>
        </div>
        <div className='examples'>
          <img id='info_icon' src={mode ? 'alert_dark.png' : 'alert.png'}></img>
          <h3>Limitations</h3>
          <div>
            <div id={mode ? 'info_info' : ''}>
              May occasionally generate incorrect information
            </div>
            <div id={mode ? 'info_info' : ''}>
              May occasionally produce harmful instructions or biased content
            </div>
            <div id={mode ? 'info_info' : ''}>
              Limited knowledge of world and events after 2021
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInfo;
