import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UtilisateurServiceBase } from "./base/utilisateur.service.base";

@Injectable()
export class UtilisateurService extends UtilisateurServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
