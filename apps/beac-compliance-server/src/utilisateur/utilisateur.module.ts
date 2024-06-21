import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { UtilisateurModuleBase } from "./base/utilisateur.module.base";
import { UtilisateurService } from "./utilisateur.service";
import { UtilisateurController } from "./utilisateur.controller";
import { UtilisateurResolver } from "./utilisateur.resolver";

@Module({
  imports: [UtilisateurModuleBase, forwardRef(() => AuthModule)],
  controllers: [UtilisateurController],
  providers: [UtilisateurService, UtilisateurResolver],
  exports: [UtilisateurService],
})
export class UtilisateurModule {}
