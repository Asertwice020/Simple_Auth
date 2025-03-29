import { useActionState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { authService } from '../../redux/auth/api.auth'

const ResetPassword = () => {
  const navigate = useNavigate();
  const {token} = useParams();
  const [state, submitAction, isPending] = useActionState(action);

  async function action(prevState, formData) {
    try {
      const data = {
        password: formData.get('password'),
      };

      const response = await authService.resetPassword(data, token);
      alert(response?.data?.message)

      if (response?.data?.success) {
        navigate('/');
      }
    } catch (error) {
      return { error: error.message || "Reset Password Failed" };
    }
  }

  return (
    <form action={submitAction}>
      <h1>Change Your Password</h1>
      <input type='password' name="password" placeholder="password" />
      <button type="submit" disabled={isPending}>
        Change Password
      </button>
    </form>
  );
};

export default ResetPassword;
