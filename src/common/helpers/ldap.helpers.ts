import { authenticate } from "ldap-authentication";
import { logger } from "winston-config";
import { config } from "convict-config";
import { errorMsg } from "common/utils";

let ldapOptions: any = {
    ldapOpts: {
        url: `${config.get('activeDirectory.url')}`,
        tlsOptions: { rejectUnauthorized: false }
    },
    adminDn: `${config.get('activeDirectory.adminDn')}`,
    adminPassword: `${config.get('activeDirectory.adminPassword')}`,
    userPassword: null,
    userSearchBase: 'dc=intra,dc=bicec',
    usernameAttribute: 'sAMAccountName',
    username: null
};

export async function getLdapUser(userCode: any, password?: any) {

    ldapOptions.username = `${userCode}`;

    if (password) { ldapOptions.userPassword = `${password}`; }
    else { ldapOptions.verifyUserExists = true; }

    let response = { givenName: 'John', sn: 'Doe', mobile: '237699000000', memberOf: null, mail: 'john.doe@londo-tech.com', displayName: 'Doe John' };

    if (['production', 'staging-bci'].includes(config.get('env'))) {
        try {
            logger.info(`Checking the user's existence in the Active Directory from the userCode ${userCode}`);
            response = await authenticate(ldapOptions);
            console.log('LDAP authentification response', response);
            if (config.get('activeDirectory.groupVerification')) {
                if (!response.memberOf) { throw Error('UnauthorizedGroup'); }
                if (!verifyGroupMember(response)) { throw Error('UnauthorizedGroup'); }
            }

        } catch (error: any) {
            logger.debug(`Error during authentication : ${JSON.stringify(error)} \n stack : ${error.stack}\n`)
            throw error;
        }
    }


    if (['staging'].includes(config.get('env'))) {
        try {
            ldapOptions = {
                userSearchBase: 'dc=ucac,dc=icam',
                groupsSearchBase: 'dc=ucac,dc=icam',
                groupClass: `ucac.icam/Users/${config.get('activeDirectory.groupName')}`
            };

            response = await authenticate(ldapOptions);
            console.log('ldap user : ', response);
            if (!response.memberOf) { throw Error('UnauthorizedGroup'); }
            if (!verifyGroupMember(response)) { throw Error('UnauthorizedGroup'); }
        } catch (error: any) {
            logger.debug(`\n error : ${JSON.stringify(error)} \n stack : ${error.stack}\n message : ${error.admin}`);
            throw error;
        }
    }

    if (response instanceof Error) {
        if (response.message === 'InvalidCredentialsError: 80090308: LdapErr: DSID-0C0903C5, comment: AcceptSecurityContext error, data 52e, v2580') throw new Error(errorMsg.BAD_ADMIN_PW);

        if (response.message === 'BadCredentials') throw new Error(errorMsg.BAD_CREDENTIALS);

        if (response.message === 'UserNotFound') throw new Error(errorMsg.USER_NOT_FOUND);

        if (response.message === 'BadPassword') throw new Error(errorMsg.BAD_PASSWORD);

        if (response.message === 'user not found or usernameAttribute is wrong') throw new Error(errorMsg.NOT_USER_FOUND);

        if (response.message === 'UnauthorizedGroup') throw new Error(errorMsg.UNAUTHORIZED_GROUP);

        if (response.message ==='Forbidden') throw new Error(errorMsg.NO_RIGHTS);

        if (response.message === 'UserDisabled') throw new Error(errorMsg.USER_DISABLED);
    }

    const user = {
        userCode, fname: response.givenName, lname: response.sn,
        tel: response.mobile, email: response?.mail, fullName: response.displayName || `${response.sn} ${response.givenName}`
    };

    return user;
}

const verifyGroupMember = (user: any): boolean => {
    if (!user) { return false; }
    const data = `${user.memberOf}`.split(',');
    data.forEach((elmt: any) => {
        const group = elmt.split('=');
        if (group[1] === `${config.get('activeDirectory.groupName')}`) { return true; }
    });
    return false;
};

