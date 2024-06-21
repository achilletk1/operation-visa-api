import * as React from "react";

import {
  Show,
  SimpleShowLayout,
  ShowProps,
  DateField,
  TextField,
  ReferenceManyField,
  Datagrid,
  ReferenceField,
} from "react-admin";

import { CATEGORIE_TITLE_FIELD } from "./CategorieTitle";
import { MOISPAIEMENTENLIGNE_TITLE_FIELD } from "../moisPaiementEnLigne/MoisPaiementEnLigneTitle";
import { UTILISATEUR_TITLE_FIELD } from "../utilisateur/UtilisateurTitle";
import { VOYAGE_TITLE_FIELD } from "../voyage/VoyageTitle";
import { TYPEPIECEJOINTE_TITLE_FIELD } from "../typePieceJointe/TypePieceJointeTitle";

export const CategorieShow = (props: ShowProps): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <DateField source="createdAt" label="Created At" />
        <TextField label="description" source="description" />
        <TextField label="ID" source="id" />
        <TextField label="nom" source="nom" />
        <TextField label="piecesJointes" source="piecesJointes" />
        <DateField source="updatedAt" label="Updated At" />
        <ReferenceManyField
          reference="Operation"
          target="categorieId"
          label="Operations"
        >
          <Datagrid rowClick="show">
            <ReferenceField
              label="Categorie"
              source="categorie.id"
              reference="Categorie"
            >
              <TextField source={CATEGORIE_TITLE_FIELD} />
            </ReferenceField>
            <DateField source="createdAt" label="Created At" />
            <TextField label="date" source="date" />
            <TextField label="ID" source="id" />
            <ReferenceField
              label="moisPaiementEnLigne"
              source="moispaiementenligne.id"
              reference="MoisPaiementEnLigne"
            >
              <TextField source={MOISPAIEMENTENLIGNE_TITLE_FIELD} />
            </ReferenceField>
            <TextField label="montant" source="montant" />
            <TextField label="type" source="typeField" />
            <DateField source="updatedAt" label="Updated At" />
            <ReferenceField
              label="utilisateur"
              source="utilisateur.id"
              reference="Utilisateur"
            >
              <TextField source={UTILISATEUR_TITLE_FIELD} />
            </ReferenceField>
            <ReferenceField
              label="voyage"
              source="voyage.id"
              reference="Voyage"
            >
              <TextField source={VOYAGE_TITLE_FIELD} />
            </ReferenceField>
          </Datagrid>
        </ReferenceManyField>
        <ReferenceManyField
          reference="PieceJointe"
          target="categorieId"
          label="PieceJointes"
        >
          <Datagrid rowClick="show">
            <ReferenceField
              label="categorie"
              source="categorie.id"
              reference="Categorie"
            >
              <TextField source={CATEGORIE_TITLE_FIELD} />
            </ReferenceField>
            <DateField source="createdAt" label="Created At" />
            <TextField label="ID" source="id" />
            <TextField label="nomFichier" source="nomFichier" />
            <ReferenceField
              label="typePieceJointe"
              source="typepiecejointe.id"
              reference="TypePieceJointe"
            >
              <TextField source={TYPEPIECEJOINTE_TITLE_FIELD} />
            </ReferenceField>
            <DateField source="updatedAt" label="Updated At" />
            <TextField label="url" source="url" />
          </Datagrid>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};
