import { Express } from 'express';
import {
  usersRoute, authRoute, travelRoute, exportRoute, sendersRoute, lettersRoute, vouchersRoute, settingsRoute,
  reportingRoute, downloadsRoute, templatesRoute, validationsRoute, travelMonthRoute, notificationsRoute,
  onlinePaymentRoute, visaOperationsRoute, temporaryFilesRoute, longTravelTypesRoute, visaTransactionsRoute,
  visaTransactionsFilesRoute, requestCeilingIncreaseRoute, visaTransactionsCeilingsRoute, propertyAndServicesTypesRoute,
  validationLevelSettingsRoute, importersRoute, cbsRoute
} from 'modules';

const routes = (app: Express) => {

  app.use( "/cbs", cbsRoute);

  app.use( "/auth", authRoute);

  app.use( "/users", usersRoute);

  app.use( "/export", exportRoute);
  
  app.use( "/travels", travelRoute);

  app.use( "/senders", sendersRoute);

  app.use( "/letters", lettersRoute);

  app.use( "/vouchers", vouchersRoute);

  app.use( "/settings", settingsRoute);

  app.use( "/reporting", reportingRoute);

  app.use( "/downloads", downloadsRoute);

  app.use( "/templates", templatesRoute);

  app.use( "/importers", importersRoute);

  app.use( "/validations", validationsRoute);

  app.use( "/travel-month", travelMonthRoute);

  app.use( "/notifications", notificationsRoute);

  app.use( "/online-payment", onlinePaymentRoute);

  app.use( "/visa-operations", visaOperationsRoute);

  app.use( "/temporary-files", temporaryFilesRoute);

  app.use( "/long-travel-types", longTravelTypesRoute);

  app.use( "/visa-transactions", visaTransactionsRoute);

  app.use( "/visa-transactions-files", visaTransactionsFilesRoute);

  app.use( "/request-ceiling-increase", requestCeilingIncreaseRoute);

  app.use( "/visa-transactions-ceilings", visaTransactionsCeilingsRoute);

  app.use( "/properties-and-services-types", propertyAndServicesTypesRoute);
  
  app.use( "/validation-level-settings", validationLevelSettingsRoute);

};

export default routes;
