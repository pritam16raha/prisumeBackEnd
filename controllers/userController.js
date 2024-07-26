import Joi, { string } from "joi"
import userModel from "../model/userModel";
import CustomErrorHandler from "../services/customErrorHandler";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const userController = {
    async registerUser(req, res, next){
        const registerSchema = Joi.object({
            name: Joi.string().min(3).required(),
            username: Joi.string().min(5).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
            confirmPassword: Joi.ref('password')
        })

        const {error} = registerSchema.validate(req.body);

        if(error){
            return next(error);
        }

        try{
            const userExist = await userModel.findOne({ email: req.body.email });
            if(userExist){
                return next( CustomErrorHandler.alreadyExist("Use different Email, This email is already been used") )
            }
        }catch(err){
            return next(err)
        }

        //password
        try{
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const myUser = new userModel({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            })
            myUser.save();
            //token generation
            const token = jwt.sign({ userId: myUser.id }, process.env.JWT_SECRET, { expiresIn: "365d" });
            res.cookie("authToken", token, { httpOnly: true, secure: true, maxAge: 31536000000 })
            return res.json(myUser);
        }catch(err){
            return next(err);
        }

        
    },
    async getUser(req, res, next){
        try{
            const user = await userModel.findOne({ email: req.body.email }).select('-password');
            if(!user){
                return next(CustomErrorHandler.notFound("User not found in Database"));
            }
            return res.json(user)
        }catch(err){
            return next(err);
        }
    },

    async editUser(req, res, next){
        try{
            const newPassword = await bcrypt.hash(req.body.password, 10);
            const userData = req.body;

            const updateUser = await userModel.findByIdAndUpdate({ _id: req.params.id }, {
                $set: {
                    "name": req.body.name,
                    "username":req.body.username,
                    "email": req.body.email,
                    "role": req.body.role,
                    "password": newPassword
                }
            }, {new: true});

            res.status(200).json(updateUser)
        }catch(err){
            return next(CustomErrorHandler.updateError("Error from edit user catch block"))
        }
    },

    async signoutUser(req, res, next){
        res.json({ message: "Hello MF" })
    },

    async signinUser(req, res, next){
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });

        const { error } = loginSchema.validate(req.body);

        if(error){
            return next(error)
        }

        try{
            const user = await userModel.findOne({ email: req.body.email });

            if(!user){
                return next(CustomErrorHandler.loginError("Email is wrong"))
            }

            const matchPassword = await bcrypt.compare(req.body.password, user.password);
            if(!matchPassword){
                return next(CustomErrorHandler.loginError("Password is wrong"))
            }

            const loginToken = jwt.sign({ _id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "365d" });
            res.cookie("loginToken", loginToken, { httpOnly: true, secure: true, maxAge: 31536000000 })
            //res.status(200).json({ userid: user._id })
            return res.json(user)

        }catch(err){
            return next(CustomErrorHandler.loginError("Error from login function, catch block"))
        }
    }
}

export default userController;