import { TemporaryFilesController } from "modules/temporary-files";
import { BaseCron } from "common/base";

// Supprimer les fichiers temporaires
class DeleteTemporaryFilesCron extends BaseCron {
    cronExpressionPath = 'crons.deleteTemporaryFile';  // At minute 0 past every 3rd hour
    service = TemporaryFilesController.temporaryFilesService.removeTemporaryFiles;
    startOnStagingBci = false;
    startOnDev = true;
}

export default new DeleteTemporaryFilesCron();