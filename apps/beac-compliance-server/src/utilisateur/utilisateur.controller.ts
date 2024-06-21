import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { UtilisateurService } from "./utilisateur.service";
import { UtilisateurControllerBase } from "./base/utilisateur.controller.base";

@swagger.ApiTags("utilisateurs")
@common.Controller("utilisateurs")
export class UtilisateurController extends UtilisateurControllerBase {
  constructor(
    protected readonly service: UtilisateurService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
