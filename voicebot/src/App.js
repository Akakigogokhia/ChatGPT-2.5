import './App.css';
import { ChatContextProvider } from './contexts/ChatContext';
import { MenuContextProvider } from './contexts/MenuContext';
import Home from './home/Home';

function App() {
  return (
    <ChatContextProvider>
      <MenuContextProvider>
        <div className='App'>
          <Home />
        </div>
      </MenuContextProvider>
    </ChatContextProvider>
  );
}

export default App;
