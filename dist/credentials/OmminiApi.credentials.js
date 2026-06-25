"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmminiApi = void 0;
class OmminiApi {
    constructor() {
        this.name = 'omminiApi';
        this.displayName = 'Ommini API';
        this.documentationUrl = 'https://ommini.com/api-anahtarlari';
        this.properties = [
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
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://ommini.com',
                url: '/beni-getir',
                method: 'GET',
            },
        };
    }
}
exports.OmminiApi = OmminiApi;
//# sourceMappingURL=OmminiApi.credentials.js.map