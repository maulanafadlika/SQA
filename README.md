# Otomatisasi Pengujian Elemen Interaktif Dinamis dan Kontrol Validasi Form Menggunakan Cypress

**Kelompok 13** — Penanganan Elemen UI Dinamis dan Penanganan Error Form

Repository ini berisi skrip pengujian end-to-end (E2E) otomatis menggunakan **Cypress** terhadap elemen UI dinamis dan validasi form pada **The Internet HerokuApp** dan **DemoQA**, lengkap dengan bukti assertion (HTML report) dan rekaman video otomatisasi.

## Anggota Kelompok

| No | NIM | Nama | Peran | Test Case |
|----|-----|------|-------|-----------|
| 1 | 2023000801194 | Mokhamad Fadlika Maulana | QA Lead & Setup Proyek | Setup, config, support, review & run seluruh test |
| 2 | 20230801220 | Luthfan Putra Prakarsa | E2E Tester – Dynamic Loading & Add/Remove Elements | TC-01, TC-04 |
| 3 | 20230801198 | Muhammad Jarez | E2E Tester – Dynamic Controls | TC-02, TC-03 |
| 4 | 20230801270 | Muhamad Rohisul Iman | E2E Tester – Form Authentication (HerokuApp) | TC-05, TC-06 |
| 5 | 20230801155 | Muhammad Alvin Pratama | E2E Tester – Validasi Field DemoQA | TC-07, TC-08 |
| 6 | 20240801092 | Fiery Ardiansyah | E2E Tester & Bug Reporter – DemoQA | TC-09, TC-10, BUG-01 |

## Output Wajib

| Output | Lokasi |
|--------|--------|
| Repository kode skrip Cypress (`.cy.js`) | `cypress/e2e/` |
| Bukti assertion yang sukses | `cypress/reports/html/index.html` |
| Rekaman video otomatisasi Cypress | `cypress/videos/` (juga disalin ke `cypress/reports/html/videos/`) |

## Target Pengujian

