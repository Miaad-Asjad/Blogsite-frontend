import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import IntroPage from './pages/IntroPage';
import CategoryPage from './pages/CategoryPage';
import AllCategoriesPage from './pages/AllCategoriesPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import UserProfilePage from './pages/UserProfilePage';

const App = () => {
  return (
    <BrowserRouter>
      <div className='min-h-screen bg-gray-100'>
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeButton={true}
        />

        <Navbar />
        <div className='container mx-auto p-4'>
          <Routes>
            <Route path='/' element={<IntroPage />} />
            <Route path='/home' element={<HomePage />} />
            <Route
              path='/write'
              element={
                <ProtectedRoute>
                  <WritePage />
                </ProtectedRoute>
              }
            />
            <Route path="/categories" element={<AllCategoriesPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path='/blogs/:id' element={<PostPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path="/verify" element={<VerifyEmailPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/profile/:userId' element={<UserProfilePage />} /> 
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;


