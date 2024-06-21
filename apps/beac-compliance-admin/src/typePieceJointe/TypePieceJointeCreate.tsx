import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  BooleanInput,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from "react-admin";

import { PieceJointeTitle } from "../pieceJointe/PieceJointeTitle";

export const TypePieceJointeCreate = (
  props: CreateProps
): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <BooleanInput label="estObligatoire" source="estObligatoire" />
        <TextInput label="nom" source="nom" />
        <ReferenceArrayInput
          source="pieceJointes"
          reference="PieceJointe"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={PieceJointeTitle} />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};
