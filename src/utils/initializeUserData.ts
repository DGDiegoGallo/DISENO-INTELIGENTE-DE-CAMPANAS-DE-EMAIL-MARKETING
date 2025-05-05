// Función para inicializar los datos de usuario en localStorage para pruebas
export const initializeUserData = () => {
  const userData = {
    state: {
      user: {
        id: 56,
        documentId: "sygth1cnvd1xedeq9o9kt00d",
        username: "ingrey",
        email: "ingreydiru@gmail.com",
        provider: "local",
        confirmed: true,
        blocked: false,
        createdAt: "2025-04-29T08:07:33.656Z",
        updatedAt: "2025-04-29T08:07:45.443Z",
        publishedAt: "2025-04-29T08:07:45.329Z",
        nombre: "Diego",
        apellido: "Gallo",
        sexo: "Masculino",
        edad: 25,
        fechaDeNacimiento: "1999-09-11",
        pais: "Argentina",
        ciudad: "Santiago del Estero",
        domicilio: "Los sauces 233",
        telefono: "385817723",
        avatar: null,
        rol: "user"
      },
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsImlhdCI6MTc0NjI1Njg3NiwiZXhwIjoxNzQ4ODQ4ODc2fQ.7tTurvlnE_bXA8weNoUzFl3ulOC9zWdroCLNGAEUxUA",
      isAuthenticated: true
    },
    version: 0
  };

  localStorage.setItem('state', JSON.stringify(userData));
  console.log('Datos de usuario inicializados en localStorage');
};

// Ejecutar automáticamente al importar este archivo
initializeUserData();
