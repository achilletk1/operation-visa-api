import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { PieceJointeService } from "./pieceJointe.service";
import { PieceJointeControllerBase } from "./base/pieceJointe.controller.base";

@swagger.ApiTags("pieceJointes")
@common.Controller("pieceJointes")
export class PieceJointeController extends PieceJointeControllerBase {
  constructor(
    protected readonly service: PieceJointeService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
