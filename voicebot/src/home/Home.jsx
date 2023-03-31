import { useContext, useEffect, useRef } from 'react';
import Chat from '../chat/Chat';
import { MenuContext } from '../contexts/MenuContext';
import Menu from '../menu/Menu';
import './home.css';

export default function Home() {
  const { menu, setMenu, burgerRef } = useContext(MenuContext);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        event.target.id !== 'delete' &&
        event.target.id !== 'check' &&
        !menuRef.current.contains(event.target) &&
        !burgerRef.current.contains(event.target)
      ) {
        setMenu(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuRef, menu]);

  return (
    <main className='home'>
      <div className='home_chat'>
        <Chat />
      </div>
      <div
        ref={menuRef}
        className='home_menu'
        style={{
          display: menu && 'flex',
        }}
      >
        <Menu />
      </div>
    </main>
  );
}
