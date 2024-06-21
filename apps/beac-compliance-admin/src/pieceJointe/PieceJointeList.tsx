import * as React from "react";
import {
  List,
  Datagrid,
  ListProps,
  ReferenceField,
  TextField,
  DateField,
} from "react-admin";
import Pagination from "../Components/Pagination";
import { CATEGORIE_TITLE_FIELD } from "../categorie/CategorieTitle";
import { TYPEPIECEJOINTE_TITLE_FIELD } from "../typePieceJointe/TypePieceJointeTitle";

export const PieceJointeList = (props: ListProps): React.ReactElement => {
  return (
    <List
      {...props}
      bulkActionButtons={false}
      title={"PieceJointes"}
      perPage={50}
      pagination={<Pagination />}
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
    </List>
  );
};
