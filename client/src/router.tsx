import { Routes, Route } from 'react-router-dom'
import App from './App'
import Register from './pages/Register'

function AppRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default AppRoutes
