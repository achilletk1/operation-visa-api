import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as common from "@nestjs/common";
import { PieceJointeResolverBase } from "./base/pieceJointe.resolver.base";
import { PieceJointe } from "./base/PieceJointe";
import { PieceJointeService } from "./pieceJointe.service";

@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
@graphql.Resolver(() => PieceJointe)
export class PieceJointeResolver extends PieceJointeResolverBase {
  constructor(
    protected readonly service: PieceJointeService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
