import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const AuthSuccess = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to homepage after successful authentication
    navigate('/');
  }, [navigate]);
  
  return (
    <div>
      <h1>Authentication Successful</h1>
      <p>Redirecting to homepage...</p>
    </div>
  );
};

export default AuthSuccess;