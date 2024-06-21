import * as React from "react";
import {
  Create,
  SimpleForm,
  CreateProps,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";
import { CategorieTitle } from "../categorie/CategorieTitle";
import { TypePieceJointeTitle } from "../typePieceJointe/TypePieceJointeTitle";

export const PieceJointeCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <ReferenceInput
          source="categorie.id"
          reference="Categorie"
          label="categorie"
        >
          <SelectInput optionText={CategorieTitle} />
        </ReferenceInput>
        <TextInput label="nomFichier" source="nomFichier" />
        <ReferenceInput
          source="typePieceJointe.id"
          reference="TypePieceJointe"
          label="typePieceJointe"
        >
          <SelectInput optionText={TypePieceJointeTitle} />
        </ReferenceInput>
        <TextInput label="url" source="url" />
      </SimpleForm>
    </Create>
  );
};
