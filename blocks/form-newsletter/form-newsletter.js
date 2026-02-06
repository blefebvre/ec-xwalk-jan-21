function createFormElements(row) {
  const contentDiv = row.querySelector('div');
  if (!contentDiv) return;

  // Get all text content from paragraphs
  const paragraphs = contentDiv.querySelectorAll('p');
  let emailPlaceholder = 'Enter your email';
  let dropdownOptions = ['I am in....', 'Law Enforcement', 'Fire', 'EMS', 'Emergency Communications', 'Other Public Safety'];

  paragraphs.forEach((p) => {
    const text = p.textContent.trim();
    if (text.toLowerCase().includes('email')) {
      emailPlaceholder = text;
    } else if (text.startsWith('Options:')) {
      // Parse options from "Options: opt1, opt2, opt3" format
      const optionsText = text.replace('Options:', '').trim();
      dropdownOptions = optionsText.split(',').map((opt) => opt.trim());
    }
  });

  // Clear existing content
  contentDiv.innerHTML = '';

  // Create form element
  const form = document.createElement('form');
  form.setAttribute('aria-label', 'Email Subscription Form');

  // Create email input
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = emailPlaceholder;
  emailInput.required = true;
  emailInput.setAttribute('aria-label', 'email address');
  form.appendChild(emailInput);

  // Create category dropdown
  const select = document.createElement('select');
  select.name = 'category';
  select.setAttribute('aria-label', 'category');

  dropdownOptions.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
    opt.textContent = option;
    select.appendChild(opt);
  });
  form.appendChild(select);

  // Create submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Submit';
  form.appendChild(submitBtn);

  // Prevent actual form submission (for demo)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-alert
    alert('Thank you for subscribing!');
  });

  contentDiv.appendChild(form);
}

export default function decorate(block) {
  const rows = [...block.children];
  const leftColumn = document.createElement('div');
  leftColumn.className = 'form-newsletter-left';
  const rightColumn = document.createElement('div');
  rightColumn.className = 'form-newsletter-right';

  rows.forEach((row, index) => {
    if (index === 0) {
      row.classList.add('form-newsletter-heading');
      leftColumn.appendChild(row);
    } else if (index === 1) {
      row.classList.add('form-newsletter-subheading');
      leftColumn.appendChild(row);
    } else if (index === 2) {
      row.classList.add('form-newsletter-form');
      createFormElements(row);
      rightColumn.appendChild(row);
    }
  });

  const disclaimer = document.createElement('p');
  disclaimer.className = 'form-newsletter-disclaimer';
  disclaimer.textContent = 'By clicking Submit, you consent to AT&T sending you email about FirstNet services, products and offers at the address you provide, even if you have previously opted out of receiving AT&T marketing emails.';
  leftColumn.appendChild(disclaimer);

  block.innerHTML = '';
  block.appendChild(leftColumn);
  block.appendChild(rightColumn);
}
