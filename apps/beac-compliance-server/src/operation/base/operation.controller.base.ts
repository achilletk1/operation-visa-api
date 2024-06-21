/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { isRecordNotFoundError } from "../../prisma.util";
import * as errors from "../../errors";
import { Request } from "express";
import { plainToClass } from "class-transformer";
import { ApiNestedQuery } from "../../decorators/api-nested-query.decorator";
import * as nestAccessControl from "nest-access-control";
import * as defaultAuthGuard from "../../auth/defaultAuth.guard";
import { OperationService } from "../operation.service";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { OperationCreateInput } from "./OperationCreateInput";
import { Operation } from "./Operation";
import { OperationFindManyArgs } from "./OperationFindManyArgs";
import { OperationWhereUniqueInput } from "./OperationWhereUniqueInput";
import { OperationUpdateInput } from "./OperationUpdateInput";

@swagger.ApiBearerAuth()
@common.UseGuards(defaultAuthGuard.DefaultAuthGuard, nestAccessControl.ACGuard)
export class OperationControllerBase {
  constructor(
    protected readonly service: OperationService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}
  @common.UseInterceptors(AclValidateRequestInterceptor)
  @common.Post()
  @swagger.ApiCreatedResponse({ type: Operation })
  @nestAccessControl.UseRoles({
    resource: "Operation",
    action: "create",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async createOperation(
    @common.Body() data: OperationCreateInput
  ): Promise<Operation> {
    return await this.service.createOperation({
      data: {
        ...data,

        categorie: data.categorie
          ? {
              connect: data.categorie,
            }
          : undefined,

        moisPaiementEnLigne: data.moisPaiementEnLigne
          ? {
              connect: data.moisPaiementEnLigne,
            }
          : undefined,

        utilisateur: data.utilisateur
          ? {
              connect: data.utilisateur,
            }
          : undefined,

        voyage: data.voyage
          ? {
              connect: data.voyage,
            }
          : undefined,
      },
      select: {
        categorie: {
          select: {
            id: true,
          },
        },

        createdAt: true,
        date: true,
        id: true,

        moisPaiementEnLigne: {
          select: {
            id: true,
          },
        },

        montant: true,
        typeField: true,
        updatedAt: true,

        utilisateur: {
          select: {
            id: true,
          },
        },

        voyage: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @common.Get()
  @swagger.ApiOkResponse({ type: [Operation] })
  @ApiNestedQuery(OperationFindManyArgs)
  @nestAccessControl.UseRoles({
    resource: "Operation",
    action: "read",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async operations(@common.Req() request: Request): Promise<Operation[]> {
    const args = plainToClass(OperationFindManyArgs, request.query);
    return this.service.operations({
      ...args,
      select: {
        categorie: {
          select: {
            id: true,
          },
        },

        createdAt: true,
        date: true,
        id: true,

        moisPaiementEnLigne: {
          select: {
            id: true,
          },
        },

        montant: true,
        typeField: true,
        updatedAt: true,

        utilisateur: {
          select: {
            id: true,
          },
        },

        voyage: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @common.Get("/:id")
  @swagger.ApiOkResponse({ type: Operation })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @nestAccessControl.UseRoles({
    resource: "Operation",
    action: "read",
    possession: "own",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async operation(
    @common.Param() params: OperationWhereUniqueInput
  ): Promise<Operation | null> {
    const result = await this.service.operation({
      where: params,
      select: {
        categorie: {
          select: {
            id: true,
          },
        },

        createdAt: true,
        date: true,
        id: true,

        moisPaiementEnLigne: {
          select: {
            id: true,
          },
        },

        montant: true,
        typeField: true,
        updatedAt: true,

        utilisateur: {
          select: {
            id: true,
          },
        },

        voyage: {
          select: {
            id: true,
          },
        },
      },
    });
    if (result === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return result;
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @common.Patch("/:id")
  @swagger.ApiOkResponse({ type: Operation })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @nestAccessControl.UseRoles({
    resource: "Operation",
    action: "update",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async updateOperation(
    @common.Param() params: OperationWhereUniqueInput,
    @common.Body() data: OperationUpdateInput
  ): Promise<Operation | null> {
    try {
      return await this.service.updateOperation({
        where: params,
        data: {
          ...data,

          categorie: data.categorie
            ? {
                connect: data.categorie,
              }
            : undefined,

          moisPaiementEnLigne: data.moisPaiementEnLigne
            ? {
                connect: data.moisPaiementEnLigne,
              }
            : undefined,

          utilisateur: data.utilisateur
            ? {
                connect: data.utilisateur,
              }
            : undefined,

          voyage: data.voyage
            ? {
                connect: data.voyage,
              }
            : undefined,
        },
        select: {
          categorie: {
            select: {
              id: true,
            },
          },

          createdAt: true,
          date: true,
          id: true,

          moisPaiementEnLigne: {
            select: {
              id: true,
            },
          },

          montant: true,
          typeField: true,
          updatedAt: true,

          utilisateur: {
            select: {
              id: true,
            },
          },

          voyage: {
            select: {
              id: true,
            },
          },
        },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`
        );
      }
      throw error;
    }
  }

  @common.Delete("/:id")
  @swagger.ApiOkResponse({ type: Operation })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @nestAccessControl.UseRoles({
    resource: "Operation",
    action: "delete",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async deleteOperation(
    @common.Param() params: OperationWhereUniqueInput
  ): Promise<Operation | null> {
    try {
      return await this.service.deleteOperation({
        where: params,
        select: {
          categorie: {
            select: {
              id: true,
            },
          },

          createdAt: true,
          date: true,
          id: true,

          moisPaiementEnLigne: {
            select: {
              id: true,
            },
          },

          montant: true,
          typeField: true,
          updatedAt: true,

          utilisateur: {
            select: {
              id: true,
            },
          },

          voyage: {
            select: {
              id: true,
            },
          },
        },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`
        );
      }
      throw error;
    }
  }
}
