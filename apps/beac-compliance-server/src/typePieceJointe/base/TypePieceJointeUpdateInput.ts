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
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { PieceJointeUpdateManyWithoutTypePieceJointesInput } from "./PieceJointeUpdateManyWithoutTypePieceJointesInput";
import { Type } from "class-transformer";

@InputType()
class TypePieceJointeUpdateInput {
  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, {
    nullable: true,
  })
  estObligatoire?: boolean | null;

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
  nom?: string | null;

  @ApiProperty({
    required: false,
    type: () => PieceJointeUpdateManyWithoutTypePieceJointesInput,
  })
  @ValidateNested()
  @Type(() => PieceJointeUpdateManyWithoutTypePieceJointesInput)
  @IsOptional()
  @Field(() => PieceJointeUpdateManyWithoutTypePieceJointesInput, {
    nullable: true,
  })
  pieceJointes?: PieceJointeUpdateManyWithoutTypePieceJointesInput;
}

export { TypePieceJointeUpdateInput as TypePieceJointeUpdateInput };
