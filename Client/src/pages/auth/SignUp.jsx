import { useActionState } from 'react';
import { Link, useNavigate } from 'react-router';
import { authService } from '../../redux/auth/api.auth'

const Signup = () => {
  const navigate = useNavigate();
  const [state, submitAction, isPending] = useActionState(action);

  async function action(prevState, formData) {
    try {
      const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
      };

      const response = await authService.signup(data);
      
      if (response?.data?.success) {
        alert(response?.data?.message)
        navigate("/verify-mail")
        return { success: true };
      } else {
        return { success: false, message: response?.data?.message };
      }
    } catch (error) {
      return { error: error.message || 'Registration Failed' };
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_BASE_URL}/auth/google`;
  };

  return (
    <div className="login-container">
      <form action={submitAction}>
        <h1>Sign Up</h1>
        <input type="text" name="username" placeholder="username" />
        <input type="email" name="email" placeholder="email" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit" disabled={isPending}>
          {isPending ? "Signing Up..." : "Sign Up"}
        </button>
        <Link to="/signin">Sign In</Link>
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

export default Signup;