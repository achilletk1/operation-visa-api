import { Module } from "@nestjs/common";
import { RoleModule } from "./role/role.module";
import { UtilisateurModule } from "./utilisateur/utilisateur.module";
import { CategorieModule } from "./categorie/categorie.module";
import { OperationModule } from "./operation/operation.module";
import { TypePieceJointeModule } from "./typePieceJointe/typePieceJointe.module";
import { PieceJointeModule } from "./pieceJointe/pieceJointe.module";
import { UserModule } from "./user/user.module";
import { MoisPaiementEnLigneModule } from "./moisPaiementEnLigne/moisPaiementEnLigne.module";
import { VoyageModule } from "./voyage/voyage.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ServeStaticOptionsService } from "./serveStaticOptions.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

import { ACLModule } from "./auth/acl.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  controllers: [],
  imports: [
    ACLModule,
    AuthModule,
    RoleModule,
    UtilisateurModule,
    CategorieModule,
    OperationModule,
    TypePieceJointeModule,
    PieceJointeModule,
    UserModule,
    MoisPaiementEnLigneModule,
    VoyageModule,
    HealthModule,
    PrismaModule,
    SecretsManagerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticOptionsService,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => {
        const playground = configService.get("GRAPHQL_PLAYGROUND");
        const introspection = configService.get("GRAPHQL_INTROSPECTION");
        return {
          autoSchemaFile: "schema.graphql",
          sortSchema: true,
          playground,
          introspection: playground || introspection,
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  providers: [],
})
export class AppModule {}
