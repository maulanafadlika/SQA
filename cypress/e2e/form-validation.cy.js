// DemoQA sering melempar error dari iklan; abaikan agar test tidak gagal
Cypress.on('uncaught:exception', () => false)

describe('Validasi Form', () => {
  const red = 'rgb(220, 53, 69)'

  it('Login gagal: username salah', () => {
    cy.visit('https://the-internet.herokuapp.com/login')
    cy.get('#username').type('salah')
    cy.get('#password').type('salah')
    cy.get('button[type=submit]').click()
    cy.get('#flash').should('contain', 'Your username is invalid!')
  })

  it('Login berhasil', () => {
    cy.visit('https://the-internet.herokuapp.com/login')
    cy.get('#username').type('tomsmith')
    cy.get('#password').type('SuperSecretPassword!')
    cy.get('button[type=submit]').click()
    cy.get('#flash').should('contain', 'You logged into a secure area!')
  })

  it('DemoQA: submit kosong, field wajib jadi merah', () => {
    cy.visit('https://demoqa.com/automation-practice-form')
    cy.get('#submit').click({ force: true })
    cy.get('#firstName').should('have.css', 'border-color', red)
    cy.get('#lastName').should('have.css', 'border-color', red)
    cy.get('#userNumber').should('have.css', 'border-color', red)
  })

  it('DemoQA: email tidak valid ditolak', () => {
    cy.visit('https://demoqa.com/automation-practice-form')
    cy.get('#firstName').type('Fadli')
    cy.get('#lastName').type('Maulana')
    cy.get('#userEmail').type('email-salah')
    cy.get('label[for="gender-radio-1"]').click()
    cy.get('#userNumber').type('0812345678')
    cy.get('#submit').click({ force: true })
    cy.get('#userEmail').should('have.css', 'border-color', red)
    cy.get('#example-modal-sizes-title-lg').should('not.exist')
  })

  it('DemoQA: nomor HP kurang dari 10 digit harus ditolak', () => {
    cy.visit('https://demoqa.com/automation-practice-form')
    cy.get('#firstName').type('Fadli')
    cy.get('#lastName').type('Maulana')
    cy.get('label[for="gender-radio-1"]').click()
    cy.get('#userNumber').type('123')
    cy.get('#submit').click({ force: true })
    // Form tidak boleh terkirim
    cy.get('#example-modal-sizes-title-lg').should('not.exist')
  })

  it('DemoQA: submit valid, modal konfirmasi muncul', () => {
    cy.visit('https://demoqa.com/automation-practice-form')
    cy.get('#firstName').type('Fadli')
    cy.get('#lastName').type('Maulana')
    cy.get('#userEmail').type('fadli@test.com')
    cy.get('label[for="gender-radio-1"]').click()
    cy.get('#userNumber').type('0812345678')
    cy.get('#submit').click({ force: true })
    cy.get('#example-modal-sizes-title-lg').should('contain', 'Thanks for submitting the form')
  })
})