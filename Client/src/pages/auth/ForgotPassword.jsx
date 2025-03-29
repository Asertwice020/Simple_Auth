import { useActionState } from 'react';
import { authService } from '../../redux/auth/api.auth'

const ForgotPassword = () => {
  const [state, submitAction, isPending] = useActionState(action);

  async function action(prevState, formData) {
    try {
      const data = {
        email: formData.get('email'),
      };

      const response = await authService.forgotPassword(data);
      alert(response?.data?.message)
    } catch (error) {
      return { error: error.message || 'Registration failed' };
    }
  }

  return (
    <form action={submitAction}>
      <h1>Forgot Password</h1>
      <input type="email" name="email" placeholder="email" />
      <button type="submit" disabled={isPending}>
        Submit
      </button>
    </form>
  );
};

export default ForgotPassword;
