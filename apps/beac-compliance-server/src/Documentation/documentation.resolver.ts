import * as graphql from "@nestjs/graphql";
import { DocumentationService } from "./documentation.service";

export class DocumentationResolver {
  constructor(protected readonly service: DocumentationService) {}

  @graphql.Mutation(() => String)
  async CreateDocumentationFile(
    @graphql.Args()
    args: string
  ): Promise<string> {
    return this.service.CreateDocumentationFile(args);
  }
}
