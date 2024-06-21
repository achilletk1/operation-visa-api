import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { VoyageModuleBase } from "./base/voyage.module.base";
import { VoyageService } from "./voyage.service";
import { VoyageController } from "./voyage.controller";
import { VoyageResolver } from "./voyage.resolver";

@Module({
  imports: [VoyageModuleBase, forwardRef(() => AuthModule)],
  controllers: [VoyageController],
  providers: [VoyageService, VoyageResolver],
  exports: [VoyageService],
})
export class VoyageModule {}
