"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ommini = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const BASE_URL = 'https://ommini.com';
// Login yapıp JWT token döner
async function getToken(email, password, context) {
    const res = await context.helpers.request({
        method: 'POST',
        url: `${BASE_URL}/giris`,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sifre: password }),
    });
    const data = JSON.parse(res);
    if (!data.token)
        throw new Error('Giriş başarısız: ' + JSON.stringify(data));
    return data.token;
}
class Ommini {
    constructor() {
        this.description = {
            displayName: 'Ommini',
            name: 'ommini',
            icon: 'file:ommini.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Ommini AI Social Media Platform ile içerik üretin ve paylaşın',
            defaults: { name: 'Ommini' },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [{ name: 'omminiApi', required: true }],
            properties: [
                // ─── RESOURCE ──────────────────────────────────────────────
                {
                    displayName: 'Kaynak',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        { name: 'Gönderi', value: 'gonderi' },
                        { name: 'Görsel', value: 'gorsel' },
                        { name: 'Video', value: 'video' },
                        { name: 'Müzik', value: 'muzik' },
                        { name: 'Kullanıcı', value: 'kullanici' },
                    ],
                    default: 'gonderi',
                },
                // ─── GÖNDERİ ───────────────────────────────────────────────
                {
                    displayName: 'İşlem',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['gonderi'] } },
                    options: [
                        { name: 'Oluştur', value: 'olustur', action: 'Gönderi oluştur' },
                        { name: 'Takvime Ekle', value: 'takvim', action: 'Takvime ekle' },
                        { name: 'Listele', value: 'listele', action: 'Gönderileri listele' },
                    ],
                    default: 'olustur',
                },
                {
                    displayName: 'Başlık',
                    name: 'baslik',
                    type: 'string',
                    default: '',
                    displayOptions: { show: { resource: ['gonderi'], operation: ['olustur', 'takvim'] } },
                    required: true,
                },
                {
                    displayName: 'İçerik',
                    name: 'icerik',
                    type: 'string',
                    typeOptions: { rows: 4 },
                    default: '',
                    displayOptions: { show: { resource: ['gonderi'], operation: ['olustur', 'takvim'] } },
                    required: true,
                },
                {
                    displayName: 'Platform',
                    name: 'platform',
                    type: 'options',
                    displayOptions: { show: { resource: ['gonderi'], operation: ['olustur'] } },
                    options: [
                        { name: 'Genel', value: 'genel' },
                        { name: 'Instagram', value: 'instagram' },
                        { name: 'Twitter / X', value: 'twitter' },
                        { name: 'LinkedIn', value: 'linkedin' },
                        { name: 'Facebook', value: 'facebook' },
                        { name: 'TikTok', value: 'tiktok' },
                    ],
                    default: 'genel',
                },
                {
                    displayName: 'Yayın Zamanı',
                    name: 'yayin_zamani',
                    type: 'dateTime',
                    default: '',
                    displayOptions: { show: { resource: ['gonderi'], operation: ['takvim'] } },
                    required: true,
                    description: 'ISO 8601 format: 2024-05-15T14:30:00',
                },
                {
                    displayName: 'Platform (Takvim)',
                    name: 'takvim_platform',
                    type: 'options',
                    displayOptions: { show: { resource: ['gonderi'], operation: ['takvim'] } },
                    options: [
                        { name: 'Instagram', value: 'instagram' },
                        { name: 'Twitter / X', value: 'twitter' },
                        { name: 'LinkedIn', value: 'linkedin' },
                        { name: 'Facebook', value: 'facebook' },
                        { name: 'TikTok', value: 'tiktok' },
                    ],
                    default: 'instagram',
                },
                // ─── GÖRSEL ────────────────────────────────────────────────
                {
                    displayName: 'İşlem',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['gorsel'] } },
                    options: [
                        { name: 'Üret', value: 'uret', action: 'Görsel üret' },
                    ],
                    default: 'uret',
                },
                {
                    displayName: 'Prompt',
                    name: 'gorsel_prompt',
                    type: 'string',
                    typeOptions: { rows: 3 },
                    default: '',
                    placeholder: 'Üretmek istediğiniz görseli tanımlayın...',
                    displayOptions: { show: { resource: ['gorsel'], operation: ['uret'] } },
                    required: true,
                    description: 'Türkçe yazabilirsiniz, otomatik çeviri yapılır',
                },
                {
                    displayName: 'Oran',
                    name: 'gorsel_oran',
                    type: 'options',
                    displayOptions: { show: { resource: ['gorsel'], operation: ['uret'] } },
                    options: [
                        { name: 'Kare (1:1)', value: '1:1' },
                        { name: 'Yatay (16:9)', value: '16:9' },
                        { name: 'Dikey (9:16)', value: '9:16' },
                        { name: 'Geniş (4:3)', value: '4:3' },
                    ],
                    default: '1:1',
                },
                // ─── VİDEO ─────────────────────────────────────────────────
                {
                    displayName: 'İşlem',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['video'] } },
                    options: [
                        { name: 'Oluştur', value: 'olustur', action: 'Video oluştur' },
                        { name: 'Durum Sorgula', value: 'durum', action: 'Video durumunu sorgula' },
                        { name: 'Listele', value: 'listele', action: 'Videoları listele' },
                    ],
                    default: 'olustur',
                },
                {
                    displayName: 'Prompt',
                    name: 'prompt',
                    type: 'string',
                    typeOptions: { rows: 3 },
                    default: '',
                    displayOptions: { show: { resource: ['video'], operation: ['olustur'] } },
                    required: true,
                },
                {
                    displayName: 'Stil',
                    name: 'stil',
                    type: 'options',
                    displayOptions: { show: { resource: ['video'], operation: ['olustur'] } },
                    options: [
                        { name: 'Sinematik', value: 'cinematic' },
                        { name: 'Anime', value: 'anime' },
                        { name: 'Gerçekçi', value: 'realistic' },
                        { name: 'Animasyon', value: 'animation' },
                    ],
                    default: 'cinematic',
                },
                {
                    displayName: 'Süre',
                    name: 'sure',
                    type: 'options',
                    displayOptions: { show: { resource: ['video'], operation: ['olustur'] } },
                    options: [
                        { name: '5 Saniye', value: '5' },
                        { name: '10 Saniye', value: '10' },
                    ],
                    default: '5',
                },
                {
                    displayName: 'Oran',
                    name: 'oran',
                    type: 'options',
                    displayOptions: { show: { resource: ['video'], operation: ['olustur'] } },
                    options: [
                        { name: '9:16 (Dikey)', value: '9:16' },
                        { name: '16:9 (Yatay)', value: '16:9' },
                        { name: '1:1 (Kare)', value: '1:1' },
                    ],
                    default: '9:16',
                },
                {
                    displayName: 'Video ID',
                    name: 'video_id',
                    type: 'number',
                    default: 0,
                    displayOptions: { show: { resource: ['video'], operation: ['durum'] } },
                    required: true,
                },
                // ─── MÜZİK ─────────────────────────────────────────────────
                {
                    displayName: 'İşlem',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['muzik'] } },
                    options: [
                        { name: 'Üret', value: 'uret', action: 'Müzik üret' },
                        { name: 'Listele', value: 'listele', action: 'Müzikleri listele' },
                        { name: 'Detay', value: 'detay', action: 'Müzik detayı' },
                    ],
                    default: 'uret',
                },
                {
                    displayName: 'Başlık',
                    name: 'muzik_baslik',
                    type: 'string',
                    default: '',
                    displayOptions: { show: { resource: ['muzik'], operation: ['uret'] } },
                    required: true,
                },
                {
                    displayName: 'Tarz',
                    name: 'tarz',
                    type: 'options',
                    displayOptions: { show: { resource: ['muzik'], operation: ['uret'] } },
                    options: [
                        { name: 'Pop', value: 'Pop' },
                        { name: 'Rock', value: 'Rock' },
                        { name: 'Arabesk', value: 'Arabesk' },
                        { name: 'Türk Halk Müziği', value: 'Türk Halk Müziği' },
                        { name: 'Electronic', value: 'Electronic' },
                        { name: 'Jazz', value: 'Jazz' },
                        { name: 'Hip-Hop', value: 'Hip-Hop' },
                        { name: 'R&B', value: 'R&B' },
                        { name: 'Classical', value: 'Classical' },
                        { name: 'Anadolu Rock', value: 'Anadolu Rock' },
                    ],
                    default: 'Pop',
                },
                {
                    displayName: 'Tip',
                    name: 'tip',
                    type: 'options',
                    displayOptions: { show: { resource: ['muzik'], operation: ['uret'] } },
                    options: [
                        { name: 'Vokal', value: 'vokal' },
                        { name: 'Enstrümantal', value: 'enstrumantal' },
                    ],
                    default: 'vokal',
                },
                {
                    displayName: 'Duygu',
                    name: 'mood',
                    type: 'options',
                    displayOptions: { show: { resource: ['muzik'], operation: ['uret'] } },
                    options: [
                        { name: 'Mutlu', value: 'mutlu' },
                        { name: 'Hüzünlü', value: 'hüzünlü' },
                        { name: 'Enerjik', value: 'enerjik' },
                        { name: 'Sakin', value: 'sakin' },
                        { name: 'Romantik', value: 'romantik' },
                        { name: 'Nostaljik', value: 'nostaljik' },
                    ],
                    default: 'mutlu',
                },
                {
                    displayName: 'Müzik ID',
                    name: 'muzik_id',
                    type: 'number',
                    default: 0,
                    displayOptions: { show: { resource: ['muzik'], operation: ['detay'] } },
                    required: true,
                },
                // ─── KULLANICI ──────────────────────────────────────────────
                {
                    displayName: 'İşlem',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['kullanici'] } },
                    options: [
                        { name: 'Bilgileri Getir', value: 'getir', action: 'Kullanıcı bilgilerini getir' },
                    ],
                    default: 'getir',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('omminiApi');
        const email = credentials.email;
        const password = credentials.password;
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            try {
                let responseData;
                // ─── GÖNDERİ ──────────────────────────────────────────
                if (resource === 'gonderi') {
                    const token = await getToken(email, password, this);
                    const headers = {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    };
                    if (operation === 'olustur') {
                        // /api/v1/post/create — X-API-Key ile de çalışır ama JWT kullanıyoruz
                        // Alternatif: /gonderi-kaydet JWT ile
                        const body = {
                            baslik: this.getNodeParameter('baslik', i),
                            icerik: this.getNodeParameter('icerik', i),
                            platform: this.getNodeParameter('platform', i),
                            durum: 'taslak',
                        };
                        const res = await this.helpers.request({
                            method: 'POST',
                            url: `${BASE_URL}/gonderi-kaydet`,
                            headers,
                            body: JSON.stringify(body),
                        });
                        responseData = JSON.parse(res);
                    }
                    else if (operation === 'takvim') {
                        const body = {
                            baslik: this.getNodeParameter('baslik', i),
                            icerik: this.getNodeParameter('icerik', i),
                            platform: this.getNodeParameter('takvim_platform', i),
                            planlanan_tarih: this.getNodeParameter('yayin_zamani', i),
                        };
                        const res = await this.helpers.request({
                            method: 'POST',
                            url: `${BASE_URL}/takvim-ekle`,
                            headers,
                            body: JSON.stringify(body),
                        });
                        responseData = JSON.parse(res);
                    }
                    else if (operation === 'listele') {
                        const res = await this.helpers.request({
                            method: 'GET',
                            url: `${BASE_URL}/gonderiler-getir`,
                            headers,
                        });
                        responseData = JSON.parse(res);
                    }
                }
                // ─── GÖRSEL ───────────────────────────────────────────
                else if (resource === 'gorsel') {
                    const token = await getToken(email, password, this);
                    const headers = {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    };
                    if (operation === 'uret') {
                        const body = {
                            prompt: this.getNodeParameter('gorsel_prompt', i),
                            oran: this.getNodeParameter('gorsel_oran', i),
                        };
                        const res = await this.helpers.request({
                            method: 'POST',
                            url: `${BASE_URL}/gorsel-uret`,
                            headers,
                            body: JSON.stringify(body),
                        });
                        responseData = JSON.parse(res);
                    }
                }
                // ─── VİDEO ────────────────────────────────────────────
                else if (resource === 'video') {
                    const token = await getToken(email, password, this);
                    const headers = {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    };
                    if (operation === 'olustur') {
                        const body = {
                            prompt: this.getNodeParameter('prompt', i),
                            stil: this.getNodeParameter('stil', i),
                            sure: this.getNodeParameter('sure', i),
                            oran: this.getNodeParameter('oran', i),
                        };
                        const res = await this.helpers.request({
                            method: 'POST',
                            url: `${BASE_URL}/video-uret`,
                            headers,
                            body: JSON.stringify(body),
                        });
                        responseData = JSON.parse(res);
                    }
                    else if (operation === 'durum') {
                        const videoId = this.getNodeParameter('video_id', i);
                        const res = await this.helpers.request({
                            method: 'GET',
                            url: `${BASE_URL}/video-durum/${videoId}`,
                            headers,
                        });
                        responseData = JSON.parse(res);
                    }
                    else if (operation === 'listele') {
                        const res = await this.helpers.request({
                            method: 'GET',
                            url: `${BASE_URL}/videolari-getir`,
                            headers,
                        });
                        responseData = JSON.parse(res);
                    }
                }
                // ─── MÜZİK ────────────────────────────────────────────
                else if (resource === 'muzik') {
                    const token = await getToken(email, password, this);
                    const headers = {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    };
                    if (operation === 'uret') {
                        const body = {
                            baslik: this.getNodeParameter('muzik_baslik', i),
                            tarz: this.getNodeParameter('tarz', i),
                            tip: this.getNodeParameter('tip', i),
                            mood: this.getNodeParameter('mood', i),
                            tempo: 'orta',
                            ai_sozler: 0,
                        };
                        const res = await this.helpers.request({
                            method: 'POST',
                            url: `${BASE_URL}/muzik/uret`,
                            headers,
                            body: JSON.stringify(body),
                        });
                        responseData = JSON.parse(res);
                    }
                    else if (operation === 'listele') {
                        const res = await this.helpers.request({
                            method: 'GET',
                            url: `${BASE_URL}/muzik/liste`,
                            headers,
                        });
                        responseData = JSON.parse(res);
                    }
                    else if (operation === 'detay') {
                        const muzikId = this.getNodeParameter('muzik_id', i);
                        const res = await this.helpers.request({
                            method: 'GET',
                            url: `${BASE_URL}/muzik/detay/${muzikId}`,
                            headers,
                        });
                        responseData = JSON.parse(res);
                    }
                }
                // ─── KULLANICI ─────────────────────────────────────────
                else if (resource === 'kullanici' && operation === 'getir') {
                    const token = await getToken(email, password, this);
                    const res = await this.helpers.request({
                        method: 'GET',
                        url: `${BASE_URL}/beni-getir`,
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    responseData = JSON.parse(res);
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Desteklenmeyen işlem: ${resource}/${operation}`);
                }
                returnData.push({ json: responseData });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Ommini = Ommini;
//# sourceMappingURL=Ommini.node.js.map