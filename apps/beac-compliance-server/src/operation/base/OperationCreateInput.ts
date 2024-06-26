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
import { CategorieWhereUniqueInput } from "../../categorie/base/CategorieWhereUniqueInput";
import {
  ValidateNested,
  IsOptional,
  IsDate,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { MoisPaiementEnLigneWhereUniqueInput } from "../../moisPaiementEnLigne/base/MoisPaiementEnLigneWhereUniqueInput";
import { EnumOperationTypeField } from "./EnumOperationTypeField";
import { UtilisateurWhereUniqueInput } from "../../utilisateur/base/UtilisateurWhereUniqueInput";
import { VoyageWhereUniqueInput } from "../../voyage/base/VoyageWhereUniqueInput";

@InputType()
class OperationCreateInput {
  @ApiProperty({
    required: false,
    type: () => CategorieWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => CategorieWhereUniqueInput)
  @IsOptional()
  @Field(() => CategorieWhereUniqueInput, {
    nullable: true,
  })
  categorie?: CategorieWhereUniqueInput | null;

  @ApiProperty({
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  date?: Date | null;

  @ApiProperty({
    required: false,
    type: () => MoisPaiementEnLigneWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => MoisPaiementEnLigneWhereUniqueInput)
  @IsOptional()
  @Field(() => MoisPaiementEnLigneWhereUniqueInput, {
    nullable: true,
  })
  moisPaiementEnLigne?: MoisPaiementEnLigneWhereUniqueInput | null;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsNumber()
  @Min(-999999999)
  @Max(999999999)
  @IsOptional()
  @Field(() => Number, {
    nullable: true,
  })
  montant?: number | null;

  @ApiProperty({
    required: false,
    enum: EnumOperationTypeField,
  })
  @IsEnum(EnumOperationTypeField)
  @IsOptional()
  @Field(() => EnumOperationTypeField, {
    nullable: true,
  })
  typeField?: "Option1" | null;

  @ApiProperty({
    required: false,
    type: () => UtilisateurWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => UtilisateurWhereUniqueInput)
  @IsOptional()
  @Field(() => UtilisateurWhereUniqueInput, {
    nullable: true,
  })
  utilisateur?: UtilisateurWhereUniqueInput | null;

  @ApiProperty({
    required: false,
    type: () => VoyageWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => VoyageWhereUniqueInput)
  @IsOptional()
  @Field(() => VoyageWhereUniqueInput, {
    nullable: true,
  })
  voyage?: VoyageWhereUniqueInput | null;
}

export { OperationCreateInput as OperationCreateInput };
