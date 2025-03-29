import {asyncHandler} from "../../utils/asyncHandler.util.js";
import {ApiError} from '../../utils/apiError.util.js'
import {ApiResponse} from '../../utils/apiResponse.util.js'

const checkHealth = asyncHandler(async (req, res, next) => {
  try {
    // * send response
    return res
    .status(200)
    .json(
      new ApiResponse(200, "Server Is Healthy!")
    );

  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something Went Wrong While Checking Health!",
      error,
      error?.stack
    );
  }
});

export default checkHealth