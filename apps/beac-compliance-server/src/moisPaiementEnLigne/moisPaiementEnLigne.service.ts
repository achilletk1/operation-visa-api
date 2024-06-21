import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MoisPaiementEnLigneServiceBase } from "./base/moisPaiementEnLigne.service.base";

@Injectable()
export class MoisPaiementEnLigneService extends MoisPaiementEnLigneServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
