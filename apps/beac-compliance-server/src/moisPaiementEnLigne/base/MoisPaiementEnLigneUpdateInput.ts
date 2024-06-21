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
import { IsDate, IsOptional, IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { OperationUpdateManyWithoutMoisPaiementEnLignesInput } from "./OperationUpdateManyWithoutMoisPaiementEnLignesInput";
import { UtilisateurWhereUniqueInput } from "../../utilisateur/base/UtilisateurWhereUniqueInput";

@InputType()
class MoisPaiementEnLigneUpdateInput {
  @ApiProperty({
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  mois?: Date | null;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Number, {
    nullable: true,
  })
  montantTotal?: number | null;

  @ApiProperty({
    required: false,
    type: () => OperationUpdateManyWithoutMoisPaiementEnLignesInput,
  })
  @ValidateNested()
  @Type(() => OperationUpdateManyWithoutMoisPaiementEnLignesInput)
  @IsOptional()
  @Field(() => OperationUpdateManyWithoutMoisPaiementEnLignesInput, {
    nullable: true,
  })
  operations?: OperationUpdateManyWithoutMoisPaiementEnLignesInput;

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
}

export { MoisPaiementEnLigneUpdateInput as MoisPaiementEnLigneUpdateInput };
