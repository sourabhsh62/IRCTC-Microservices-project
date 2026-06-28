const userService = require("../services/user.service");
const asyncHandler=require("../middlewares/asyncHandler")
const signup = asyncHandler(async (req, res, next) => {
    const result = await userService.signup(req.body);
    return res.status(201).json(result);
});


const Login = asyncHandler(async (req, res, next) => {
    const result = await userService.Login(req.body);
    return res.status(200).json(result);
});

const profile = asyncHandler(async (req, res, next) => {
    return res.status(200).json({ message: "profile fetched", user: req.user });
});



const refreshToken = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.body;
    const result = await userService.refreshAccessToken(refreshToken);
    return res.status(200).json(result); // Sends the new access token back safely
});
 
module.exports = {
  signup,Login,profile,refreshToken
};

