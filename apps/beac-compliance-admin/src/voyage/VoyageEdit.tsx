import * as React from "react";

import {
  Edit,
  SimpleForm,
  EditProps,
  DateTimeInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";

import { OperationTitle } from "../operation/OperationTitle";
import { UtilisateurTitle } from "../utilisateur/UtilisateurTitle";

export const VoyageEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <DateTimeInput label="dateDepart" source="dateDepart" />
        <DateTimeInput label="dateRetour" source="dateRetour" />
        <ReferenceArrayInput
          source="operations"
          reference="Operation"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={OperationTitle} />
        </ReferenceArrayInput>
        <ReferenceInput
          source="utilisateur.id"
          reference="Utilisateur"
          label="utilisateur"
        >
          <SelectInput optionText={UtilisateurTitle} />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
};
