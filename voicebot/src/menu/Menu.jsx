import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../contexts/ChatContext';
import { MenuContext } from '../contexts/MenuContext';
import './menu.css';
import Check from '@mui/icons-material/Check';
import Volume from '@mui/icons-material/VolumeUpOutlined';
import VolumeOff from '@mui/icons-material/VolumeOffOutlined';
import Chat from '@mui/icons-material/ChatBubbleOutline';
import Add from '@mui/icons-material/Add';
import Voice from '@mui/icons-material/RecordVoiceOverOutlined';
import Close from '@mui/icons-material/Close';

export default function Menu() {
  const {
    conversations,
    newConversation,
    changeConversation,
    changeName,
    clearConversations,
    deleteConversation,
    names,
    index,
  } = useContext(ChatContext);
  const { mode, setMode, voice, setVoice, speaker, setSpeaker, menu, setMenu } =
    useContext(MenuContext);
  const [name, setName] = useState('');
  const [editIdx, setEditIdx] = useState({ edit: false, index: 0 });
  const sound = ['David', 'Mark', 'Zira'];
  const [height, setHeight] = useState('100%');

  const setConversationName = (index) => {
    setEditIdx((prev) => ({ ...prev, edit: false }));
    changeName(name, index);
  };

  const changeSpeaker = () => {
    if (!/Mobi|Android/i.test(navigator.userAgent))
      setSpeaker((prev) => (prev < 2 ? prev + 1 : 0));
  };

  const enterName = (e, index) => {
    if (e.key === 'Enter') {
      setEditIdx((prev) => ({ ...prev, edit: false }));
      changeName(name, index);
    }
  };

  const editName = (index) => {
    setEditIdx({ edit: true, index: index });
  };

  const deleteConv = (e, index) => {
    e.stopPropagation();
    deleteConversation(index);
  };

  const addNew = () => {
    newConversation();
  };

  useEffect(() => {
    if (/Mobi|Android/i.test(navigator.userAgent)) setSpeaker(2);
  }, []);

  useEffect(() => {
    const input = document.getElementById('menu_nameInput');
    if (input) {
      input.focus();
      setName(input.defaultValue);
    }
  }, [editIdx]);

  useEffect(() => {
    const resize = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className='menu' style={{ height: height }}>
      {menu && (
        <div className='menu_close' onClick={() => setMenu(false)}>
          <Close id='closeIcon' />
        </div>
      )}
      <div className='menu_button'>
        <div onClick={addNew} className='menu_newChat'>
          <Add id='addNew' />
          <>New Chat</>
        </div>
      </div>
      <div className='menu_container'>
        <div className='menu_conversations' id='conversations'>
          {names.map((name, idx) => (
            <div
              className='menu_conversation'
              key={idx}
              onClick={() => changeConversation(idx)}
              style={{ backgroundColor: idx == index && '#343541' }}
            >
              <div className='menu_name '>
                <Chat className='icon' id='chat' />
                {(editIdx.index !== idx || !editIdx.edit) && <div>{name}</div>}
              </div>

              {editIdx.edit && editIdx.index === idx && (
                <input
                  id='menu_nameInput'
                  onChange={(e) => setName(e.target.value)}
                  defaultValue={name ? name : 'New chat'}
                  onKeyDown={(e) => enterName(e, index)}
                />
              )}

              <div>
                {editIdx.edit && editIdx.index === idx ? (
                  <Check id='check' onClick={() => setConversationName(idx)} />
                ) : (
                  <div className='menu_edit'>
                    <div id='blur'></div>
                    <img
                      id='delete'
                      src='./pencil.png'
                      onClick={() => editName(idx)}
                    />
                    {conversations.length > 1 && (
                      <img
                        id='delete'
                        src='./delete.png'
                        onClick={(e) => deleteConv(e, idx)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className='menu_settings'>
          <div className='menu_setting' onClick={() => clearConversations()}>
            <img id='delete' src='./delete.png' />
            <span>Clear conversations</span>
          </div>
          <div
            className='menu_setting'
            onClick={() => setMode((prev) => !prev)}
          >
            <img
              style={{ marginLeft: '-2px' }}
              className='icon'
              src={mode ? './moon.png' : './sun.png'}
            />
            <span>{mode ? 'Dark mode' : 'Light mode'}</span>
          </div>

          <div className='menu_setting' onClick={changeSpeaker}>
            <Voice style={{ opacity: 0.8 }} className='icon' />
            <span>Speaker: {sound[speaker]}</span>
          </div>

          {voice ? (
            <div onClick={() => setVoice(false)} className='menu_setting'>
              <Volume style={{ opacity: 0.8 }} className='icon' />
              <span>Disabe voice</span>
            </div>
          ) : (
            <div onClick={() => setVoice(true)} className='menu_setting'>
              <VolumeOff style={{ opacity: 0.8 }} className='icon' />
              <span>Enable voice</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
