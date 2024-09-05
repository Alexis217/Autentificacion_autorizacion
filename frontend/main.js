(async () => {
    try {
        const response = await fetch('http://localhost:4000/auth/session', {
            method: 'GET',
            credentials: 'include'
        });

        console.log({ response });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('user-name').innerText = data.user.username;
        } else {
            // Redirigir al usuario a la página de inicio de sesión
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error(error);
    }
})();


(async () => {
    try {
        const response = await fetch('http://localhost:4000/auth/session', {
            method: 'GET',
            credentials: 'include'
        });
    
        console.log({ response });
    
        if (response.ok) {
            const data = await response.json();
            document.getElementById('user-name').innerText = data.user.username;
        } else {
            // Redirigir al usuario a la página de inicio
            window.location.href = 'home.html';
        }
    } catch (error) {
        console.error(error);
    }
   
})();

// Manejar el cierre de sesión
document.getElementById('logout').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:4000/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Error al cerrar sesión');
        } else {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error(error);
    }
});
