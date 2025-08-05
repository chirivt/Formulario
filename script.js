// === VALIDACIONES CON EXPRESIONES REGULARES ===

// Validación para el nombre de usuario:
// Debe tener al menos una letra minúscula y un número. Longitud entre 6 y 16 caracteres.
const userRegex = /^(?=.*[a-z])(?=.*[0-9]).{6,16}$/;

// Validación para el correo electrónico:
// Debe tener un formato tipo ejemplo@correo.com
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Validación para la contraseña:
// Al menos una letra mayúscula, una minúscula, un número y una longitud entre 6 y 10 caracteres.
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,10}$/;

// Validación para el número de teléfono:
// Solo acepta entre 7 y 10 dígitos numéricos.
const phoneRegex = /^[0-9]{7,10}$/;

// === CAPTURA DE ELEMENTOS DEL DOM ===
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

// Elementos para mostrar mensajes de error
const msgUsername = document.getElementById('msg-username');
const msgEmail = document.getElementById('msg-email');
const msgCountry = document.getElementById('msg-country');
const msgPhone = document.getElementById('msg-phone');
const msgPassword = document.getElementById('msg-password');
const msgConfirm = document.getElementById('msg-confirm');

// === OBJETO DE VALIDACIONES ===
// Lleva un registro de si cada campo está validado correctamente.
const validations = {
  username: false,
  email: false,
  country: false,
  phone: false,
  password: false,
  confirm: false,
};

// === FUNCIONES DE VALIDACIÓN ===

// Valida un campo usando su expresión regular y muestra visualmente si es válido o no.
function validateInput(input, regex, msg) {
  const isValid = regex.test(input.value);
  input.classList.toggle('valid', isValid);
  input.classList.toggle('invalid', !isValid);
  msg.classList.toggle('visible', !isValid);
  validations[input.id] = isValid;
  toggleBtn(); // Activa/desactiva el botón de enviar
}

// Verifica que el campo confirmar contraseña coincida con la contraseña original.
function validateConfirm() {
  const isValid = confirm.value === password.value && confirm.value !== '';
  confirm.classList.toggle('valid', isValid);
  confirm.classList.toggle('invalid', !isValid);
  msgConfirm.classList.toggle('visible', !isValid);
  validations.confirm = isValid;
  toggleBtn();
}

// Valida que se haya seleccionado un país y actualiza el código de área.
function validateCountry() {
  const isValid = country.value !== '';
  country.classList.toggle('valid', isValid);
  country.classList.toggle('invalid', !isValid);
  msgCountry.classList.toggle('visible', !isValid);
  validations.country = isValid;
  prefix.innerText = country.value ? '+' + country.value : '+--';
  toggleBtn();
}

// Alterna entre mostrar y ocultar la contraseña.
function togglePassword(id) {
  const field = document.getElementById(id);
  console.log(field, field.type);
  field.type = field.type === 'password' ? 'text' : 'password';
  
}

// Habilita o deshabilita el botón de enviar según si todos los campos son válidos.
function toggleBtn() {
  btn.disabled = !Object.values(validations).every(Boolean);
}

// === EVENTOS DE ENTRADA EN TIEMPO REAL ===
// Cada campo se valida automáticamente mientras se escribe.

username.addEventListener('input', () => validateInput(username, userRegex, msgUsername));
email.addEventListener('input', () => validateInput(email, emailRegex, msgEmail));
phone.addEventListener('input', () => validateInput(phone, phoneRegex, msgPhone));
// Previene que el usuario escriba letras o símbolos en el input de teléfono
phone.addEventListener('keypress', function (e) {
  const key = e.charCode || e.keyCode;
  // Solo permite los códigos de las teclas numéricas del 0 al 9
  if (key < 48 || key > 57) {
    e.preventDefault();
  }
});

password.addEventListener('input', () => {
  validateInput(password, passRegex, msgPassword);
  validateConfirm(); // También valida confirmación de contraseña
});
confirm.addEventListener('input', validateConfirm);
country.addEventListener('change', validateCountry);

// === ENVÍO DEL FORMULARIO ===
// Cuando el formulario se envía, se detiene el envío y se muestra la ventana emergente con la información ingresada.
document.getElementById('formulario').addEventListener('submit', function (e) {
  e.preventDefault(); // Previene el envío real del formulario

  const fullPhone = '+' + country.value + ' ' + phone.value;

  // Muestra el resumen de la información ingresada en la ventana modal
  resumen.innerHTML = `
    <p><strong>Usuario:</strong> ${username.value}</p>
    <p><strong>Email:</strong> ${email.value}</p>
    <p><strong>Teléfono:</strong> ${fullPhone}</p>
    <p><strong>País:</strong> ${country.options[country.selectedIndex].text}</p>
  `;
  modal.style.display = 'flex';
});

// === FUNCIÓN PARA CERRAR EL MODAL Y REINICIAR EL FORMULARIO ===
function closeModal() {
  modal.style.display = 'none';
  document.getElementById('formulario').reset();

  // Limpia clases de estilo en inputs
  [username, email, phone, password, confirm, country].forEach(input =>
    input.classList.remove('valid', 'invalid')
  );

  // Oculta todos los mensajes de error
  [msgUsername, msgEmail, msgCountry, msgPhone, msgPassword, msgConfirm].forEach(msg =>
    msg.classList.remove('visible')
  );

  // Restablece el estado de las validaciones
  Object.keys(validations).forEach(k => validations[k] = false);

  // Restablece el prefijo de teléfono
  prefix.innerText = '+--';

  toggleBtn(); // Desactiva el botón nuevamente
}