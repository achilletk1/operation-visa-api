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
import { DateTimeNullableFilter } from "../../util/DateTimeNullableFilter";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { StringFilter } from "../../util/StringFilter";
import { OperationListRelationFilter } from "../../operation/base/OperationListRelationFilter";
import { UtilisateurWhereUniqueInput } from "../../utilisateur/base/UtilisateurWhereUniqueInput";

@InputType()
class VoyageWhereInput {
  @ApiProperty({
    required: false,
    type: DateTimeNullableFilter,
  })
  @Type(() => DateTimeNullableFilter)
  @IsOptional()
  @Field(() => DateTimeNullableFilter, {
    nullable: true,
  })
  dateDepart?: DateTimeNullableFilter;

  @ApiProperty({
    required: false,
    type: DateTimeNullableFilter,
  })
  @Type(() => DateTimeNullableFilter)
  @IsOptional()
  @Field(() => DateTimeNullableFilter, {
    nullable: true,
  })
  dateRetour?: DateTimeNullableFilter;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsOptional()
  @Field(() => StringFilter, {
    nullable: true,
  })
  id?: StringFilter;

  @ApiProperty({
    required: false,
    type: () => OperationListRelationFilter,
  })
  @ValidateNested()
  @Type(() => OperationListRelationFilter)
  @IsOptional()
  @Field(() => OperationListRelationFilter, {
    nullable: true,
  })
  operations?: OperationListRelationFilter;

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
  utilisateur?: UtilisateurWhereUniqueInput;
}

export { VoyageWhereInput as VoyageWhereInput };
