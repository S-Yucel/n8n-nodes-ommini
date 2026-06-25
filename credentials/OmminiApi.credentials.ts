import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OmminiApi implements ICredentialType {
	name = 'omminiApi';
	displayName = 'Ommini API';
	documentationUrl = 'https://ommini.com/api-anahtarlari';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			placeholder: 'Ommini API anahtarınızı girin',
			description: 'ommini.com/api-anahtarlari sayfasından alabilirsiniz',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://ommini.com',
			url: '/beni-getir',
			method: 'GET',
		},
	};
}
