import './App.css'
import { createBrowserRouter } from 'react-router-dom'
import InitiativeList from './pages/initiative-list/InitiativeList'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store'
import Root from './pages/root'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/tracker",
        element: <InitiativeList />
      }
    ]
  }
])

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>

  )
}

export default App
