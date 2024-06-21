import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TypePieceJointeServiceBase } from "./base/typePieceJointe.service.base";

@Injectable()
export class TypePieceJointeService extends TypePieceJointeServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
