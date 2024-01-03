import { validateCreateUserMiddleware } from './middleware/users.middleware';
import { UsersController } from './users.controller';
import express from 'express';

const router = express.Router();
export const usersController = new UsersController();

// router.post('/', validateCreateUserMiddleware, usersController.createUser);
router.post('/', usersController.createUser);

router.post('/update', usersController.updateUserById);

router.put('/reset-pwrd', usersController.ResetPwrd);

router.get('/', usersController.getUsers);

router.get('/verify-ldap', usersController.verifyLdapUser);

router.get('/verify-cbs', usersController.verifyCbsUser);

router.get('/export', usersController.generateUsersExportLinks);

router.get('/export/:code', usersController.generateUsersExporData);

router.get('/one', usersController.getUserBy);

router.get('/visa-operations/all', usersController.getUserByOperations);

router.get('/labels', usersController.getUsersLabels);

router.get('/:id', usersController.findOneById);

export const usersRoute = router;
