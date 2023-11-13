import { validateCreateUserMiddleware } from './middleware/users.middleware';
import { UsersController } from './users.controller';
import express from 'express';

const router = express.Router();
export const usersController = new UsersController();

router.post('/', validateCreateUserMiddleware, usersController.createUsers);

router.post('/update', usersController.updateUserById);

router.get('/', usersController.getUsers);

router.get('/verify-ldap', usersController.verifyLdapUser);

router.get('/export', usersController.generateUsersExportLinks);

router.get('/export/:code', usersController.generateUsersExporData);

router.get('/one', usersController.getUserBy);

router.get('/:id', usersController.findOneById);

router.get('/visa-operations/all', usersController.getUserByOperations);

export const usersRoute = router;
