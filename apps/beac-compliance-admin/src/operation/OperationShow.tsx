import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  ShowProps,
  ReferenceField,
  TextField,
  DateField,
} from "react-admin";
import { CATEGORIE_TITLE_FIELD } from "../categorie/CategorieTitle";
import { MOISPAIEMENTENLIGNE_TITLE_FIELD } from "../moisPaiementEnLigne/MoisPaiementEnLigneTitle";
import { UTILISATEUR_TITLE_FIELD } from "../utilisateur/UtilisateurTitle";
import { VOYAGE_TITLE_FIELD } from "../voyage/VoyageTitle";

export const OperationShow = (props: ShowProps): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
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
        <ReferenceField label="voyage" source="voyage.id" reference="Voyage">
          <TextField source={VOYAGE_TITLE_FIELD} />
        </ReferenceField>
      </SimpleShowLayout>
    </Show>
  );
};
