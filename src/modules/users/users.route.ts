import { validateCreateUserMiddleware } from './middleware/users.middleware';
import { UsersController } from './users.controller';
import express from 'express';

const router = express.Router();
export const usersController = new UsersController();

// router.post('/', validateCreateUserMiddleware, usersController.create);

router.get('/', usersController.getUsers);

router.get('/all', usersController.getUsers);

router.get('/one', usersController.getUserBy);

router.get('/:id', usersController.findOneById);

router.get('/visa-operations/all', usersController.getUserByOperations);

export const usersRoute = router;
