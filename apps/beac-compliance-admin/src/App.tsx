import React, { useEffect, useState } from "react";
import { Admin, DataProvider, Resource } from "react-admin";
import buildGraphQLProvider from "./data-provider/graphqlDataProvider";
import { theme } from "./theme/theme";
import Login from "./Login";
import "./App.scss";
import Dashboard from "./pages/Dashboard";
import { RoleList } from "./role/RoleList";
import { RoleCreate } from "./role/RoleCreate";
import { RoleEdit } from "./role/RoleEdit";
import { RoleShow } from "./role/RoleShow";
import { UtilisateurList } from "./utilisateur/UtilisateurList";
import { UtilisateurCreate } from "./utilisateur/UtilisateurCreate";
import { UtilisateurEdit } from "./utilisateur/UtilisateurEdit";
import { UtilisateurShow } from "./utilisateur/UtilisateurShow";
import { CategorieList } from "./categorie/CategorieList";
import { CategorieCreate } from "./categorie/CategorieCreate";
import { CategorieEdit } from "./categorie/CategorieEdit";
import { CategorieShow } from "./categorie/CategorieShow";
import { OperationList } from "./operation/OperationList";
import { OperationCreate } from "./operation/OperationCreate";
import { OperationEdit } from "./operation/OperationEdit";
import { OperationShow } from "./operation/OperationShow";
import { TypePieceJointeList } from "./typePieceJointe/TypePieceJointeList";
import { TypePieceJointeCreate } from "./typePieceJointe/TypePieceJointeCreate";
import { TypePieceJointeEdit } from "./typePieceJointe/TypePieceJointeEdit";
import { TypePieceJointeShow } from "./typePieceJointe/TypePieceJointeShow";
import { PieceJointeList } from "./pieceJointe/PieceJointeList";
import { PieceJointeCreate } from "./pieceJointe/PieceJointeCreate";
import { PieceJointeEdit } from "./pieceJointe/PieceJointeEdit";
import { PieceJointeShow } from "./pieceJointe/PieceJointeShow";
import { UserList } from "./user/UserList";
import { UserCreate } from "./user/UserCreate";
import { UserEdit } from "./user/UserEdit";
import { UserShow } from "./user/UserShow";
import { MoisPaiementEnLigneList } from "./moisPaiementEnLigne/MoisPaiementEnLigneList";
import { MoisPaiementEnLigneCreate } from "./moisPaiementEnLigne/MoisPaiementEnLigneCreate";
import { MoisPaiementEnLigneEdit } from "./moisPaiementEnLigne/MoisPaiementEnLigneEdit";
import { MoisPaiementEnLigneShow } from "./moisPaiementEnLigne/MoisPaiementEnLigneShow";
import { VoyageList } from "./voyage/VoyageList";
import { VoyageCreate } from "./voyage/VoyageCreate";
import { VoyageEdit } from "./voyage/VoyageEdit";
import { VoyageShow } from "./voyage/VoyageShow";
import { jwtAuthProvider } from "./auth-provider/ra-auth-jwt";

const App = (): React.ReactElement => {
  const [dataProvider, setDataProvider] = useState<DataProvider | null>(null);
  useEffect(() => {
    buildGraphQLProvider
      .then((provider: any) => {
        setDataProvider(() => provider);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);
  if (!dataProvider) {
    return <div>Loading</div>;
  }
  return (
    <div className="App">
      <Admin
        title={"BEAC Compliance"}
        dataProvider={dataProvider}
        authProvider={jwtAuthProvider}
        theme={theme}
        dashboard={Dashboard}
        loginPage={Login}
      >
        <Resource
          name="Role"
          list={RoleList}
          edit={RoleEdit}
          create={RoleCreate}
          show={RoleShow}
        />
        <Resource
          name="Utilisateur"
          list={UtilisateurList}
          edit={UtilisateurEdit}
          create={UtilisateurCreate}
          show={UtilisateurShow}
        />
        <Resource
          name="Categorie"
          list={CategorieList}
          edit={CategorieEdit}
          create={CategorieCreate}
          show={CategorieShow}
        />
        <Resource
          name="Operation"
          list={OperationList}
          edit={OperationEdit}
          create={OperationCreate}
          show={OperationShow}
        />
        <Resource
          name="TypePieceJointe"
          list={TypePieceJointeList}
          edit={TypePieceJointeEdit}
          create={TypePieceJointeCreate}
          show={TypePieceJointeShow}
        />
        <Resource
          name="PieceJointe"
          list={PieceJointeList}
          edit={PieceJointeEdit}
          create={PieceJointeCreate}
          show={PieceJointeShow}
        />
        <Resource
          name="User"
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
          show={UserShow}
        />
        <Resource
          name="MoisPaiementEnLigne"
          list={MoisPaiementEnLigneList}
          edit={MoisPaiementEnLigneEdit}
          create={MoisPaiementEnLigneCreate}
          show={MoisPaiementEnLigneShow}
        />
        <Resource
          name="Voyage"
          list={VoyageList}
          edit={VoyageEdit}
          create={VoyageCreate}
          show={VoyageShow}
        />
      </Admin>
    </div>
  );
};

export default App;
