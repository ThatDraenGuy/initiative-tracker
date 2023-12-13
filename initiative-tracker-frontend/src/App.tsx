import {createBrowserRouter} from 'react-router-dom';
import {RouterProvider} from 'react-router';
import {Provider} from 'react-redux';
import {store} from './store';
import {App as AntdApp} from 'antd';
import type {MessageInstance} from 'antd/es/message/interface';
import type {ModalStaticFunctions} from 'antd/es/modal/confirm';
import type {NotificationInstance} from 'antd/es/notification/interface';
import Root from './pages/root';
import BattleList from './pages/battle-list/BattleList';
import CharacterList from './pages/character-list/CharacterList';
import PlayerList from './pages/players-list/PlayerList';
import HomeScreen from './pages/home-screen/HomeScreen';
import StatBlockList from './pages/stat-block-list/StatBlockList';
import AbilityList from "./pages/ability-list/AbilityList";
import CreatureTypeList from "./pages/creature-type-list/CreatureTypeList";
import DamageTypeList from "./pages/damage-type-list/DamageTypeList";
import SkillList from "./pages/skill-list/SkillList";
import InitiativeList from './pages/battle-list/pages/InitiativeList';
import { ReactNode } from 'react';

export interface AppRoute {
  labelKey: string;
  key?: string;
  path: string;
  element: ReactNode;
  children?: AppRoute[];
}

export const appRoutes: AppRoute[] = [
  {
    labelKey: 'home.label',
    key: '',
    path: '/',
    element: <HomeScreen />,
  },
  {
    labelKey: 'battle.label',
    key: 'battles',
    path: '/battles',
    element: <BattleList />,
    children: [
      {
        labelKey: 'battle.initiative.label',
        path: '/battles/:battleId',
        element: <InitiativeList />,
      },
    ],
  },
  {
    labelKey: 'character.label',
    key: 'characters',
    path: '/characters',
    element: <CharacterList />,
  },
  {
    labelKey: 'player.label',
    key: 'players',
    path: '/players',
    element: <PlayerList />,
  },
  {
    labelKey: 'statBlock.label',
    key: 'statBlocks',
    path: '/statBlocks',
    element: <StatBlockList />,
  },
];

interface WithChildren {
  children?: WithChildren[];
}
function flattenChildren(array: WithChildren[]): any[] {
  let result: any[] = [];
  array.forEach(elem => {
    result.push({ ...elem, children: undefined });
    if (Array.isArray(elem.children)) {
      result = result.concat(flattenChildren(elem.children));
    }
  });
  console.log(result);
  return result;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: flattenChildren(appRoutes),
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
            <RouterProvider router={router}/>
        </Provider>
    );
}

export {message, modal, notification};
export default App;
