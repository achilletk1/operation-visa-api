import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CategorieModuleBase } from "./base/categorie.module.base";
import { CategorieService } from "./categorie.service";
import { CategorieController } from "./categorie.controller";
import { CategorieResolver } from "./categorie.resolver";

@Module({
  imports: [CategorieModuleBase, forwardRef(() => AuthModule)],
  controllers: [CategorieController],
  providers: [CategorieService, CategorieResolver],
  exports: [CategorieService],
})
export class CategorieModule {}
