import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as errors from "../errors";
import { DocumentationService } from "./documentation.service";

@swagger.ApiTags("documentations")
@common.Controller("documentations")
export class DocumentationController {
  constructor(protected readonly service: DocumentationService) {}

  @common.Post("/create-documentation")
  @swagger.ApiOkResponse({
    type: String
  })
  @swagger.ApiNotFoundResponse({
    type: errors.NotFoundException
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException
  })
  async CreateDocumentationFile(
    @common.Body()
    body: string
  ): Promise<string> {
        return this.service.CreateDocumentationFile(body);
      }
}
