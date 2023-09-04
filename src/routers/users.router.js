import { getUsers, deleteUsers, updateUserRole, deleteUser } from "../controllers/users.controller.js";
import { Router } from 'express'

const router = Router();

router.get('/getUsers', getUsers );

router.delete('/deleteUsers', deleteUsers);

router.post('/updateUserRole/:userId', updateUserRole);

router.delete('/deleteUser/:userId', deleteUser);


export default router;