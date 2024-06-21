import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from "react-admin";

import { OperationTitle } from "../operation/OperationTitle";
import { PieceJointeTitle } from "../pieceJointe/PieceJointeTitle";

export const CategorieCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput label="description" multiline source="description" />
        <TextInput label="nom" source="nom" />
        <ReferenceArrayInput
          source="operations"
          reference="Operation"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={OperationTitle} />
        </ReferenceArrayInput>
        <ReferenceArrayInput
          source="pieceJointes"
          reference="PieceJointe"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={PieceJointeTitle} />
        </ReferenceArrayInput>
        <TextInput label="piecesJointes" source="piecesJointes" />
      </SimpleForm>
    </Create>
  );
};
