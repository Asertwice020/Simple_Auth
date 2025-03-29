import { useActionState } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '../../redux/auth/api.auth'

const ChangePassword = () => {
  const navigate = useNavigate();
  const [state, submitAction, isPending] = useActionState(action);

  async function action(prevState, formData) {
    try {
      const data = {
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword'),
      };

      if (data.currentPassword === data.newPassword) {
        return { error: 'New Password Cannot Be Same As Current Password!' };
      } else if (data.newPassword.length < 8) {
        return { error: 'Password Must Be At Least 8 Characters Long!' };
      }

      const response = await authService.changePassword(data);
      alert(response?.data?.message)

      if (response?.data?.success) {
        navigate("/")
      }
    } catch (error) {
      return { error: error.message || 'Registration Failed' };
    }
  }

  return (
    <div className="login-container">
      <form action={submitAction}>
        <h1>Change Password</h1>
        <input type="text" name="currentPassword" placeholder="currentPassword" />
        <input type="text" name="newPassword" placeholder="newPassword" />
        <button type="submit" disabled={isPending}>
          Change
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;