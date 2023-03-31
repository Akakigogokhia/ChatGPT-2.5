import { createContext, useEffect, useRef, useState } from 'react';

export const MenuContext = createContext();

export const MenuContextProvider = ({ children }) => {
  const settings = JSON.parse(localStorage.getItem('settings'));
  const [mode, setMode] = useState(settings?.mode ? true : false);
  const [voice, setVoice] = useState(
    settings?.voice === undefined ? true : settings?.voice ? true : false
  );
  const [speaker, setSpeaker] = useState(settings?.speaker || 0);
  const [menu, setMenu] = useState(false);
  const burgerRef = useRef(null);

  useEffect(() => {
    const handleUnload = () => {
      const settings = { mode: mode, speaker: speaker, voice: voice };
      localStorage.setItem('settings', JSON.stringify(settings));
    };
    window.addEventListener('visibilitychange', handleUnload);

    return () => {
      window.removeEventListener('visibilitychange', handleUnload);
    };
  }, [mode, speaker, voice]);

  return (
    <MenuContext.Provider
      value={{
        mode,
        setMode,
        voice,
        setVoice,
        speaker,
        setSpeaker,
        menu,
        setMenu,
        burgerRef,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
