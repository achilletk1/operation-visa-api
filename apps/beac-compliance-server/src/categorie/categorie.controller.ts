import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { CategorieService } from "./categorie.service";
import { CategorieControllerBase } from "./base/categorie.controller.base";

@swagger.ApiTags("categories")
@common.Controller("categories")
export class CategorieController extends CategorieControllerBase {
  constructor(
    protected readonly service: CategorieService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
