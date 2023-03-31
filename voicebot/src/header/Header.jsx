import './header.css';
import Menu from '@mui/icons-material/Menu';
import Add from '@mui/icons-material/Add';
import { useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext';
import { MenuContext } from '../contexts/MenuContext';

function Header() {
  const { names, index } = useContext(ChatContext);
  const { newConversation } = useContext(ChatContext);

  const addNew = () => {
    newConversation();
    const container = document.getElementById('conversations');
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 2);
  };

  const { setMenu, burgerRef } = useContext(MenuContext);
  return (
    <main className='header'>
      <Add onClick={addNew} className='header_icon' />
      <div className='header_name'>{names[index]}</div>
      <Menu
        ref={burgerRef}
        className='header_icon'
        onClick={() => setMenu(true)}
      />
    </main>
  );
}

export default Header;
