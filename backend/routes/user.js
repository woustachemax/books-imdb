const express = require("express");
const router = express.Router();
const { User } = require("../db");
const { authMiddleware } =  require("../middleware");
const { Book } = require("../db");
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

    const updateBody = z.object({
        username: z.string().optional(),
        password: z.string().optional(),
    }) 

router.put("/user", async (req, res)=>{
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            msg: "Please enter the correct username/ password"
        })
    }

   await User.updateOne({_id: req.userID}, req.body)

    res.json({
        msg:"Updated Succesfully"
    })


})
})
module.exports = {
    router
}
const bookReview = z.object({
    title: z.string(),
    genre: z.string(),
    review: z.string(),
    rating: z.number(),
})
router.post("/review", authMiddleware, async (req, res) => {
    const { userId } = req; 

    const result = bookReview.safeParse(req.body);
    if (!result.success) {
        return res.status(411).json({
            msg: "Invalid review inputs",
            errors: result.error.errors,
        });
    }

    const { bookId, review, rating } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
        return res.status(404).json({ msg: "Book not found" });
    }

    const newReview = await Review.create({
        bookId,
        userId,
        review,
        rating,
    });

    res.status(200).json({ msg: "Review created", review: newReview });
});
