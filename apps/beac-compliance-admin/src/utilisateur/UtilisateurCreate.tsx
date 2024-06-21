import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";

import { MoisPaiementEnLigneTitle } from "../moisPaiementEnLigne/MoisPaiementEnLigneTitle";
import { OperationTitle } from "../operation/OperationTitle";
import { RoleTitle } from "../role/RoleTitle";
import { VoyageTitle } from "../voyage/VoyageTitle";

export const UtilisateurCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput label="email" source="email" type="email" />
        <ReferenceArrayInput
          source="moisPaiementEnLignes"
          reference="MoisPaiementEnLigne"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={MoisPaiementEnLigneTitle} />
        </ReferenceArrayInput>
        <TextInput label="motDePasse" source="motDePasse" />
        <TextInput label="nom" source="nom" />
        <ReferenceArrayInput
          source="operations"
          reference="Operation"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={OperationTitle} />
        </ReferenceArrayInput>
        <TextInput label="prenom" source="prenom" />
        <ReferenceInput source="role.id" reference="Role" label="role">
          <SelectInput optionText={RoleTitle} />
        </ReferenceInput>
        <ReferenceArrayInput
          source="voyages"
          reference="Voyage"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={VoyageTitle} />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};
