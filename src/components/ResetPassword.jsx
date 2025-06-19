import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../utils';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (!token) {
      setError("Invalid or expired token.");
      setTimeout(() => navigate("/login"), 2000); 
    }
  }, [token, navigate]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!token) return;

  if (newPassword.length < 8) {
    return setError("Password must be at least 8 characters.");
  }

  if (newPassword !== confirmPassword) {
    return setError("Passwords do not match.");
  }

  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const res = await axiosInstance.post(`/api/auth/reset-password?token=${token}`, {
      password: newPassword,  
    });

    setSuccess(res.data.message || 'Password reset successfully.');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => navigate('/login'), 2000);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to reset password. Try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-blue-200 to-blue-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl text-center font-bold text-blue-600 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-lg text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-lg text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center mb-4">{success}</p>}

          <button
            type="submit"
            disabled={loading || !token}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
              loading || !token
                ? 'bg-blue-300 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
