'use strict';

const mobileMenu = document.querySelector('.mobile-menu');
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => { mobileMenu.open = false; });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenu.open) {
    mobileMenu.open = false;
    mobileMenu.querySelector('summary').focus();
  }
});
document.addEventListener('click', (event) => {
  if (mobileMenu.open && !mobileMenu.contains(event.target)) mobileMenu.open = false;
});

const enquiryForm = document.querySelector('#pieprasijums');
const requiredFields = ['name', 'email', 'message'].map((id) => document.getElementById(id));
const errorSummary = document.querySelector('#form-errors');
const formStatus = document.querySelector('#form-status');
const formResult = enquiryForm.querySelector('.form-result');
const copyButton = enquiryForm.querySelector('.copy-message');
const preparedMessage = enquiryForm.querySelector('.prepared-message');
let submitted = false;
let copyText = '';

// Native validation remains available when JavaScript is disabled.
enquiryForm.noValidate = true;

function fieldError(field) {
  const value = field.value.trim();
  if (!value) return {
    name: 'Ievadiet savu vārdu.',
    email: 'Ievadiet savu e-pasta adresi.',
    message: 'Īsi aprakstiet savu ieceri.',
  }[field.id];
  if (field.id === 'email' && field.validity.typeMismatch) {
    return 'Pārbaudiet e-pasta adresi, piemēram, vards@epasts.lv.';
  }
  return '';
}

function renderFieldError(field) {
  const message = fieldError(field);
  const error = document.getElementById(`${field.id}-error`);
  error.textContent = message;
  error.hidden = !message;
  if (message) {
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', error.id);
  } else {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }
  return message;
}

function renderErrorSummary() {
  const invalid = requiredFields.filter((field) => field.getAttribute('aria-invalid') === 'true');
  const list = errorSummary.querySelector('ul');
  list.replaceChildren();
  invalid.forEach((field) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${field.id}`;
    link.textContent = document.getElementById(`${field.id}-error`).textContent;
    link.addEventListener('click', (event) => { event.preventDefault(); field.focus(); });
    item.append(link);
    list.append(item);
  });
  errorSummary.hidden = invalid.length === 0;
  return invalid;
}

function clearPreparedMessage() {
  if (!copyText) return;
  copyText = '';
  formResult.hidden = true;
  formStatus.textContent = '';
  preparedMessage.value = '';
  preparedMessage.hidden = true;
  copyButton.textContent = 'Kopēt ziņu';
}

requiredFields.forEach((field) => {
  field.addEventListener('blur', () => {
    if (!submitted && !field.value) return;
    renderFieldError(field);
    if (submitted) renderErrorSummary();
  });
  field.addEventListener('input', () => {
    // Clear an existing error as soon as it is corrected; do not interrupt typing with new errors.
    if (field.getAttribute('aria-invalid') === 'true' && !fieldError(field)) {
      renderFieldError(field);
      if (submitted) renderErrorSummary();
    }
  });
});
enquiryForm.addEventListener('input', clearPreparedMessage);
enquiryForm.addEventListener('change', clearPreparedMessage);

enquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  submitted = true;
  requiredFields.forEach(renderFieldError);
  const invalid = renderErrorSummary();
  if (invalid.length) {
    clearPreparedMessage();
    (invalid.length > 1 ? errorSummary : invalid[0]).focus();
    return;
  }
  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const service = document.querySelector('#service').value;
  const message = document.querySelector('#message').value.trim();
  const subject = `${service}: pieprasījums no ${name}`;
  const body = `Labdien!\r\n\r\n${message}\r\n\r\nPakalpojums: ${service}\r\nVārds: ${name}\r\nE-pasts: ${email}`;
  const mailto = `mailto:partneris.sia@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formResult.querySelector('a').href = mailto;
  copyText = `Kam: partneris.sia@gmail.com\r\nTemats: ${subject}\r\n\r\n${body}`;
  formResult.hidden = false;
  preparedMessage.hidden = true;
  copyButton.textContent = 'Kopēt ziņu';
  formStatus.textContent = 'Vēstule ir sagatavota. Ja e-pasta lietotne neatvērās, nokopējiet ziņu un nosūtiet to uz partneris.sia@gmail.com.';
  window.location.href = mailto;
});

copyButton.addEventListener('click', async () => {
  if (!copyText) return;
  const textToCopy = copyText;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(textToCopy);
    if (copyText !== textToCopy) return;
    copyButton.textContent = 'Ziņa nokopēta';
    formStatus.textContent = 'Ziņa nokopēta. Ielīmējiet to savā e-pastā un nosūtiet uz partneris.sia@gmail.com.';
  } catch {
    if (copyText !== textToCopy) return;
    preparedMessage.value = copyText;
    preparedMessage.hidden = false;
    formStatus.textContent = 'Automātiska kopēšana nav pieejama. Nokopējiet atlasīto vēstules tekstu un ielīmējiet to savā e-pastā.';
    preparedMessage.focus();
    preparedMessage.select();
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
