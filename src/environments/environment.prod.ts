export const environment = {
	production: true,
	msalConfig: {
		auth: {
			clientId: '21a98560-0869-45fe-8d77-b4885165c0bf',
			authority: 'https://login.microsoftonline.com/9732db31-8695-4030-ae01-e3217b1daaec'
		}
	},
	apiConfig: {
		scopes: ['user.read'],
		uri: 'https://graph.microsoft.com/v1.0/me'
	}
};
