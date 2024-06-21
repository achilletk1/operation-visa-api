import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { MoisPaiementEnLigneService } from "./moisPaiementEnLigne.service";
import { MoisPaiementEnLigneControllerBase } from "./base/moisPaiementEnLigne.controller.base";

@swagger.ApiTags("moisPaiementEnLignes")
@common.Controller("moisPaiementEnLignes")
export class MoisPaiementEnLigneController extends MoisPaiementEnLigneControllerBase {
  constructor(
    protected readonly service: MoisPaiementEnLigneService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
