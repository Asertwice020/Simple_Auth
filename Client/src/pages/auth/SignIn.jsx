import { useActionState } from 'react';
import { Link, useNavigate } from 'react-router';
import { authService } from '../../redux/auth/api.auth'

const Signin = () => {
  const navigate = useNavigate();
  const [state, submitAction, isPending] = useActionState(action);

  async function action(prevState, formData) {
    try {
      const data = {
        email: formData.get('email'),
        password: formData.get('password'),
      };

      const response = await authService.signin(data);
      alert(response?.data?.message)

      if (response?.data?.message.includes('Not Verified') && response?.data?.success) {
        navigate("/verify-mail")
        return { success: true };
      } else if (response?.data?.message.includes('2FA') && response?.data?.success) {
        navigate('/2fa/verify')
        return { success: true };
      } else if (response?.data?.message.includes('Signed In Successful') && response?.data?.success){
        navigate('/')
        return { success: true };
      } else {
        return { success: false, message: response?.data?.message}
      }
    } catch (error) {
      return { error: error.message || 'Sign In Failed' };
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_BASE_URL}/auth/google`;
  };

  return (
    <div className="login-container">
      <form action={submitAction}>
        <h1>Sign In</h1>
        <input type="email" name="email" placeholder="email" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit" disabled={isPending}>
          {isPending ? "Signing In" : "Sign In"}
        </button>
        <Link to="/signup">Sign Up</Link>
        <Link to="/forgot-password">Forgot Password</Link>
      </form>

      <div className="social-login">
        <p>Or continue with</p>
        <button 
          type="button"
          onClick={handleGoogleLogin}
          className="google-login-btn"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Signin;
