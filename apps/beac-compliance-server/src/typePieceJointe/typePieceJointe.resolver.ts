import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as common from "@nestjs/common";
import { TypePieceJointeResolverBase } from "./base/typePieceJointe.resolver.base";
import { TypePieceJointe } from "./base/TypePieceJointe";
import { TypePieceJointeService } from "./typePieceJointe.service";

@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
@graphql.Resolver(() => TypePieceJointe)
export class TypePieceJointeResolver extends TypePieceJointeResolverBase {
  constructor(
    protected readonly service: TypePieceJointeService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
