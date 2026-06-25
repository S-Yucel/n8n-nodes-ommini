# n8n-nodes-ommini

Bu paket, [Ommini](https://ommini.com) AI Sosyal Medya Platformu için n8n community node'udur.

## Özellikler

- **İçerik Üret** — AI ile Instagram, Twitter, LinkedIn, Facebook, TikTok, YouTube için içerik oluştur
- **Gönderi Paylaş** — Birden fazla platforma tek seferde paylaş
- **Takvime Ekle** — Zamanlanmış paylaşım oluştur
- **Video Pipeline** — AI ile sahne sahne video senaryosu üret ve video başlat
- **Müzik Üret** — AI ile müzik üret (Pop, Rock, Arabesk, Halk Müziği...)
- **Kullanıcı Bilgisi** — Hesap bilgilerini ve kredi bakiyesini sorgula

## Kurulum

n8n'de **Settings → Community Nodes → Install** bölümünden `n8n-nodes-ommini` yazarak kurun.

## Credential Kurulumu

1. [ommini.com/api-anahtarlari](https://ommini.com/api-anahtarlari) sayfasından API anahtarınızı alın
2. n8n'de **Credentials → New → Ommini API** seçin
3. API anahtarınızı yapıştırın

## Örnek Workflow

```
[Schedule Trigger] → [Ommini: İçerik Oluştur] → [Ommini: Gönderi Paylaş]
```

## Lisans

MIT
