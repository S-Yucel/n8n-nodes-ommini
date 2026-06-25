"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmminiApi = void 0;
class OmminiApi {
    constructor() {
        this.name = 'omminiApi';
        this.displayName = 'Ommini API';
        this.documentationUrl = 'https://ommini.com';
        this.properties = [
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
        this.test = {
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
}
exports.OmminiApi = OmminiApi;
//# sourceMappingURL=OmminiApi.credentials.js.map