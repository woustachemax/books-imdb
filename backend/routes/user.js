const express = require("express");
const router = express.Router();
const { User } = require("../db");
const {JWT_SECRET} =  require("../config");
const z = require("zod");
const jwt = require("jsonwebtoken");

const signUpBody = z.object[{
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
    birthDate: z.string().date(),
}]
router.post("/signup", async (req, res)=>{
    const newsignUpBody = req.body.newsignUpBody;
    const success = signUpBody.safeParse(newsignUpBody);

    if(!success){
        res.status(411).json({
            msg: "Incorrect inputs, please enter correct inputs"
        });
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser){
        res.status(411).json({
            msg: "Username is taken"
        })
    }

    const user =  await User.create({
        username:req.body.username,
        password:req.body.password,
        birthDate:req.body.birthDate,
        email:req.body.email
    });

    const userID = user._id;

    const token = jwt.sign ({
         userID
    }, JWT_SECRET);

    res.status(200).json({
        msg: "User Created Succesfully!",
        token: token
    })
})

const signInBody = z.object[{
    username: z.string(),
    password: z.string(),
}]

router.use("/signin", async (req, res) => {
    const {success} = signInBody.safeParse(req.body);
    
    if(!success){
        res.status(411).json({
            msg: "User doesn't exist, please create an account first."
        })
    }

    const user =  await User.findOne({
        username: req.body.username,
        password: req.body.password
    })
    
    if(user){
        const token = jwt.sign( {
            userID: user._id
        }, JWT_SECRET);

        res.json({token})
        return;
    }

    {
        res.status(411).json({
            msg: "Error while logging in "
        })
    }

    
})
module.exports = {
    router
}

