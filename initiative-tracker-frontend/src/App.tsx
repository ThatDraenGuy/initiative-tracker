import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store';
import Root from './pages/root';
import BattleList from './pages/battle-list/BattleList';
import { ConfigProvider, theme } from 'antd';
import CharacterList from './pages/character-list/CharacterList';

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
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  );
}

export default App;
