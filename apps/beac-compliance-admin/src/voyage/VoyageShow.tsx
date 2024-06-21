import * as React from "react";

import {
  Show,
  SimpleShowLayout,
  ShowProps,
  DateField,
  TextField,
  ReferenceField,
  ReferenceManyField,
  Datagrid,
} from "react-admin";

import { CATEGORIE_TITLE_FIELD } from "../categorie/CategorieTitle";
import { MOISPAIEMENTENLIGNE_TITLE_FIELD } from "../moisPaiementEnLigne/MoisPaiementEnLigneTitle";
import { UTILISATEUR_TITLE_FIELD } from "../utilisateur/UtilisateurTitle";
import { VOYAGE_TITLE_FIELD } from "./VoyageTitle";

export const VoyageShow = (props: ShowProps): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <DateField source="createdAt" label="Created At" />
        <TextField label="dateDepart" source="dateDepart" />
        <TextField label="dateRetour" source="dateRetour" />
        <TextField label="ID" source="id" />
        <DateField source="updatedAt" label="Updated At" />
        <ReferenceField
          label="utilisateur"
          source="utilisateur.id"
          reference="Utilisateur"
        >
          <TextField source={UTILISATEUR_TITLE_FIELD} />
        </ReferenceField>
        <ReferenceManyField
          reference="Operation"
          target="voyageId"
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
      </SimpleShowLayout>
    </Show>
  );
};
