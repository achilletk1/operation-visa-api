import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PieceJointeServiceBase } from "./base/pieceJointe.service.base";

@Injectable()
export class PieceJointeService extends PieceJointeServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
