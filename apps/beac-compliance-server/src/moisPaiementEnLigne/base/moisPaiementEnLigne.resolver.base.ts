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
import { MoisPaiementEnLigne } from "./MoisPaiementEnLigne";
import { MoisPaiementEnLigneCountArgs } from "./MoisPaiementEnLigneCountArgs";
import { MoisPaiementEnLigneFindManyArgs } from "./MoisPaiementEnLigneFindManyArgs";
import { MoisPaiementEnLigneFindUniqueArgs } from "./MoisPaiementEnLigneFindUniqueArgs";
import { CreateMoisPaiementEnLigneArgs } from "./CreateMoisPaiementEnLigneArgs";
import { UpdateMoisPaiementEnLigneArgs } from "./UpdateMoisPaiementEnLigneArgs";
import { DeleteMoisPaiementEnLigneArgs } from "./DeleteMoisPaiementEnLigneArgs";
import { OperationFindManyArgs } from "../../operation/base/OperationFindManyArgs";
import { Operation } from "../../operation/base/Operation";
import { Utilisateur } from "../../utilisateur/base/Utilisateur";
import { MoisPaiementEnLigneService } from "../moisPaiementEnLigne.service";
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
@graphql.Resolver(() => MoisPaiementEnLigne)
export class MoisPaiementEnLigneResolverBase {
  constructor(
    protected readonly service: MoisPaiementEnLigneService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @graphql.Query(() => MetaQueryPayload)
  @nestAccessControl.UseRoles({
    resource: "MoisPaiementEnLigne",
    action: "read",
    possession: "any",
  })
  async _moisPaiementEnLignesMeta(
    @graphql.Args() args: MoisPaiementEnLigneCountArgs
  ): Promise<MetaQueryPayload> {
    const result = await this.service.count(args);
    return {
      count: result,
    };
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.Query(() => [MoisPaiementEnLigne])
  @nestAccessControl.UseRoles({
    resource: "MoisPaiementEnLigne",
    action: "read",
    possession: "any",
  })
  async moisPaiementEnLignes(
    @graphql.Args() args: MoisPaiementEnLigneFindManyArgs
  ): Promise<MoisPaiementEnLigne[]> {
    return this.service.moisPaiementEnLignes(args);
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.Query(() => MoisPaiementEnLigne, { nullable: true })
  @nestAccessControl.UseRoles({
    resource: "MoisPaiementEnLigne",
    action: "read",
    possession: "own",
  })
  async moisPaiementEnLigne(
    @graphql.Args() args: MoisPaiementEnLigneFindUniqueArgs
  ): Promise<MoisPaiementEnLigne | null> {
    const result = await this.service.moisPaiementEnLigne(args);
    if (result === null) {
      return null;
    }
    return result;
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => MoisPaiementEnLigne)
  @nestAccessControl.UseRoles({
    resource: "MoisPaiementEnLigne",
    action: "create",
    possession: "any",
  })
  async createMoisPaiementEnLigne(
    @graphql.Args() args: CreateMoisPaiementEnLigneArgs
  ): Promise<MoisPaiementEnLigne> {
    return await this.service.createMoisPaiementEnLigne({
      ...args,
      data: {
        ...args.data,

        utilisateur: args.data.utilisateur
          ? {
              connect: args.data.utilisateur,
            }
          : undefined,
      },
    });
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => MoisPaiementEnLigne)
  @nestAccessControl.UseRoles({
    resource: "MoisPaiementEnLigne",
    action: "update",
    possession: "any",
  })
  async updateMoisPaiementEnLigne(
    @graphql.Args() args: UpdateMoisPaiementEnLigneArgs
  ): Promise<MoisPaiementEnLigne | null> {
    try {
      return await this.service.updateMoisPaiementEnLigne({
        ...args,
        data: {
          ...args.data,

          utilisateur: args.data.utilisateur
            ? {
                connect: args.data.utilisateur,
              }
            : undefined,
        },
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

  @graphql.Mutation(() => MoisPaiementEnLigne)
  @nestAccessControl.UseRoles({
    resource: "MoisPaiementEnLigne",
    action: "delete",
    possession: "any",
  })
  async deleteMoisPaiementEnLigne(
    @graphql.Args() args: DeleteMoisPaiementEnLigneArgs
  ): Promise<MoisPaiementEnLigne | null> {
    try {
      return await this.service.deleteMoisPaiementEnLigne(args);
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
  @graphql.ResolveField(() => [Operation], { name: "operations" })
  @nestAccessControl.UseRoles({
    resource: "Operation",
    action: "read",
    possession: "any",
  })
  async findOperations(
    @graphql.Parent() parent: MoisPaiementEnLigne,
    @graphql.Args() args: OperationFindManyArgs
  ): Promise<Operation[]> {
    const results = await this.service.findOperations(parent.id, args);

    if (!results) {
      return [];
    }

    return results;
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.ResolveField(() => Utilisateur, {
    nullable: true,
    name: "utilisateur",
  })
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "read",
    possession: "any",
  })
  async getUtilisateur(
    @graphql.Parent() parent: MoisPaiementEnLigne
  ): Promise<Utilisateur | null> {
    const result = await this.service.getUtilisateur(parent.id);

    if (!result) {
      return null;
    }
    return result;
  }
}
