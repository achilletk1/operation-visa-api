import { PropertyAndServicesTypesController } from './property-and-services-types.controller';
import express from 'express';

const router = express.Router();
export const propertyAndServicesTypesController = new PropertyAndServicesTypesController();

// router.post('/', propertyAndServicesTypesController.create);

router.post('/', propertyAndServicesTypesController.insertPropertyAndServicesTypes);

router.get('/', propertyAndServicesTypesController.findAll);

router.get('/all', propertyAndServicesTypesController.findAll);

router.get('/:id', propertyAndServicesTypesController.findOneById);

// router.put('/:id', propertyAndServicesTypesController.updateById);

router.put('/:id', propertyAndServicesTypesController.updatePropertyAndServicesTypesById);

export const propertyAndServicesTypesRoute = router;