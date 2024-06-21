import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { VoyageService } from "./voyage.service";
import { VoyageControllerBase } from "./base/voyage.controller.base";

@swagger.ApiTags("voyages")
@common.Controller("voyages")
export class VoyageController extends VoyageControllerBase {
  constructor(
    protected readonly service: VoyageService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
