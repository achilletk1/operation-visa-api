/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { InputType, Field } from "@nestjs/graphql";
import { VoyageWhereUniqueInput } from "../../voyage/base/VoyageWhereUniqueInput";
import { ApiProperty } from "@nestjs/swagger";

@InputType()
class VoyageUpdateManyWithoutUtilisateursInput {
  @Field(() => [VoyageWhereUniqueInput], {
    nullable: true,
  })
  @ApiProperty({
    required: false,
    type: () => [VoyageWhereUniqueInput],
  })
  connect?: Array<VoyageWhereUniqueInput>;

  @Field(() => [VoyageWhereUniqueInput], {
    nullable: true,
  })
  @ApiProperty({
    required: false,
    type: () => [VoyageWhereUniqueInput],
  })
  disconnect?: Array<VoyageWhereUniqueInput>;

  @Field(() => [VoyageWhereUniqueInput], {
    nullable: true,
  })
  @ApiProperty({
    required: false,
    type: () => [VoyageWhereUniqueInput],
  })
  set?: Array<VoyageWhereUniqueInput>;
}

export { VoyageUpdateManyWithoutUtilisateursInput as VoyageUpdateManyWithoutUtilisateursInput };
