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
import {
  IsDate,
  IsString,
  IsOptional,
  ValidateNested,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";
import { MoisPaiementEnLigne } from "../../moisPaiementEnLigne/base/MoisPaiementEnLigne";
import { Operation } from "../../operation/base/Operation";
import { Role } from "../../role/base/Role";
import { Voyage } from "../../voyage/base/Voyage";

@ObjectType()
class Utilisateur {
  @ApiProperty({
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  @Field(() => Date)
  createdAt!: Date;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  email!: string | null;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @Field(() => String)
  id!: string;

  @ApiProperty({
    required: false,
    type: () => [MoisPaiementEnLigne],
  })
  @ValidateNested()
  @Type(() => MoisPaiementEnLigne)
  @IsOptional()
  moisPaiementEnLignes?: Array<MoisPaiementEnLigne>;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  motDePasse!: string | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  nom!: string | null;

  @ApiProperty({
    required: false,
    type: () => [Operation],
  })
  @ValidateNested()
  @Type(() => Operation)
  @IsOptional()
  operations?: Array<Operation>;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  prenom!: string | null;

  @ApiProperty({
    required: false,
    type: () => Role,
  })
  @ValidateNested()
  @Type(() => Role)
  @IsOptional()
  role?: Role | null;

  @ApiProperty({
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  @Field(() => Date)
  updatedAt!: Date;

  @ApiProperty({
    required: false,
    type: () => [Voyage],
  })
  @ValidateNested()
  @Type(() => Voyage)
  @IsOptional()
  voyages?: Array<Voyage>;
}

export { Utilisateur as Utilisateur };
