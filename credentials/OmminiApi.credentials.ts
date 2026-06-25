import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OmminiApi implements ICredentialType {
	name = 'omminiApi';
	displayName = 'Ommini API';
	documentationUrl = 'https://ommini.com';
	properties: INodeProperties[] = [
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
			placeholder: 'ornek@email.com',
			description: 'Ommini hesabınızın email adresi',
		},
		{
			displayName: 'Şifre',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Ommini hesabınızın şifresi',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://ommini.com',
			url: '/giris',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: {
				email: '={{$credentials.email}}',
				sifre: '={{$credentials.password}}',
			},
		},
	};
}
