export const environment = {
    production: false,
    msalConfig: {
        auth: {
            clientId: 'ebf45978-35a5-4cb2-b37d-28e4394b6972',
            authority: 'https://login.microsoftonline.com/e99e8623-299c-4c23-be24-b390e68d9994'
        }
    },
    apiConfig: {
        scopes: ['user.read'],
        uri: 'https://graph.microsoft.com/v1.0/me'
    },
    baseurl: "https://bkptn-api.dev-asha.com"
};
