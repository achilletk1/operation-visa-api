import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PieceJointeModuleBase } from "./base/pieceJointe.module.base";
import { PieceJointeService } from "./pieceJointe.service";
import { PieceJointeController } from "./pieceJointe.controller";
import { PieceJointeResolver } from "./pieceJointe.resolver";

@Module({
  imports: [PieceJointeModuleBase, forwardRef(() => AuthModule)],
  controllers: [PieceJointeController],
  providers: [PieceJointeService, PieceJointeResolver],
  exports: [PieceJointeService],
})
export class PieceJointeModule {}
