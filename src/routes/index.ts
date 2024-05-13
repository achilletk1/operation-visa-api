import { Express } from 'express';
import {
  usersRoute, authRoute, travelRoute, exportRoute, sendersRoute, lettersRoute, vouchersRoute, settingsRoute,
  reportingRoute, downloadsRoute, templatesRoute, validationsRoute, travelMonthRoute, notificationsRoute,
  onlinePaymentRoute, visaOperationsRoute, temporaryFilesRoute, longTravelTypesRoute, visaTransactionsRoute,
  visaTransactionsFilesRoute, requestCeilingIncreaseRoute, visaTransactionsCeilingsRoute, propertyAndServicesTypesRoute,
  validationLevelSettingsRoute, cbsRoute, importsRoute, cardTypeRoute, transactionTypesRoute, visaRecapOperationRoute,
  bankAccountManagerRoute, transferStakeholderRoute, transferDocumentarRoute
} from 'modules';

const routes = (app: Express) => {

  app.use( "/cbs", cbsRoute);

  app.use( "/auth", authRoute);

  app.use( "/users", usersRoute);
  
  app.use( "/export", exportRoute);
  
  app.use( "/travels", travelRoute);
  
  app.use( "/imports", importsRoute);
  
  app.use( "/senders", sendersRoute);
  
  app.use( "/letters", lettersRoute);
  
  app.use( "/vouchers", vouchersRoute);
  
  app.use( "/settings", settingsRoute);
  
  app.use( "/card-type", cardTypeRoute);
  
  app.use( "/reporting", reportingRoute);
  
  app.use( "/downloads", downloadsRoute);
  
  app.use( "/templates", templatesRoute);
  
  app.use( "/validations", validationsRoute);
  
  app.use( "/travel-month", travelMonthRoute);
  
  app.use( "/notifications", notificationsRoute);
  
  app.use( "/online-payment", onlinePaymentRoute);
  
  app.use( "/visa-operations", visaOperationsRoute);
  
  app.use( "/temporary-files", temporaryFilesRoute);
  
  app.use( "/long-travel-types", longTravelTypesRoute);
  
  app.use( "/visa-transactions", visaTransactionsRoute);
  
  app.use( "/transaction-types", transactionTypesRoute);
  
  app.use( "/visa-recap-operation", visaRecapOperationRoute);
  
  app.use( "/bank-account-manager", bankAccountManagerRoute);

  app.use( "/transfer-stakeholder", transferStakeholderRoute);

  app.use('/transfer-and-documentary', transferDocumentarRoute)

  app.use( "/visa-transactions-files", visaTransactionsFilesRoute);

  app.use( "/request-ceiling-increase", requestCeilingIncreaseRoute);

  app.use( "/validation-level-settings", validationLevelSettingsRoute);

  app.use( "/visa-transactions-ceilings", visaTransactionsCeilingsRoute);

  app.use( "/properties-and-services-types", propertyAndServicesTypesRoute);

};

export default routes;
