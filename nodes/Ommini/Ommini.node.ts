import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Ommini implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ommini',
		name: 'ommini',
		icon: 'file:ommini.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Ommini AI Social Media Platform ile içerik üretin ve paylaşın',
		defaults: {
			name: 'Ommini',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'omminiApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://ommini.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// RESOURCE
			{
				displayName: 'Kaynak',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'İçerik', value: 'icerik' },
					{ name: 'Gönderi', value: 'gonderi' },
					{ name: 'Video', value: 'video' },
					{ name: 'Müzik', value: 'muzik' },
					{ name: 'Kullanıcı', value: 'kullanici' },
				],
				default: 'icerik',
			},

			// ─── İÇERİK ───────────────────────────────────────────────
			{
				displayName: 'İşlem',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['icerik'] } },
				options: [
					{ name: 'Oluştur', value: 'olustur', description: 'AI ile içerik üret', action: 'İçerik oluştur' },
				],
				default: 'olustur',
			},
			{
				displayName: 'Konu',
				name: 'konu',
				type: 'string',
				default: '',
				placeholder: 'İçerik konusunu yazın...',
				displayOptions: { show: { resource: ['icerik'], operation: ['olustur'] } },
				required: true,
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				displayOptions: { show: { resource: ['icerik'], operation: ['olustur'] } },
				options: [
					{ name: 'Instagram', value: 'instagram' },
					{ name: 'Twitter / X', value: 'twitter' },
					{ name: 'LinkedIn', value: 'linkedin' },
					{ name: 'Facebook', value: 'facebook' },
					{ name: 'TikTok', value: 'tiktok' },
					{ name: 'YouTube', value: 'youtube' },
				],
				default: 'instagram',
			},
			{
				displayName: 'İçerik Türü',
				name: 'icerik_turu',
				type: 'options',
				displayOptions: { show: { resource: ['icerik'], operation: ['olustur'] } },
				options: [
					{ name: 'Gönderi', value: 'gonderi' },
					{ name: 'Hikaye', value: 'hikaye' },
					{ name: 'Video Scripti', value: 'video_script' },
					{ name: 'Thread', value: 'thread' },
				],
				default: 'gonderi',
			},
			{
				displayName: 'Dil',
				name: 'dil',
				type: 'options',
				displayOptions: { show: { resource: ['icerik'], operation: ['olustur'] } },
				options: [
					{ name: 'Türkçe', value: 'tr' },
					{ name: 'İngilizce', value: 'en' },
				],
				default: 'tr',
			},

			// ─── GÖNDERİ ──────────────────────────────────────────────
			{
				displayName: 'İşlem',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['gonderi'] } },
				options: [
					{ name: 'Paylaş', value: 'paylas', description: 'Sosyal medyada paylaş', action: 'Gönderi paylaş' },
					{ name: 'Takvime Ekle', value: 'takvim', description: 'Zamanlanmış paylaşım oluştur', action: 'Takvime ekle' },
				],
				default: 'paylas',
			},
			{
				displayName: 'İçerik',
				name: 'icerik',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				displayOptions: { show: { resource: ['gonderi'] } },
				required: true,
			},
			{
				displayName: 'Platform',
				name: 'gonderi_platform',
				type: 'multiOptions',
				displayOptions: { show: { resource: ['gonderi'], operation: ['paylas'] } },
				options: [
					{ name: 'Instagram', value: 'instagram' },
					{ name: 'Twitter / X', value: 'twitter' },
					{ name: 'LinkedIn', value: 'linkedin' },
					{ name: 'Facebook', value: 'facebook' },
					{ name: 'TikTok', value: 'tiktok' },
				],
				default: ['instagram'],
				required: true,
			},
			{
				displayName: 'Görsel URL (opsiyonel)',
				name: 'gorsel_url',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['gonderi'] } },
			},
			{
				displayName: 'Yayın Zamanı',
				name: 'yayin_zamani',
				type: 'dateTime',
				default: '',
				displayOptions: { show: { resource: ['gonderi'], operation: ['takvim'] } },
				required: true,
			},

			// ─── VİDEO ────────────────────────────────────────────────
			{
				displayName: 'İşlem',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['video'] } },
				options: [
					{ name: 'Pipeline Önizle', value: 'pipeline_onizle', description: 'Senaryo ve narrasyon üret', action: 'Pipeline önizle' },
					{ name: 'Pipeline Üret', value: 'pipeline_uret', description: 'Video üretimini başlat', action: 'Pipeline üret' },
					{ name: 'Durum Sorgula', value: 'durum', description: 'Video üretim durumunu öğren', action: 'Durum sorgula' },
				],
				default: 'pipeline_onizle',
			},
			{
				displayName: 'Konu',
				name: 'video_konu',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['video'], operation: ['pipeline_onizle', 'pipeline_uret'] } },
				required: true,
			},
			{
				displayName: 'Şablon',
				name: 'sablon',
				type: 'options',
				displayOptions: { show: { resource: ['video'], operation: ['pipeline_onizle', 'pipeline_uret'] } },
				options: [
					{ name: 'Eğitici', value: 'egitici' },
					{ name: 'Tanıtım', value: 'tanitim' },
					{ name: 'Hikaye', value: 'hikaye' },
					{ name: 'Ürün', value: 'urun' },
				],
				default: 'egitici',
			},
			{
				displayName: 'Sahne Sayısı',
				name: 'sahne_sayisi',
				type: 'number',
				typeOptions: { minValue: 2, maxValue: 5 },
				default: 3,
				displayOptions: { show: { resource: ['video'], operation: ['pipeline_onizle', 'pipeline_uret'] } },
			},
			{
				displayName: 'Görev ID',
				name: 'gorev_id',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['video'], operation: ['durum'] } },
				required: true,
			},

			// ─── MÜZİK ────────────────────────────────────────────────
			{
				displayName: 'İşlem',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['muzik'] } },
				options: [
					{ name: 'Üret', value: 'uret', description: 'AI ile müzik üret', action: 'Müzik üret' },
				],
				default: 'uret',
			},
			{
				displayName: 'Konu',
				name: 'muzik_konu',
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
					{ name: 'Pop', value: 'pop' },
					{ name: 'Rock', value: 'rock' },
					{ name: 'Arabesk', value: 'arabesk' },
					{ name: 'Türk Halk Müziği', value: 'halk' },
					{ name: 'Electronic', value: 'electronic' },
					{ name: 'Jazz', value: 'jazz' },
					{ name: 'Enstrümantal', value: 'enstrumantal' },
				],
				default: 'pop',
			},

			// ─── KULLANICI ─────────────────────────────────────────────
			{
				displayName: 'İşlem',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['kullanici'] } },
				options: [
					{ name: 'Bilgileri Getir', value: 'getir', description: 'Kullanıcı bilgilerini ve kredi bakiyesini al', action: 'Kullanıcı bilgilerini getir' },
				],
				default: 'getir',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('omminiApi');
		const baseURL = 'https://ommini.com';
		const headers = {
			Authorization: `Bearer ${credentials.apiKey}`,
			'Content-Type': 'application/json',
		};

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			try {
				let responseData: any;

				// ─── İÇERİK ───────────────────────────────────────────
				if (resource === 'icerik' && operation === 'olustur') {
					const body = {
						konu: this.getNodeParameter('konu', i),
						platform: this.getNodeParameter('platform', i),
						icerik_turu: this.getNodeParameter('icerik_turu', i),
						dil: this.getNodeParameter('dil', i),
					};
					const res = await this.helpers.request({
						method: 'POST',
						url: `${baseURL}/icerik-olustur`,
						headers,
						body: JSON.stringify(body),
					});
					responseData = JSON.parse(res);
				}

				// ─── GÖNDERİ ──────────────────────────────────────────
				else if (resource === 'gonderi' && operation === 'paylas') {
					const platformlar = this.getNodeParameter('gonderi_platform', i) as string[];
					const sonuclar: any[] = [];
					for (const platform of platformlar) {
						const body: any = {
							icerik: this.getNodeParameter('icerik', i),
							platform,
						};
						const gorsel = this.getNodeParameter('gorsel_url', i) as string;
						if (gorsel) body.gorsel_url = gorsel;

						const res = await this.helpers.request({
							method: 'POST',
							url: `${baseURL}/gonderi-olustur`,
							headers,
							body: JSON.stringify(body),
						});
						sonuclar.push({ platform, ...JSON.parse(res) });
					}
					responseData = { sonuclar };
				}

				else if (resource === 'gonderi' && operation === 'takvim') {
					const body: any = {
						icerik: this.getNodeParameter('icerik', i),
						yayin_zamani: this.getNodeParameter('yayin_zamani', i),
					};
					const gorsel = this.getNodeParameter('gorsel_url', i) as string;
					if (gorsel) body.gorsel_url = gorsel;

					const res = await this.helpers.request({
						method: 'POST',
						url: `${baseURL}/takvim-ekle`,
						headers,
						body: JSON.stringify(body),
					});
					responseData = JSON.parse(res);
				}

				// ─── VİDEO ────────────────────────────────────────────
				else if (resource === 'video' && operation === 'pipeline_onizle') {
					const body = {
						konu: this.getNodeParameter('video_konu', i),
						sablon: this.getNodeParameter('sablon', i),
						sahne_sayisi: this.getNodeParameter('sahne_sayisi', i),
					};
					const res = await this.helpers.request({
						method: 'POST',
						url: `${baseURL}/video-pipeline-onizle`,
						headers,
						body: JSON.stringify(body),
					});
					responseData = JSON.parse(res);
				}

				else if (resource === 'video' && operation === 'pipeline_uret') {
					const body = {
						konu: this.getNodeParameter('video_konu', i),
						sablon: this.getNodeParameter('sablon', i),
						sahne_sayisi: this.getNodeParameter('sahne_sayisi', i),
					};
					const res = await this.helpers.request({
						method: 'POST',
						url: `${baseURL}/video-pipeline-baslat`,
						headers,
						body: JSON.stringify(body),
					});
					responseData = JSON.parse(res);
				}

				else if (resource === 'video' && operation === 'durum') {
					const gorevId = this.getNodeParameter('gorev_id', i) as string;
					const res = await this.helpers.request({
						method: 'GET',
						url: `${baseURL}/video-durum/${gorevId}`,
						headers,
					});
					responseData = JSON.parse(res);
				}

				// ─── MÜZİK ────────────────────────────────────────────
				else if (resource === 'muzik' && operation === 'uret') {
					const body = {
						konu: this.getNodeParameter('muzik_konu', i),
						tarz: this.getNodeParameter('tarz', i),
					};
					const res = await this.helpers.request({
						method: 'POST',
						url: `${baseURL}/muzik/uret`,
						headers,
						body: JSON.stringify(body),
					});
					responseData = JSON.parse(res);
				}

				// ─── KULLANICI ─────────────────────────────────────────
				else if (resource === 'kullanici' && operation === 'getir') {
					const res = await this.helpers.request({
						method: 'GET',
						url: `${baseURL}/beni-getir`,
						headers,
					});
					responseData = JSON.parse(res);
				}

				else {
					throw new NodeOperationError(this.getNode(), `Desteklenmeyen işlem: ${resource}/${operation}`);
				}

				returnData.push({ json: responseData });

			} catch (error) {
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
