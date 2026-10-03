import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Forbidden from './pages/Forbidden'
import Certificates from './pages/Certificates'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CourseCatalog from './pages/CourseCatalog'
import CreateCourse from './pages/CreateCourse'
import CourseDetail from './pages/CourseDetail'
import CoursePlayer from './pages/CoursePlayer'
import ProtectedRoute from './components/ProtectedRoute'

function AppRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <CourseCatalog />
        }
      />
      <Route
        path="/courses/new"
        element={
          <ProtectedRoute allowedRoles={['instructor']}>
            <CreateCourse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <CourseDetail />
        }
      />
      <Route
        path="/courses/:id/learn"
        element={
          <ProtectedRoute>
            <CoursePlayer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id/learn/:lessonId"
        element={
          <ProtectedRoute>
            <CoursePlayer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificates"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Certificates />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
