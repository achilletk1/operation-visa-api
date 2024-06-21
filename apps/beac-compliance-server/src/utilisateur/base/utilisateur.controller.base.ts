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
import { UtilisateurService } from "../utilisateur.service";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { UtilisateurCreateInput } from "./UtilisateurCreateInput";
import { Utilisateur } from "./Utilisateur";
import { UtilisateurFindManyArgs } from "./UtilisateurFindManyArgs";
import { UtilisateurWhereUniqueInput } from "./UtilisateurWhereUniqueInput";
import { UtilisateurUpdateInput } from "./UtilisateurUpdateInput";
import { MoisPaiementEnLigneFindManyArgs } from "../../moisPaiementEnLigne/base/MoisPaiementEnLigneFindManyArgs";
import { MoisPaiementEnLigne } from "../../moisPaiementEnLigne/base/MoisPaiementEnLigne";
import { MoisPaiementEnLigneWhereUniqueInput } from "../../moisPaiementEnLigne/base/MoisPaiementEnLigneWhereUniqueInput";
import { OperationFindManyArgs } from "../../operation/base/OperationFindManyArgs";
import { Operation } from "../../operation/base/Operation";
import { OperationWhereUniqueInput } from "../../operation/base/OperationWhereUniqueInput";
import { VoyageFindManyArgs } from "../../voyage/base/VoyageFindManyArgs";
import { Voyage } from "../../voyage/base/Voyage";
import { VoyageWhereUniqueInput } from "../../voyage/base/VoyageWhereUniqueInput";

