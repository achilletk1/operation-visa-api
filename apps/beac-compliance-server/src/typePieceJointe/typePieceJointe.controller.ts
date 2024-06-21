import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { TypePieceJointeService } from "./typePieceJointe.service";
import { TypePieceJointeControllerBase } from "./base/typePieceJointe.controller.base";

@swagger.ApiTags("typePieceJointes")
@common.Controller("typePieceJointes")
export class TypePieceJointeController extends TypePieceJointeControllerBase {
  constructor(
    protected readonly service: TypePieceJointeService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
