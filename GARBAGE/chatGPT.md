import { useActionState, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { authService } from '../../redux/auth/api.auth';

const VerifyMail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, submitAction, isPending] = useActionState(action);
  
  // State for managing verification code input and editability
  const [inputValue, setInputValue] = useState('');
  const [canModify, setCanModify] = useState(true);

  // Extract query parameters
  const accessToken = searchParams.get('accessToken');
  const verificationCode = searchParams.get('verificationCode');

  // Initialize input value with verification code from URL if available
  useEffect(() => {
    if (verificationCode) {
      setInputValue(verificationCode);
      // By default, don't allow modifying URL-provided verification code
      setCanModify(false);
    }
  }, [verificationCode]);

  // Auto-submit if both params exist
  useEffect(() => {
    if (accessToken && verificationCode) {
      submitAction();
    }
  }, [accessToken, verificationCode, submitAction]);

  // Handle input change
  const handleInputChange = (e) => {
    if (canModify) {
      // Only allow numeric input
      const numericValue = e.target.value.replace(/\D/g, '');
      setInputValue(numericValue);
    }
  };

  // Toggle the ability to modify the verification code
  const toggleCanModify = () => {
    setCanModify(prev => !prev);
  };

  async function action(prevState, formData) {
    try {
      const data = {
        accessToken,
        verificationCode: inputValue || formData.get('verification-code'),
      };

      const response = await authService.verifyMail(data);
      
      if (response?.data?.message.includes(`User Verified Successful`)) {
        alert('Email verified successfully!');
        navigate('/login');
        return { success: true };
      } else {
        return { success: false, message: response?.data?.message };
      }
    } catch (error) {
      return { error: error.message || 'Verification Failed' };
    }
  }

  return (
    <div className="verify-mail-container">
      <form action={submitAction}>
        <h1>Verify Your Email</h1>
        
        {state?.error && (
          <div className="error-message">{state.error}</div>
        )}
        
        {state?.message && (
          <div className="info-message">{state.message}</div>
        )}
        
        <div className="input-group">
          <label htmlFor="verification-code">Verification Code</label>
          <input
            id="verification-code"
            type="text"
            name="verification-code"
            value={inputValue}
            placeholder="Enter 6-digit code"
            inputMode="numeric"
            pattern="\d*"
            maxLength="6"
            required
            autoFocus={!verificationCode}
            onChange={handleInputChange}
            disabled={!canModify && verificationCode}
            className={!canModify && verificationCode ? "readonly" : ""}
          />
          
          {verificationCode && (
            <button 
              type="button" 
              className="toggle-button"
              onClick={toggleCanModify}
            >
              {canModify ? 'Lock Code' : 'Edit Code'}
            </button>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={isPending || (inputValue.length < 6)}
          className="submit-button"
        >
          {isPending ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </div>
  );
};

export default VerifyMail;