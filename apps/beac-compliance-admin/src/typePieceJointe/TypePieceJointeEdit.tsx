import * as React from "react";

import {
  Edit,
  SimpleForm,
  EditProps,
  BooleanInput,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from "react-admin";

import { PieceJointeTitle } from "../pieceJointe/PieceJointeTitle";

export const TypePieceJointeEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
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
    </Edit>
  );
};