| Situs | Halaman yang diuji |
|-------|--------------------|
| [The Internet HerokuApp](https://the-internet.herokuapp.com) | Dynamic Loading, Dynamic Controls, Add/Remove Elements, Form Authentication |
| [DemoQA](https://demoqa.com) | Practice Form (`/automation-practice-form`) |

## Tools

- Cypress 16.2.0
- Node.js v24
- cypress-mochawesome-reporter (HTML report)
- Browser Chrome

## Struktur Proyek

```
SQA/
├── cypress/
│   ├── e2e/
│   │   ├── dynamic-elements.cy.js   # TC-01 s.d. TC-04 (elemen UI dinamis)
│   │   └── form-validation.cy.js    # TC-05 s.d. TC-10 (validasi form)
│   ├── support/
│   │   └── e2e.js                   # Reporter + blokir request iklan/analitik
│   ├── reports/html/                # HTML report (bukti assertion) + video
│   ├── videos/                      # Rekaman video per spec
│   └── screenshots/                 # Screenshot otomatis saat test gagal
├── cypress.config.js
├── package.json
└── README.md
```

## Cara Menjalankan

1. Clone repository dan install dependency:
   ```
   git clone https://github.com/maulanafadlika/SQA.git
   cd SQA
   npm install
   ```
2. Mode interaktif (Cypress Test Runner):
   ```
   npx cypress open
   ```
   Pilih **E2E Testing** → **Chrome** → klik spec yang ingin dijalankan.
3. Mode headless untuk membuat HTML report dan video:
   ```
   npx cypress run --browser chrome
   ```
   Report tersimpan di `cypress/reports/html/index.html`, video di `cypress/videos/`.

## Skenario & Test Case

### A. Elemen UI Dinamis (`dynamic-elements.cy.js`)

| ID | Skenario | Halaman | Expected Result | Status | PIC |
|----|----------|---------|-----------------|--------|-----|
| TC-01 | Klik Start, tunggu konten dimuat | Dynamic Loading | Indikator loading muncul, lalu teks "Hello World!" tampil | ✅ Pass | Luthfan |
| TC-02 | Klik Remove pada checkbox | Dynamic Controls | Pesan "It's gone!" muncul, checkbox hilang dari DOM | ✅ Pass | Jarez |
| TC-03 | Klik Enable pada input | Dynamic Controls | Input berubah dari disabled menjadi enabled dan bisa diketik | ✅ Pass | Jarez |
| TC-04 | Tambah 3 elemen lalu hapus 1 | Add/Remove Elements | Jumlah tombol Delete berubah 3 → 2 | ✅ Pass | Luthfan |

### B. Validasi Form (`form-validation.cy.js`)

| ID | Skenario | Halaman | Expected Result | Status | PIC |
|----|----------|---------|-----------------|--------|-----|
| TC-05 | Login dengan username salah | Form Authentication | Pesan "Your username is invalid!" | ✅ Pass | Rohisul |
| TC-06 | Login dengan kredensial benar | Form Authentication | Pesan "You logged into a secure area!" | ✅ Pass | Rohisul |
| TC-07 | Submit form kosong | DemoQA Practice Form | Field wajib (First Name, Last Name, Mobile) bertanda merah | ✅ Pass | Alvin |
| TC-08 | Email format tidak valid | DemoQA Practice Form | Field email merah, form tidak terkirim | ✅ Pass | Alvin |
| TC-09 | Nomor HP kurang dari 10 digit (`123`) | DemoQA Practice Form | Form ditolak | ❌ Fail (BUG-01) | Fiery |
| TC-10 | Submit dengan data valid | DemoQA Practice Form | Modal "Thanks for submitting the form" muncul | ✅ Pass | Fiery |

## Hasil Pengujian

| Spec | Tests | Passing | Failing | Durasi |
|------|-------|---------|---------|--------|
| dynamic-elements.cy.js | 4 | 4 | 0 | 21 detik |
| form-validation.cy.js | 6 | 5 | 1 | 33 detik |
| **Total** | **10** | **9** | **1** | **54 detik** |

Satu kegagalan (TC-09) disebabkan oleh defect pada situs target (BUG-01), bukan kesalahan script pengujian.

## Defect yang Ditemukan

### BUG-01 — Validasi nomor HP tidak berjalan

| Item | Keterangan |
|------|------------|
| Halaman | https://demoqa.com/automation-practice-form |
| Steps to Reproduce | 1. Isi First Name dan Last Name<br>2. Pilih Gender<br>3. Isi Mobile = `123`<br>4. Klik Submit |
| Expected | Form ditolak dan field Mobile bertanda merah (label menyebut "10 Digits") |
| Actual | Form tetap terkirim dan modal "Thanks for submitting the form" muncul |
| Severity | Medium |
| Bukti | `cypress/screenshots/form-validation.cy.js/` dan video `cypress/videos/form-validation.cy.js.mp4` |
| Pelapor | Fiery Ardiansyah |

## Catatan Teknis

- Elemen dinamis ditangani dengan assertion + timeout (retry otomatis Cypress), bukan `cy.wait()` statis.
- Request iklan dan analitik (Optimizely, DoubleClick, Google Analytics, dll.) diblokir dengan `cy.intercept` agar pengujian lebih cepat dan stabil.
- `uncaught:exception` dari script pihak ketiga di DemoQA diabaikan agar tidak menggagalkan test.
- Video hanya direkam pada mode `npx cypress run`; mode `npx cypress open` digunakan untuk menampilkan proses pengujian secara interaktif di Test Runner.

## Di Luar Lingkup

Pengujian API (Postman), performa/beban (JMeter), keamanan, serta kompatibilitas lintas browser dan perangkat mobile tidak termasuk dalam proyek ini. Rincian lengkap tercantum di dokumen SQA Plan Kelompok 13.
