/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import * as graphql from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { isRecordNotFoundError } from "../../prisma.util";
import { MetaQueryPayload } from "../../util/MetaQueryPayload";
import * as nestAccessControl from "nest-access-control";
import * as gqlACGuard from "../../auth/gqlAC.guard";
import { GqlDefaultAuthGuard } from "../../auth/gqlDefaultAuth.guard";
import * as common from "@nestjs/common";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { TypePieceJointe } from "./TypePieceJointe";
import { TypePieceJointeCountArgs } from "./TypePieceJointeCountArgs";
import { TypePieceJointeFindManyArgs } from "./TypePieceJointeFindManyArgs";
import { TypePieceJointeFindUniqueArgs } from "./TypePieceJointeFindUniqueArgs";
import { CreateTypePieceJointeArgs } from "./CreateTypePieceJointeArgs";
import { UpdateTypePieceJointeArgs } from "./UpdateTypePieceJointeArgs";
import { DeleteTypePieceJointeArgs } from "./DeleteTypePieceJointeArgs";
import { PieceJointeFindManyArgs } from "../../pieceJointe/base/PieceJointeFindManyArgs";
import { PieceJointe } from "../../pieceJointe/base/PieceJointe";
import { TypePieceJointeService } from "../typePieceJointe.service";
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
@graphql.Resolver(() => TypePieceJointe)
export class TypePieceJointeResolverBase {
  constructor(
    protected readonly service: TypePieceJointeService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @graphql.Query(() => MetaQueryPayload)
  @nestAccessControl.UseRoles({
    resource: "TypePieceJointe",
    action: "read",
    possession: "any",
  })
  async _typePieceJointesMeta(
    @graphql.Args() args: TypePieceJointeCountArgs
  ): Promise<MetaQueryPayload> {
    const result = await this.service.count(args);
    return {
      count: result,
    };
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.Query(() => [TypePieceJointe])
  @nestAccessControl.UseRoles({
    resource: "TypePieceJointe",
    action: "read",
    possession: "any",
  })
  async typePieceJointes(
    @graphql.Args() args: TypePieceJointeFindManyArgs
  ): Promise<TypePieceJointe[]> {
    return this.service.typePieceJointes(args);
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.Query(() => TypePieceJointe, { nullable: true })
  @nestAccessControl.UseRoles({
    resource: "TypePieceJointe",
    action: "read",
    possession: "own",
  })
  async typePieceJointe(
    @graphql.Args() args: TypePieceJointeFindUniqueArgs
  ): Promise<TypePieceJointe | null> {
    const result = await this.service.typePieceJointe(args);
    if (result === null) {
      return null;
    }
    return result;
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => TypePieceJointe)
  @nestAccessControl.UseRoles({
    resource: "TypePieceJointe",
    action: "create",
    possession: "any",
  })
  async createTypePieceJointe(
    @graphql.Args() args: CreateTypePieceJointeArgs
  ): Promise<TypePieceJointe> {
    return await this.service.createTypePieceJointe({
      ...args,
      data: args.data,
    });
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => TypePieceJointe)
  @nestAccessControl.UseRoles({
    resource: "TypePieceJointe",
    action: "update",
    possession: "any",
  })
  async updateTypePieceJointe(
    @graphql.Args() args: UpdateTypePieceJointeArgs
  ): Promise<TypePieceJointe | null> {
    try {
      return await this.service.updateTypePieceJointe({
        ...args,
        data: args.data,
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new GraphQLError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }

  @graphql.Mutation(() => TypePieceJointe)
  @nestAccessControl.UseRoles({
    resource: "TypePieceJointe",
    action: "delete",
    possession: "any",
  })
  async deleteTypePieceJointe(
    @graphql.Args() args: DeleteTypePieceJointeArgs
  ): Promise<TypePieceJointe | null> {
    try {
      return await this.service.deleteTypePieceJointe(args);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new GraphQLError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.ResolveField(() => [PieceJointe], { name: "pieceJointes" })
  @nestAccessControl.UseRoles({
    resource: "PieceJointe",
    action: "read",
    possession: "any",
  })
  async findPieceJointes(
    @graphql.Parent() parent: TypePieceJointe,
    @graphql.Args() args: PieceJointeFindManyArgs
  ): Promise<PieceJointe[]> {
    const results = await this.service.findPieceJointes(parent.id, args);

    if (!results) {
      return [];
    }

    return results;
  }
}