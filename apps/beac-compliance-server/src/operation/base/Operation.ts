/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { ObjectType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Categorie } from "../../categorie/base/Categorie";
import {
  ValidateNested,
  IsOptional,
  IsDate,
  IsString,
  IsNumber,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { MoisPaiementEnLigne } from "../../moisPaiementEnLigne/base/MoisPaiementEnLigne";
import { EnumOperationTypeField } from "./EnumOperationTypeField";
import { Utilisateur } from "../../utilisateur/base/Utilisateur";
import { Voyage } from "../../voyage/base/Voyage";

@ObjectType()
class Operation {
  @ApiProperty({
    required: false,
    type: () => Categorie,
  })
  @ValidateNested()
  @Type(() => Categorie)
  @IsOptional()
  categorie?: Categorie | null;

  @ApiProperty({
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  @Field(() => Date)
  createdAt!: Date;

  @ApiProperty({
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  date!: Date | null;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @Field(() => String)
  id!: string;

  @ApiProperty({
    required: false,
    type: () => MoisPaiementEnLigne,
  })
  @ValidateNested()
  @Type(() => MoisPaiementEnLigne)
  @IsOptional()
  moisPaiementEnLigne?: MoisPaiementEnLigne | null;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Number, {
    nullable: true,
  })
  montant!: number | null;

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
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  @Field(() => Date)
  updatedAt!: Date;

  @ApiProperty({
    required: false,
    type: () => Utilisateur,
  })
  @ValidateNested()
  @Type(() => Utilisateur)
  @IsOptional()
  utilisateur?: Utilisateur | null;

  @ApiProperty({
    required: false,
    type: () => Voyage,
  })
  @ValidateNested()
  @Type(() => Voyage)
  @IsOptional()
  voyage?: Voyage | null;
}

export { Operation as Operation };
