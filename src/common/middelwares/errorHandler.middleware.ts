/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { isProd } from 'common/helpers';
import { logger } from "winston-config";
import { ValidationError } from 'joi';
import { errorMsg } from '..';

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
    if (message === 'Forbidden') { details = `Vous n'êtes pas autorisé à  effectuer cette opération`; title = 'Non autorisé'; }
    if (message === 'IncorrectFileName') { details = `Le nom du fichier que vous avez importé est incorrect`; title = 'Nom du fichier incorrect'; }
    if (message === 'FileAlreadyExist') { details = `Le fichier que vous avez importé existe déjà`; title = 'Fichier existant'; }
    if (message === 'FileIsEmpty') { details = `Le fichier que vous avez importé est vide`; title = 'Fichier vide'; }
    if (message === 'UserAlreadyExist') { details = `Cet utilisdateur existe déjà, impossible de le créer à nouveau`; title = 'Utilisateur déjà existant'; }
    if (message === 'UnauthorizedGroup') { details = `Cet utilisdateur n'appartient au groupe LDAP dédié à FLY BANKING`; title = 'Utilisateur n\'appartient au groupe dédié'; }
    if (message === 'ClientNotFound') { details = `Aucun utilisateur trouvé dans la base possédant cette racine client`; title = 'Aucun client trouvé'; }
    if (message === 'NoActionProvided') { details = `Aucune action spécifié dans votre requête`; title = 'Requête d\'export incomplète'; }
    if (message === 'usersNotFound') { details = `Aucune utilisateur(s) trouvé pour les critères de filtre fourni`; title = 'Aucune utilisateur trouvé pour l\'export'; }
    if (['UserNotFound', 'User not found'].includes(message) || message.includes('No data found {"userCode":')) { details = `Aucune utilisateur trouvé pour les critères de filtre fourni`; title = 'Aucune utilisateur trouvé'; }
    if (message === 'disableUser') { details = `Votre compte est désactivé, veuillez contactez l'administrateur de FLY BANKING`; title = 'Compte désactivé'; }
    if (message === 'MissingAuthData') { details = `Données d'authentification manquante dans votre demande d'authentification`; title = 'Données manquantes'; }
    if (message === 'BadOTP') { details = `Mauvais format du code OTP`; title = 'Mauvais format du code OTP'; }
    if (message === 'OTPNoMatch') { details = `Code OTP incorrect, veuillez renseigner le bon code OTP reçu`; title = 'Code OTP incorrect'; }
    if (message === 'OTPExpired') { details = `Code OTP expiré, veuillez initié un nouvelle demande de code OTP`; title = 'Code OTP expiré'; }
    if (message === 'EmailOrPasswordNotProvided') { details = `Email ou mot de passe manquant dans la demande d'authentification`; title = 'Données manquantes'; }
    if (message === 'FailedResetPassword') { details = `Veuillez saisir le bon mot de passe courant`; title = 'Mot de passe courant incorrect'; }
    if (message === 'PasswordsProvidedAreDifferent') { details = `Rassurez vous de saisir exactement le même mot de passe dans les deux champs`; title = 'Vérification nouveau mot de passe incorrecte'; }
    if (message === 'Passwordalreadyused') { details = `L'ancien et le nouveau mot de passe son identique`; title = 'Le nouveau mot de passe doit être différent de l\'ancien'; }
    if (message === 'Missing user data') { details = `Cet utilisateur ne possède ni adresse mail, ni numéro de téléphone`; title = 'Authentification double facteur impossible'; }
    if (message === 'FailedToCreateUser') { details = `Une erreur est survenu lors de la création de l'utilisateur`; title = 'Erreur lors de la creéation du compte'; }

    if (message === 'IncorrectFileColumn' && 'index' in err) { details = `Le fichier que vous avez importé ne contient pas la colonne ${err.index} qui est attendue`; title = 'Colonnes incorrectes'; }
    if (message === 'IncorrectFileMonth' && 'index' in err) { details = `La champ "DATE" de la ligne ${err.index} ne correspond pas au mois du fichier`; title = 'Ligne de fichier incorrecte'; }
    if (message === 'IncorrectFileType' && 'index' in err) { details = `Le champ "NATURE" de la ligne ${err.index} (${err.type}) ne correspond pas aux valeurs attendu, veuillez le remplacer par une nature de transaction connu`; title = 'Type de transaction incorrecte'; }
    if (message === 'IncorrectFileData' && 'index' in err) { details = `Le champ "${err.column}" de la ligne ${err.index} (${err.type}) est vide, veuillez remplir ce champ s'il vous plaît`; title = 'Cellule obligatoire vide'; }
    if (message === 'IncorrectFileDuplicate' && 'index' in err) { details = { indexes: err.index, column: err.column }; title = 'Opérations déjà intégrées dans le système détecté'; }

    if (message === errorMsg.BAD_ADMIN_PW) { title = 'Invalid Password'; details = 'Invalid administrator password' }
    if (message === errorMsg.BAD_CREDENTIAL) { title = 'Bad Credentials'; details = 'The provided credentials are incorrect' }
    if (message === errorMsg.USER_NOT_FOUND) { title = 'User Not Found', details = 'The user was not found in the LDAP server' }
    if (message === errorMsg.BAD_PASSWORD) { title = 'Bad Password', details = 'The provided password is incorrect' }
    if (message === errorMsg.USER_NOT_FOUND) { title = 'User Not Found', details = 'User not found in LDAP or username attribute is incorrect' }
    if (message === errorMsg.UNAUTHORIZED_GROUP) { title = 'Unauthorized LDAP Group', details = 'This user does not belong to the LDAP group dedicated to FLY BANKING' }
    if (message === errorMsg.NO_RIGHTS) { title = 'No Rights', details = 'The user does not have the necessary rights' }
    if (message === errorMsg.USER_DISABLED) { title = 'User Disabled', details = 'Your account has been deactivated, please contact the FLY BANKING administrator.' }
    if (err && err.name.includes('ldap')) { details = err.message; title = err.name?.split('+')[1]; }

    if (details) { errResp.details = details; }
    if (title) { errResp.title = title; }
    if (!isProd) { errResp.name = err.message; }

    return errResp;
}
