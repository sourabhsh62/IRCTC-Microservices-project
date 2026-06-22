const userService = require("../services/user.service");

async function signup(req, res) {
  try {
    const result = await userService.signup(req.body);

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
}


async function Login(req,res){
  try {
    const result=await userService.Login(req.body);
    return res.status(200).json(result);

  } catch (error) {
    return res.status(400).json({message:error.message})
  }
}

async function profile(req,res){
  return res.status(200).json({message:"profile fetched",user:req.user})
}


async function refreshToken(req,res){
  const {refreshToken}=req.body;
  const result=await userService.refreshAccessToken(refreshToken);
  return res.status(200).json(result) //result k andr acccess token aa raha hai user.service se 
}

async function getUserById(req,res){
    try {
        const result=await userService.getUserById(req.params.id)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}

module.exports = {
  signup,Login,profile,refreshToken,getUserById
};

