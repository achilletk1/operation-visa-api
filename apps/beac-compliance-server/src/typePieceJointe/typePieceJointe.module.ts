import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TypePieceJointeModuleBase } from "./base/typePieceJointe.module.base";
import { TypePieceJointeService } from "./typePieceJointe.service";
import { TypePieceJointeController } from "./typePieceJointe.controller";
import { TypePieceJointeResolver } from "./typePieceJointe.resolver";

@Module({
  imports: [TypePieceJointeModuleBase, forwardRef(() => AuthModule)],
  controllers: [TypePieceJointeController],
  providers: [TypePieceJointeService, TypePieceJointeResolver],
  exports: [TypePieceJointeService],
})
export class TypePieceJointeModule {}
