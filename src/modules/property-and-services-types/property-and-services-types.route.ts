import { PropertyAndServicesTypesController } from './property-and-services-types.controller';
import express from 'express';

const router = express.Router();
export const propertyAndServicesTypesController = new PropertyAndServicesTypesController();

// router.post('/', propertyAndServicesTypesController.create);

router.post('/', propertyAndServicesTypesController.insertPropertyAndServicesTypes);

router.get('/', propertyAndServicesTypesController.findAll);

router.get('/all', propertyAndServicesTypesController.findAll);

// router.put('/:id', propertyAndServicesTypesController.updateById);

router.get('/:id', propertyAndServicesTypesController.findOneById);

router.delete('/:id', propertyAndServicesTypesController.deleteById);

router.put('/:id', propertyAndServicesTypesController.updatePropertyAndServicesTypesById);

export const propertyAndServicesTypesRoute = router;