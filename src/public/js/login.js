
const form = document.getElementById('loginForm');

        form.addEventListener('submit', e => {
            e.preventDefault();
            const data = new FormData(form);
            const obj = {};
            data.forEach((value, key) => (obj[key] = value));
            fetch('api/sessions/login', {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    
                },
            })
                .then(result => {
                    if (result.status === 200) {
                        return result.json();
                    } else {
                        throw new Error('Inicio de sesión fallido');
                    }
                })
                .then(data => {

                    const newToken = data.token;
                    localStorage.setItem('token', newToken);
                    localStorage.setItem('userRole', data.role);


                    window.location.replace('/products');
                })
                .catch(error => {
                    logger.error('Error al iniciar sesión:', error);

                    const errorMessage = document.getElementById('errorMessage');
                    errorMessage.textContent = 'Inicio de sesión fallido. Verifica tus credenciales.';
                });
        });
    