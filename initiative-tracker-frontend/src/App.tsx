import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store';
import { App as AntdApp } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';
import Root from './pages/root';
import BattleList from './pages/battle-list/BattleList';
import CharacterList from './pages/character-list/CharacterList';
import PlayerList from './pages/players-list/PlayerList';
import HomeScreen from "./pages/home-screen/HomeScreen";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/battles',
        element: <BattleList />,
      },
      {
        path: 'characters',
        element: <CharacterList />,
      },
      {
        path: 'players',
        element: <PlayerList />,
      },
      {
        path: '/',
        element: <HomeScreen />,
      },
    ],
  },
]);

let message: MessageInstance;
let notification: NotificationInstance;
let modal: Omit<ModalStaticFunctions, 'warn'>;

function App() {
  const staticFunction = AntdApp.useApp();
  message = staticFunction.message;
  modal = staticFunction.modal;
  notification = staticFunction.notification;

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export { message, modal, notification };
export default App;
