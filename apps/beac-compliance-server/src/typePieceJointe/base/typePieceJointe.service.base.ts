/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { PrismaService } from "../../prisma/prisma.service";

import {
  Prisma,
  TypePieceJointe as PrismaTypePieceJointe,
  PieceJointe as PrismaPieceJointe,
} from "@prisma/client";

export class TypePieceJointeServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async count(
    args: Omit<Prisma.TypePieceJointeCountArgs, "select">
  ): Promise<number> {
    return this.prisma.typePieceJointe.count(args);
  }

  async typePieceJointes(
    args: Prisma.TypePieceJointeFindManyArgs
  ): Promise<PrismaTypePieceJointe[]> {
    return this.prisma.typePieceJointe.findMany(args);
  }
  async typePieceJointe(
    args: Prisma.TypePieceJointeFindUniqueArgs
  ): Promise<PrismaTypePieceJointe | null> {
    return this.prisma.typePieceJointe.findUnique(args);
  }
  async createTypePieceJointe(
    args: Prisma.TypePieceJointeCreateArgs
  ): Promise<PrismaTypePieceJointe> {
    return this.prisma.typePieceJointe.create(args);
  }
  async updateTypePieceJointe(
    args: Prisma.TypePieceJointeUpdateArgs
  ): Promise<PrismaTypePieceJointe> {
    return this.prisma.typePieceJointe.update(args);
  }
  async deleteTypePieceJointe(
    args: Prisma.TypePieceJointeDeleteArgs
  ): Promise<PrismaTypePieceJointe> {
    return this.prisma.typePieceJointe.delete(args);
  }

  async findPieceJointes(
    parentId: string,
    args: Prisma.PieceJointeFindManyArgs
  ): Promise<PrismaPieceJointe[]> {
    return this.prisma.typePieceJointe
      .findUniqueOrThrow({
        where: { id: parentId },
      })
      .pieceJointes(args);
  }
}