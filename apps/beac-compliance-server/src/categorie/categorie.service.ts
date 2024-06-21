import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CategorieServiceBase } from "./base/categorie.service.base";

@Injectable()
export class CategorieService extends CategorieServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
