import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
  NumberInput,
} from "react-admin";

import { CategorieTitle } from "../categorie/CategorieTitle";
import { MoisPaiementEnLigneTitle } from "../moisPaiementEnLigne/MoisPaiementEnLigneTitle";
import { UtilisateurTitle } from "../utilisateur/UtilisateurTitle";
import { VoyageTitle } from "../voyage/VoyageTitle";

export const OperationCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <ReferenceInput
          source="categorie.id"
          reference="Categorie"
          label="Categorie"
        >
          <SelectInput optionText={CategorieTitle} />
        </ReferenceInput>
        <DateTimeInput label="date" source="date" />
        <ReferenceInput
          source="moisPaiementEnLigne.id"
          reference="MoisPaiementEnLigne"
          label="moisPaiementEnLigne"
        >
          <SelectInput optionText={MoisPaiementEnLigneTitle} />
        </ReferenceInput>
        <NumberInput label="montant" source="montant" />
        <SelectInput
          source="typeField"
          label="type"
          choices={[{ label: "Option 1", value: "Option1" }]}
          optionText="label"
          allowEmpty
          optionValue="value"
        />
        <ReferenceInput
          source="utilisateur.id"
          reference="Utilisateur"
          label="utilisateur"
        >
          <SelectInput optionText={UtilisateurTitle} />
        </ReferenceInput>
        <ReferenceInput source="voyage.id" reference="Voyage" label="voyage">
          <SelectInput optionText={VoyageTitle} />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
