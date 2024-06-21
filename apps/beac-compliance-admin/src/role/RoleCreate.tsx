import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from "react-admin";

import { UtilisateurTitle } from "../utilisateur/UtilisateurTitle";

export const RoleCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput label="description" multiline source="description" />
        <TextInput label="nom" source="nom" />
        <ReferenceArrayInput
          source="utilisateurs"
          reference="Utilisateur"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={UtilisateurTitle} />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};
