
import { SendersController } from './senders.controller';
import express from 'express';

const router = express.Router();
export const sendersController = new SendersController();

export const sendersRoute = router;