import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { MoisPaiementEnLigneModuleBase } from "./base/moisPaiementEnLigne.module.base";
import { MoisPaiementEnLigneService } from "./moisPaiementEnLigne.service";
import { MoisPaiementEnLigneController } from "./moisPaiementEnLigne.controller";
import { MoisPaiementEnLigneResolver } from "./moisPaiementEnLigne.resolver";

@Module({
  imports: [MoisPaiementEnLigneModuleBase, forwardRef(() => AuthModule)],
  controllers: [MoisPaiementEnLigneController],
  providers: [MoisPaiementEnLigneService, MoisPaiementEnLigneResolver],
  exports: [MoisPaiementEnLigneService],
})
export class MoisPaiementEnLigneModule {}
