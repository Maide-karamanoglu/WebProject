import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import { MainLayout, AuthLayout } from './layouts';
import { ProtectedRoute } from './components';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  DashboardPage,
  UnauthorizedPage,
  CoursesListPage,
  CourseDetailPage,
  CourseFormPage,
  MyCoursesPage,
  ProfilePage,
  LessonFormPage,
  AdminDashboardPage,
  AdminUsersPage,
  AdminCategoriesPage,
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth Layout - Login/Register */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Main Layout - Public & Protected pages */}
          <Route element={<MainLayout />}>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/courses" element={<CoursesListPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />

            {/* Protected routes - Any authenticated user */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-courses"
              element={
                <ProtectedRoute>
                  <MyCoursesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Protected routes - Instructor/Admin only */}
            <Route
              path="/courses/create"
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <CourseFormPage mode="create" />
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <CourseFormPage mode="edit" />
                </ProtectedRoute>
              }
            />

            {/* Lesson routes */}
            <Route
              path="/courses/:id/lessons/create"
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <LessonFormPage mode="create" />
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses/:id/lessons/:lessonId/edit"
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <LessonFormPage mode="edit" />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminCategoriesPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
