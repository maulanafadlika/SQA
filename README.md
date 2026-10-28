# Otomatisasi Pengujian Elemen Interaktif Dinamis dan Kontrol Validasi Form Menggunakan Cypress

**Kelompok 13** — Penanganan Elemen UI Dinamis dan Penanganan Error Form

Proyek ini berisi pengujian end-to-end (E2E) otomatis menggunakan **Cypress** terhadap elemen UI dinamis dan validasi form, dilengkapi pengujian performa menggunakan **Apache JMeter**.

## Anggota Kelompok

| No | Nama | NIM | Peran |
|----|------|-----|-------|
| 1 |  |  |  |
| 2 |  |  |  |
| 3 |  |  |  |
| 4 |  |  |  |

## Target Pengujian

| Situs | Halaman yang diuji |
|-------|--------------------|
| [The Internet HerokuApp](https://the-internet.herokuapp.com) | Dynamic Loading, Dynamic Controls, Add/Remove Elements, Form Authentication |
| [DemoQA](https://demoqa.com) | Practice Form (`/automation-practice-form`) |

## Tools

- Cypress 16.2.0 (E2E testing)
- Node.js v24
- cypress-mochawesome-reporter (HTML report)
- Apache JMeter (performance testing)

## Struktur Proyek

```
SQA/
├── cypress/
│   ├── e2e/
│   │   ├── dynamic-elements.cy.js   # Pengujian elemen UI dinamis
│   │   └── form-validation.cy.js    # Pengujian validasi form
│   ├── support/
│   │   └── e2e.js                   # Reporter + blokir request iklan/analitik
│   ├── reports/html/                # HTML report + video hasil run
│   └── screenshots/                 # Screenshot otomatis saat test gagal
├── cypress.config.js
├── package.json
└── README.md
```

## Cara Menjalankan

1. Install dependency:
   ```
   npm install
   ```
2. Mode interaktif (GUI):
   ```
   npx cypress open
   ```
   Pilih **E2E Testing** → **Chrome** → klik spec yang ingin dijalankan.
3. Mode headless + generate report & video:
   ```
   npx cypress run --browser chrome
   ```
   Report tersimpan di `cypress/reports/html/index.html`.

## Skenario & Test Case

### A. Elemen UI Dinamis (`dynamic-elements.cy.js`)

| ID | Skenario | Halaman | Expected Result | Status |
|----|----------|---------|-----------------|--------|
| TC-01 | Klik Start, tunggu konten dimuat | Dynamic Loading | Loading muncul, lalu teks "Hello World!" tampil | ✅ Pass |
| TC-02 | Klik Remove pada checkbox | Dynamic Controls | Pesan "It's gone!" muncul, checkbox hilang dari DOM | ✅ Pass |
| TC-03 | Klik Enable pada input | Dynamic Controls | Input berubah dari disabled menjadi enabled dan bisa diketik | ✅ Pass |
| TC-04 | Tambah 3 elemen lalu hapus 1 | Add/Remove Elements | Jumlah tombol Delete 3 → 2 | ✅ Pass |

### B. Validasi Form (`form-validation.cy.js`)

| ID | Skenario | Halaman | Expected Result | Status |
|----|----------|---------|-----------------|--------|
| TC-05 | Login dengan username salah | Form Authentication | Pesan "Your username is invalid!" | ✅ Pass |
| TC-06 | Login dengan kredensial benar | Form Authentication | Pesan "You logged into a secure area!" | ✅ Pass |
| TC-07 | Submit form kosong | DemoQA Practice Form | Field wajib (First Name, Last Name, Mobile) bertanda merah | ✅ Pass |
| TC-08 | Email format tidak valid | DemoQA Practice Form | Field email merah, form tidak terkirim | ✅ Pass |
| TC-09 | Nomor HP kurang dari 10 digit (`123`) | DemoQA Practice Form | Form ditolak | ❌ Fail (BUG-01) |
| TC-10 | Submit dengan data valid | DemoQA Practice Form | Modal "Thanks for submitting the form" muncul | ✅ Pass |

## Hasil Pengujian

| Spec | Tests | Passing | Failing | Durasi |
|------|-------|---------|---------|--------|
| dynamic-elements.cy.js | 4 | 4 | 0 | 21 detik |
| form-validation.cy.js | 6 | 5 | 1 | 33 detik |
| **Total** | **10** | **9** | **1** | **54 detik** |

Satu kegagalan disebabkan oleh defect pada situs target (BUG-01), bukan kesalahan script pengujian.

## Defect yang Ditemukan

### BUG-01 — Validasi nomor HP tidak berjalan

| Item | Keterangan |
|------|------------|
| Halaman | https://demoqa.com/automation-practice-form |
| Langkah | Isi First Name, Last Name, Gender, Mobile = `123`, lalu klik Submit |
| Expected | Form ditolak dan field Mobile bertanda merah (label menyebut "10 Digits") |
| Actual | Form tetap terkirim dan modal konfirmasi muncul |
| Severity | Medium |
| Bukti | `cypress/screenshots/form-validation.cy.js/` dan video `form-validation.cy.js.mp4` |

## Catatan Teknis

- Request iklan dan analitik (Optimizely, DoubleClick, Google Analytics, dll.) diblokir dengan `cy.intercept` agar pengujian lebih cepat dan stabil.
- `uncaught:exception` dari script pihak ketiga di DemoQA diabaikan agar tidak menggagalkan test.
- Elemen dinamis ditangani dengan assertion + timeout (retry otomatis Cypress), bukan `cy.wait()` statis.

## Pengujian Performa (JMeter)

Test plan JMeter (`.jmx`) dan hasilnya disimpan di folder `jmeter/`.
