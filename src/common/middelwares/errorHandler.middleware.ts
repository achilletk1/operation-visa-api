/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { isProd } from 'common/helpers';
import { logger } from "winston-config";
import { ValidationError } from 'joi';

/**
 * @description Default error handler to be used with express
 * @param err Error object
 * @param {object} req Express req object
 * @param {object} res Express res object
 * @param {function} next Express next object
 * @returns {*}
 */
export async function ErrorHandler(err: Error | any, req: Request, res: Response, next: NextFunction): Promise<unknown> {
    let parsedError = '';
    if (err instanceof ValidationError) {
        res.status(400).send(err.message);
        return logger.error(`Validation Error: ${err.message}`);
      }
   
    // Attempt to gracefully parse error object
    try {
        parsedError = (err && typeof err === "object") ? err.stack : err;
    } catch (e: any) {
        logger.error(e.stack);
    }

    // Log the original error
    logger.error(parsedError);

    // If response is already sent, don't attempt to respond to client
    if (res.headersSent) { return next(err); }
    const errResp = formatErrorResponseMsg(err);

    res.status(err.statusCode || 500).json({
        success: false,
        status: err.statusCode || 500,
        message: errResp.name || 'Internal server error',
        details: errResp.details || null,
        title: errResp.title || null,
        stack: isProd ? {} : err.stack
    });
}

function formatErrorResponseMsg(err: Error | { index: string; type: string; column: string; name: string; message: string; stack?: string; }) {
    const { message } = err; let details: any; let title: any; const errResp: any = {};
    if (message === 'Forbbiden') { details = `Vous n'êtes pas autorisé à  effectuer cette opération`; title = 'Non autorisé'; }
    if (message === 'IncorrectFileName') { details = `Le nom du fichier que vous avez importé est incorrect`; title = 'Nom du fichier incorrect'; }
    if (message === 'FileAlreadyExist') { details = `Le fichier que vous avez importé existe déjà`; title = 'Fichier existant'; }
    if (message === 'FileIsEmpty') { details = `Le fichier que vous avez importé est vide`; title = 'Fichier vide'; }
    if (message === 'IncorrectFileColumn' && 'index' in err) { details = `Le fichier que vous avez importé ne contient pas la colonne ${err.index} qui est attendue`; title = 'Colonnes incorrectes'; }
    if (message === 'IncorrectFileMonth' && 'index' in err) { details = `La champ "DATE" de la ligne ${err.index} ne correspond pas au mois du fichier`; title = 'Ligne de fichier incorrecte'; }
    if (message === 'IncorrectFileType' && 'index' in err) { details = `Le champ "NATURE" de la ligne ${err.index} (${err.type}) ne correspond pas aux valeurs attendu, veuillez le remplacer par une nature de transaction connu`; title = 'Type de transaction incorrecte'; }
    if (message === 'IncorrectFileData' && 'index' in err) { details = `Le champ "${err.column}" de la ligne ${err.index} (${err.type}) est vide, veuillez remplir ce champ s'il vous plaît`; title = 'Cellule obligatoire vide'; }


    if (details) { errResp.details = details; }
    if (title) { errResp.title = title; }
    if (!isProd) { errResp.name = err.message; }

    return errResp;
}
