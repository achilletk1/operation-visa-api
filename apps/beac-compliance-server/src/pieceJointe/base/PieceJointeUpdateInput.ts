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
import { ValidateNested, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { TypePieceJointeWhereUniqueInput } from "../../typePieceJointe/base/TypePieceJointeWhereUniqueInput";

@InputType()
class PieceJointeUpdateInput {
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
    type: String,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  nomFichier?: string | null;

  @ApiProperty({
    required: false,
    type: () => TypePieceJointeWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => TypePieceJointeWhereUniqueInput)
  @IsOptional()
  @Field(() => TypePieceJointeWhereUniqueInput, {
    nullable: true,
  })
  typePieceJointe?: TypePieceJointeWhereUniqueInput | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  url?: string | null;
}

export { PieceJointeUpdateInput as PieceJointeUpdateInput };