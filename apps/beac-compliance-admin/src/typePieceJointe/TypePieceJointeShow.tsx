import * as React from "react";

import {
  Show,
  SimpleShowLayout,
  ShowProps,
  DateField,
  BooleanField,
  TextField,
  ReferenceManyField,
  Datagrid,
  ReferenceField,
} from "react-admin";

import { CATEGORIE_TITLE_FIELD } from "../categorie/CategorieTitle";
import { TYPEPIECEJOINTE_TITLE_FIELD } from "./TypePieceJointeTitle";

export const TypePieceJointeShow = (props: ShowProps): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <DateField source="createdAt" label="Created At" />
        <BooleanField label="estObligatoire" source="estObligatoire" />
        <TextField label="ID" source="id" />
        <TextField label="nom" source="nom" />
        <DateField source="updatedAt" label="Updated At" />
        <ReferenceManyField
          reference="PieceJointe"
          target="typePieceJointeId"
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
