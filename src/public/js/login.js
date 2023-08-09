const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            return result.json(); 
        } else {
            throw new Error('Inicio de sesión fallido');
        }
    })
    .then(data => {

        localStorage.setItem('token', data.token);


        localStorage.setItem('userRole', data.role);

        window.location.replace('/products'); 
    })
    .catch(error => {
        console.error('Error al iniciar sesión:', error);

    });

});