@swagger.ApiBearerAuth()
@common.UseGuards(defaultAuthGuard.DefaultAuthGuard, nestAccessControl.ACGuard)
export class UtilisateurControllerBase {
  constructor(
    protected readonly service: UtilisateurService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}
  @common.UseInterceptors(AclValidateRequestInterceptor)
  @common.Post()
  @swagger.ApiCreatedResponse({ type: Utilisateur })
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "create",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async createUtilisateur(
    @common.Body() data: UtilisateurCreateInput
  ): Promise<Utilisateur> {
    return await this.service.createUtilisateur({
      data: {
        ...data,

        role: data.role
          ? {
              connect: data.role,
            }
          : undefined,
      },
      select: {
        createdAt: true,
        email: true,
        id: true,
        motDePasse: true,
        nom: true,
        prenom: true,

        role: {
          select: {
            id: true,
          },
        },

        updatedAt: true,
      },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @common.Get()
  @swagger.ApiOkResponse({ type: [Utilisateur] })
  @ApiNestedQuery(UtilisateurFindManyArgs)
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "read",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async utilisateurs(@common.Req() request: Request): Promise<Utilisateur[]> {
    const args = plainToClass(UtilisateurFindManyArgs, request.query);
    return this.service.utilisateurs({
      ...args,
      select: {
        createdAt: true,
        email: true,
        id: true,
        motDePasse: true,
        nom: true,
        prenom: true,

        role: {
          select: {
            id: true,
          },
        },

        updatedAt: true,
      },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @common.Get("/:id")
  @swagger.ApiOkResponse({ type: Utilisateur })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "read",
    possession: "own",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async utilisateur(
    @common.Param() params: UtilisateurWhereUniqueInput
  ): Promise<Utilisateur | null> {
    const result = await this.service.utilisateur({
      where: params,
      select: {
        createdAt: true,
        email: true,
        id: true,
        motDePasse: true,
        nom: true,
        prenom: true,

        role: {
          select: {
            id: true,
          },
        },

        updatedAt: true,
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
  @swagger.ApiOkResponse({ type: Utilisateur })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "update",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async updateUtilisateur(
    @common.Param() params: UtilisateurWhereUniqueInput,
    @common.Body() data: UtilisateurUpdateInput
  ): Promise<Utilisateur | null> {
    try {
      return await this.service.updateUtilisateur({
        where: params,
        data: {
          ...data,

          role: data.role
            ? {
                connect: data.role,
              }
            : undefined,
        },
        select: {
          createdAt: true,
          email: true,
          id: true,
          motDePasse: true,
          nom: true,
          prenom: true,

          role: {
            select: {
              id: true,
            },
          },

          updatedAt: true,
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
  @swagger.ApiOkResponse({ type: Utilisateur })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "delete",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async deleteUtilisateur(
    @common.Param() params: UtilisateurWhereUniqueInput
  ): Promise<Utilisateur | null> {
    try {
      return await this.service.deleteUtilisateur({
        where: params,
        select: {
          createdAt: true,
          email: true,
          id: true,
          motDePasse: true,
          nom: true,
          prenom: true,

          role: {
            select: {
              id: true,
            },
          },

          updatedAt: true,
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

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @common.Get("/:id/moisPaiementEnLignes")
  @ApiNestedQuery(MoisPaiementEnLigneFindManyArgs)
  @nestAccessControl.UseRoles({
    resource: "MoisPaiementEnLigne",
    action: "read",
    possession: "any",
  })
  async findMoisPaiementEnLignes(
    @common.Req() request: Request,
    @common.Param() params: UtilisateurWhereUniqueInput
  ): Promise<MoisPaiementEnLigne[]> {
    const query = plainToClass(MoisPaiementEnLigneFindManyArgs, request.query);
    const results = await this.service.findMoisPaiementEnLignes(params.id, {
      ...query,
      select: {
        createdAt: true,
        id: true,
        mois: true,
        montantTotal: true,
        updatedAt: true,

        utilisateur: {
          select: {
            id: true,
          },
        },
      },
    });
    if (results === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return results;
  }

  @common.Post("/:id/moisPaiementEnLignes")
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "update",
    possession: "any",
  })
  async connectMoisPaiementEnLignes(
    @common.Param() params: UtilisateurWhereUniqueInput,
    @common.Body() body: MoisPaiementEnLigneWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      moisPaiementEnLignes: {
        connect: body,
      },
    };
    await this.service.updateUtilisateur({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.Patch("/:id/moisPaiementEnLignes")
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "update",
    possession: "any",
  })
  async updateMoisPaiementEnLignes(
    @common.Param() params: UtilisateurWhereUniqueInput,
    @common.Body() body: MoisPaiementEnLigneWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      moisPaiementEnLignes: {
        set: body,
      },
    };
    await this.service.updateUtilisateur({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.Delete("/:id/moisPaiementEnLignes")
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "update",
    possession: "any",
  })
  async disconnectMoisPaiementEnLignes(
    @common.Param() params: UtilisateurWhereUniqueInput,
    @common.Body() body: MoisPaiementEnLigneWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      moisPaiementEnLignes: {
        disconnect: body,
      },
    };
    await this.service.updateUtilisateur({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @common.Get("/:id/operations")
  @ApiNestedQuery(OperationFindManyArgs)
  @nestAccessControl.UseRoles({
    resource: "Operation",
    action: "read",
    possession: "any",
  })
  async findOperations(
    @common.Req() request: Request,
    @common.Param() params: UtilisateurWhereUniqueInput
  ): Promise<Operation[]> {
    const query = plainToClass(OperationFindManyArgs, request.query);
    const results = await this.service.findOperations(params.id, {
      ...query,
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
    if (results === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return results;
  }

  @common.Post("/:id/operations")
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "update",
    possession: "any",
  })
  async connectOperations(
    @common.Param() params: UtilisateurWhereUniqueInput,
    @common.Body() body: OperationWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      operations: {
        connect: body,
      },
    };
    await this.service.updateUtilisateur({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.Patch("/:id/operations")
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "update",
    possession: "any",
  })
  async updateOperations(
    @common.Param() params: UtilisateurWhereUniqueInput,
    @common.Body() body: OperationWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      operations: {
        set: body,
      },
    };
    await this.service.updateUtilisateur({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.Delete("/:id/operations")
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "update",
    possession: "any",
  })
  async disconnectOperations(
    @common.Param() params: UtilisateurWhereUniqueInput,
    @common.Body() body: OperationWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      operations: {
        disconnect: body,
      },
    };
    await this.service.updateUtilisateur({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @common.Get("/:id/voyages")
  @ApiNestedQuery(VoyageFindManyArgs)
  @nestAccessControl.UseRoles({
    resource: "Voyage",
    action: "read",
    possession: "any",
  })
  async findVoyages(
    @common.Req() request: Request,
    @common.Param() params: UtilisateurWhereUniqueInput
  ): Promise<Voyage[]> {
    const query = plainToClass(VoyageFindManyArgs, request.query);
    const results = await this.service.findVoyages(params.id, {
      ...query,
      select: {
        createdAt: true,
        dateDepart: true,
        dateRetour: true,
        id: true,
        updatedAt: true,

        utilisateur: {
          select: {
            id: true,
          },
        },
      },
    });
    if (results === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return results;
  }

  @common.Post("/:id/voyages")
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "update",
    possession: "any",
  })
  async connectVoyages(
    @common.Param() params: UtilisateurWhereUniqueInput,
    @common.Body() body: VoyageWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      voyages: {
        connect: body,
      },
    };
    await this.service.updateUtilisateur({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.Patch("/:id/voyages")
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "update",
    possession: "any",
  })
  async updateVoyages(
    @common.Param() params: UtilisateurWhereUniqueInput,
    @common.Body() body: VoyageWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      voyages: {
        set: body,
      },
    };
    await this.service.updateUtilisateur({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.Delete("/:id/voyages")
  @nestAccessControl.UseRoles({
    resource: "Utilisateur",
    action: "update",
    possession: "any",
  })
  async disconnectVoyages(
    @common.Param() params: UtilisateurWhereUniqueInput,
    @common.Body() body: VoyageWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      voyages: {
        disconnect: body,
      },
    };
    await this.service.updateUtilisateur({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.Post("/upload-excel")
  @swagger.ApiOkResponse({
    type: String,
  })
  @swagger.ApiNotFoundResponse({
    type: errors.NotFoundException,
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async UploadExcelFile(
    @common.Body()
    body: string
  ): Promise<string> {
    return this.service.UploadExcelFile(body);
  }
}