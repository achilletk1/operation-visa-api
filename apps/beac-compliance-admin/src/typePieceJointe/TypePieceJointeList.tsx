import * as React from "react";
import {
  List,
  Datagrid,
  ListProps,
  DateField,
  BooleanField,
  TextField,
} from "react-admin";
import Pagination from "../Components/Pagination";

export const TypePieceJointeList = (props: ListProps): React.ReactElement => {
  return (
    <List
      {...props}
      bulkActionButtons={false}
      title={"TypePieceJointes"}
      perPage={50}
      pagination={<Pagination />}
    >
      <Datagrid rowClick="show">
        <DateField source="createdAt" label="Created At" />
        <BooleanField label="estObligatoire" source="estObligatoire" />
        <TextField label="ID" source="id" />
        <TextField label="nom" source="nom" />
        <DateField source="updatedAt" label="Updated At" />
      </Datagrid>
    </List>
  );
};
