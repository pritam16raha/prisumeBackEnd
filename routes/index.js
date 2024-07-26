import express from 'express';
import { userController } from '../controllers';
const router = express.Router();

router.post("/user/register", userController.registerUser);

router.put("/user/edit/:id", userController.editUser);

router.post('/user/signout', userController.signoutUser);

router.get('/user/get', userController.getUser);

router.post('/user/signin', userController.signinUser)

export default router;