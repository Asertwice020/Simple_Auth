import {asyncHandler} from "../../utils/asyncHandler.util.js";
import {ApiError} from '../../utils/apiError.util.js'

const logout = asyncHandler(async (req, res, next) => {
  try {
    console.log(`you are in the logout controller`);
  } catch (error) {
    throw new ApiError(400, "Signup Failed!");
  }
});

export default logout