import signUp from './signup.controller.js';
import signIn from './signin.controller.js';
import logout from './logout.controller.js';
import verifyMail from './verifyMail.controller.js';
import generateNewAccessToken from './generateNewAccessToken.controller.js'
import forgotPassword from './forgotPassword.controller.js';
import resetPassword from './resetPassword.controller.js';
import {changePassword} from './changePassword.controller.js'
import {deactivateAccount} from './deactivateAccount.controller.js'
import {removeAccount} from './removeAccount.controller.js'

export { 
  signUp, 
  signIn, 
  logout, 
  verifyMail, 
  generateNewAccessToken, 
  forgotPassword, 
  resetPassword,
  changePassword,
  deactivateAccount,
  removeAccount
};