const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")

async function signup(data) {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already exists");
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    `
    INSERT INTO users(name,email,password)
    VALUES($1,$2,$3)
    `,
    [name, email, hashedPassword]
  );

  return {
    message: "User created successfully"
  };
}


const Login = async (data) => {
  try {
    const { email, password } = data;
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user) {
      throw new Error("Invalid credentials")
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

  const accessToken=jwt.sign({id:user.id,email:user.email,role:user.role},process.env.JWT_SECRET,{expiresIn:"15m"});

    const refreshToken=jwt.sign({id:user.id,email:user.email,role:user.role},process.env.JWT_SECRET,{expiresIn:"7d"});

await pool.query(
  `
  UPDATE users
  SET refresh_token = $1
  WHERE id = $2
  `,
  [refreshToken, user.id]
);

   return {
  message: "Login successful",
  accessToken,
  refreshToken
}; 

  } catch (error) {
    console.log(error);
    return {message:error.message}

  }
}

const refreshAccessToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Error("Refresh token required");
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    );

    const result = await pool.query(
      `
      SELECT * FROM users
      WHERE id = $1
      `,
      [decoded.id]
    );

    const user = result.rows[0];

    if (!user) {
      throw new Error("User not found");
    }

    if (user.refresh_token !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m"
      }
    );

    return {
      accessToken
    };

  } catch (error) {
    return {
      message: error.message
    };
  }
};

async function getUserById(id) {
    const result=await pool.query(`SELECT id,name,email FROM users WHERE id=$1`,[id])
    return result.rows[0];
}
module.exports = {
  signup, Login,refreshAccessToken,getUserById
};


