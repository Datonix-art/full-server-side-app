import { Router } from 'express';
import isAdmin from '../middleware/admin.middleware.js';
import { createUser, deleteUser, deleteUsers, getUser, getUsers, updateUser } from '../controllers/admin.controllers.js';

const adminRouter = Router();

// create user
adminRouter.post('/', isAdmin, createUser)

// get single user
adminRouter.get('/:id', isAdmin, getUser)

// delete single user
adminRouter.delete('/:id', isAdmin, deleteUser)

// update single user
adminRouter.patch('/:id', isAdmin, updateUser)

// get all users
adminRouter.get('/', isAdmin, getUsers)

// delete all users
adminRouter.delete('/', isAdmin,  deleteUsers)

export default adminRouter;