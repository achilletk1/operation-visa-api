import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as common from "@nestjs/common";
import { UtilisateurResolverBase } from "./base/utilisateur.resolver.base";
import { Utilisateur } from "./base/Utilisateur";
import { UtilisateurService } from "./utilisateur.service";

@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
@graphql.Resolver(() => Utilisateur)
export class UtilisateurResolver extends UtilisateurResolverBase {
  constructor(
    protected readonly service: UtilisateurService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
