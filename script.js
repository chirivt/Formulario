const userRegex = /^(?=.*[a-z])(?=.*[0-9]).{6,16}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,10}$/;
    const phoneRegex = /^[0-9]{7,10}$/;

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const country = document.getElementById('country');
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');
    const confirm = document.getElementById('confirm');
    const btn = document.getElementById('btn-submit');
    const resumen = document.getElementById('resumen');
    const modal = document.getElementById('modal');
    const prefix = document.getElementById('prefix');

    const msgUsername = document.getElementById('msg-username');
    const msgEmail = document.getElementById('msg-email');
    const msgCountry = document.getElementById('msg-country');
    const msgPhone = document.getElementById('msg-phone');
    const msgPassword = document.getElementById('msg-password');
    const msgConfirm = document.getElementById('msg-confirm');

    const validations = {
      username: false,
      email: false,
      country: false,
      phone: false,
      password: false,
      confirm: false,
    };

    function validateInput(input, regex, msg) {
      const isValid = regex.test(input.value);
      input.classList.toggle('valid', isValid);
      input.classList.toggle('invalid', !isValid);
      msg.classList.toggle('visible', !isValid);
      validations[input.id] = isValid;
      toggleBtn();
    }

    function validateConfirm() {
      const isValid = confirm.value === password.value && confirm.value !== '';
      confirm.classList.toggle('valid', isValid);
      confirm.classList.toggle('invalid', !isValid);
      msgConfirm.classList.toggle('visible', !isValid);
      validations.confirm = isValid;
      toggleBtn();
    }

    function validateCountry() {
      const isValid = country.value !== '';
      country.classList.toggle('valid', isValid);
      country.classList.toggle('invalid', !isValid);
      msgCountry.classList.toggle('visible', !isValid);
      validations.country = isValid;
      prefix.innerText = country.value ? '+' + country.value : '+--';
      toggleBtn();
    }

    function togglePassword(id) {
      const field = document.getElementById(id);
      field.type = field.type === 'password' ? 'text' : 'password';
    }

    function toggleBtn() {
      btn.disabled = !Object.values(validations).every(Boolean);
    }

    username.addEventListener('input', () => validateInput(username, userRegex, msgUsername));
    email.addEventListener('input', () => validateInput(email, emailRegex, msgEmail));
    phone.addEventListener('input', () => validateInput(phone, phoneRegex, msgPhone));
    password.addEventListener('input', () => {
      validateInput(password, passRegex, msgPassword);
      validateConfirm();
    });
    confirm.addEventListener('input', validateConfirm);
    country.addEventListener('change', validateCountry);

    document.getElementById('formulario').addEventListener('submit', function (e) {
      e.preventDefault();
      const fullPhone = '+' + country.value + ' ' + phone.value;
      resumen.innerHTML = `
        <p><strong>Usuario:</strong> ${username.value}</p>
        <p><strong>Email:</strong> ${email.value}</p>
        <p><strong>Teléfono:</strong> ${fullPhone}</p>
        <p><strong>País:</strong> ${country.options[country.selectedIndex].text}</p>
      `;
      modal.style.display = 'flex';
    });

    function closeModal() {
      modal.style.display = 'none';
      document.getElementById('formulario').reset();
      [username, email, phone, password, confirm, country].forEach(input =>
        input.classList.remove('valid', 'invalid')
      );
      [msgUsername, msgEmail, msgCountry, msgPhone, msgPassword, msgConfirm].forEach(msg =>
        msg.classList.remove('visible')
      );
      Object.keys(validations).forEach(k => validations[k] = false);
      prefix.innerText = '+--';
      toggleBtn();
    }