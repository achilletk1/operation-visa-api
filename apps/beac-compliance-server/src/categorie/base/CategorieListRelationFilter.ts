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
import { CategorieWhereInput } from "./CategorieWhereInput";
import { ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";

@InputType()
class CategorieListRelationFilter {
  @ApiProperty({
    required: false,
    type: () => CategorieWhereInput,
  })
  @ValidateNested()
  @Type(() => CategorieWhereInput)
  @IsOptional()
  @Field(() => CategorieWhereInput, {
    nullable: true,
  })
  every?: CategorieWhereInput;

  @ApiProperty({
    required: false,
    type: () => CategorieWhereInput,
  })
  @ValidateNested()
  @Type(() => CategorieWhereInput)
  @IsOptional()
  @Field(() => CategorieWhereInput, {
    nullable: true,
  })
  some?: CategorieWhereInput;

  @ApiProperty({
    required: false,
    type: () => CategorieWhereInput,
  })
  @ValidateNested()
  @Type(() => CategorieWhereInput)
  @IsOptional()
  @Field(() => CategorieWhereInput, {
    nullable: true,
  })
  none?: CategorieWhereInput;
}
export { CategorieListRelationFilter as CategorieListRelationFilter };