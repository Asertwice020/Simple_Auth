import { useActionState, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { authService } from '../../redux/auth/api.auth';

const VerifyMail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, submitAction, isPending] = useActionState(action);
  const [inputValue, setInputValue] = useState('');

  // Extract query parameters
  const accessToken = searchParams.get('accessToken');
  const verificationCode = searchParams.get('verificationCode');

  // * Auto-submit if both params exist
  useEffect(() => {
    if (accessToken && verificationCode) {
      submitAction();
    }
  }, [accessToken, verificationCode, submitAction]);

  // Handle input change
  const handleInputChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    setInputValue(numericValue);
  };

  async function action(prevState, formData) {
    try {
      const data = {
        accessToken,
        verificationCode: verificationCode || formData.get('verification-code'),
      };

      const response = await authService.verifyMail(data);

      if (response?.data?.message.includes(`User Verified Successful`)) {
        alert(response?.data?.message);
        navigate('/signin');
        return { success: true };
      } else {
        return { success: false, message: response?.data?.message };
      }
    } catch (error) {
      return { error: error.message || 'Verification Failed' };
    }
  }

  return (
    <form action={submitAction}>
      <h1>Verify Your Mail</h1>
      
      {state?.error && <p>{state?.error}</p>}
      {state?.message && <p>{state?.message}</p>}

      <input
        type="number"
        name="verification-code"
        value={inputValue}
        placeholder="Enter 6 Digit Verification Code"
        inputMode="numeric"
        pattern="\d*"
        maxLength="6"
        required
        autoFocus={!verificationCode}
        onChange={handleInputChange}
        readOnly={verificationCode}
      />
      <button type="submit" disabled={isPending || inputValue.length < 6}>
        {isPending ? 'Verifying...' : 'Verify'}
      </button>
    </form>
  );
};

export default VerifyMail;