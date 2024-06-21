/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { InputType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, ValidateNested } from "class-validator";
import { MoisPaiementEnLigneCreateNestedManyWithoutUtilisateursInput } from "./MoisPaiementEnLigneCreateNestedManyWithoutUtilisateursInput";
import { Type } from "class-transformer";
import { OperationCreateNestedManyWithoutUtilisateursInput } from "./OperationCreateNestedManyWithoutUtilisateursInput";
import { RoleWhereUniqueInput } from "../../role/base/RoleWhereUniqueInput";
import { VoyageCreateNestedManyWithoutUtilisateursInput } from "./VoyageCreateNestedManyWithoutUtilisateursInput";

@InputType()
class UtilisateurCreateInput {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  email?: string | null;

  @ApiProperty({
    required: false,
    type: () => MoisPaiementEnLigneCreateNestedManyWithoutUtilisateursInput,
  })
  @ValidateNested()
  @Type(() => MoisPaiementEnLigneCreateNestedManyWithoutUtilisateursInput)
  @IsOptional()
  @Field(() => MoisPaiementEnLigneCreateNestedManyWithoutUtilisateursInput, {
    nullable: true,
  })
  moisPaiementEnLignes?: MoisPaiementEnLigneCreateNestedManyWithoutUtilisateursInput;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  motDePasse?: string | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  nom?: string | null;

  @ApiProperty({
    required: false,
    type: () => OperationCreateNestedManyWithoutUtilisateursInput,
  })
  @ValidateNested()
  @Type(() => OperationCreateNestedManyWithoutUtilisateursInput)
  @IsOptional()
  @Field(() => OperationCreateNestedManyWithoutUtilisateursInput, {
    nullable: true,
  })
  operations?: OperationCreateNestedManyWithoutUtilisateursInput;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  prenom?: string | null;

  @ApiProperty({
    required: false,
    type: () => RoleWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => RoleWhereUniqueInput)
  @IsOptional()
  @Field(() => RoleWhereUniqueInput, {
    nullable: true,
  })
  role?: RoleWhereUniqueInput | null;

  @ApiProperty({
    required: false,
    type: () => VoyageCreateNestedManyWithoutUtilisateursInput,
  })
  @ValidateNested()
  @Type(() => VoyageCreateNestedManyWithoutUtilisateursInput)
  @IsOptional()
  @Field(() => VoyageCreateNestedManyWithoutUtilisateursInput, {
    nullable: true,
  })
  voyages?: VoyageCreateNestedManyWithoutUtilisateursInput;
}

export { UtilisateurCreateInput as UtilisateurCreateInput };
