import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as common from "@nestjs/common";
import { MoisPaiementEnLigneResolverBase } from "./base/moisPaiementEnLigne.resolver.base";
import { MoisPaiementEnLigne } from "./base/MoisPaiementEnLigne";
import { MoisPaiementEnLigneService } from "./moisPaiementEnLigne.service";

@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
@graphql.Resolver(() => MoisPaiementEnLigne)
export class MoisPaiementEnLigneResolver extends MoisPaiementEnLigneResolverBase {
  constructor(
    protected readonly service: MoisPaiementEnLigneService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
