const verifyJWT = (req, res, next) => {
  try {
    // console.log( "req.cookies", req.cookies);
    const tokenByCookie = req.cookies?.accessToken;
    console.log(`token by cookie :: ${tokenByCookie}`);
    // const tokenBySmallHeader = req.headers?.authorization?.split(' ')[1]
    // const tokenByCapitalHeader = req.headers?.Authorization?.split(' ')[1]
    // const tokenByQuery = req.query?.accessToken;
    // console.log(`access token :: medium \n,\n cookie: ${tokenByCookie} \n small header: ${tokenBySmallHeader} \n capital header: ${tokenByCapitalHeader} \n query: ${tokenByQuery}`);
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // const authHeader = req.headers.authorization;
  // if (!authHeader) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  // const token = authHeader.split(" ")[1];
  // if (!token) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  next();
}

export default verifyJWT