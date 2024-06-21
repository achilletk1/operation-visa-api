import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { VoyageServiceBase } from "./base/voyage.service.base";

@Injectable()
export class VoyageService extends VoyageServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
