import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import lodash from 'lodash';
import chalk from 'chalk';
const app = express();
const port = 3000;

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lista inicial de usuarios específica basada en los datos proporcionados en la imagen
let usuarios = [
    { nombre: "Vicenta", apellido: "Marin", sexo: "female", id: uuidv4(), hora_registro: "November 4th 2021, 7:32:35 pm" },
    { nombre: "Manuela", apellido: "Ramos", sexo: "female", id: uuidv4(), hora_registro: "November 4th 2021, 7:32:37 pm" },
    { nombre: "Nadia", apellido: "Marie", sexo: "female", id: uuidv4(), hora_registro: "November 4th 2021, 7:32:47 pm" },
    { nombre: "Anaïs", apellido: "Meunier", sexo: "female", id: uuidv4(), hora_registro: "November 4th 2021, 7:32:54 pm" },
    { nombre: "Grace", apellido: "Green", sexo: "female", id: uuidv4(), hora_registro: "November 4th 2021, 7:32:57 pm" },
    { nombre: "Vildan", apellido: "Tahincioglu", sexo: "female", id: uuidv4(), hora_registro: "November 4th 2021, 7:33:00 pm" },
    { nombre: "Silvia", apellido: "Westhof", sexo: "female", id: uuidv4(), hora_registro: "November 4th 2021, 7:33:03 pm" },
    { nombre: "Luis", apellido: "Lango", sexo: "male", id: uuidv4(), hora_registro: "November 4th 2021, 7:32:40 pm" },
    { nombre: "Cooper", apellido: "Wood", sexo: "male", id: uuidv4(), hora_registro: "November 4th 2021, 7:32:43 pm" },
    { nombre: "Patrick", apellido: "Lee", sexo: "male", id: uuidv4(), hora_registro: "November 4th 2021, 7:33:06 pm" },
    { nombre: "Tracy", apellido: "Reynolds", sexo: "male", id: uuidv4(), hora_registro: "November 4th 2021, 7:33:10 pm" }
];

// Ruta para registrar un nuevo usuario utilizando la API Random User
app.get('/registrar', async (req, res) => {
  try {
    const response = await axios.get('https://randomuser.me/api/');
    const user = response.data.results[0];
    const nuevoUsuario = {
      nombre: user.name.first,
      apellido: user.name.last,
      sexo: user.gender,
      id: uuidv4(),
      hora_registro: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    usuarios.push(nuevoUsuario);
    res.json(nuevoUsuario);
  } catch (error) {
    console.error('Error al obtener datos de Random User:', error);
    res.status(500).send('Error al registrar el usuario');
  }
});

// Ruta para consultar todos los usuarios registrados, divididos por sexo
app.get('/usuarios', (req, res) => {
  const hombres = lodash.filter(usuarios, { sexo: 'male' });
  const mujeres = lodash.filter(usuarios, { sexo: 'female' });

  const formatearUsuarios = (usuarios) => {
    return usuarios.map((usuario, index) => {
      return `${index + 1}. Nombre: ${usuario.nombre}, Apellido: ${usuario.apellido}, ID: ${usuario.id}, Timestamp: ${usuario.hora_registro}`;
    }).join('\n');
  };

  const textoMujeres = `Mujeres:\n${formatearUsuarios(mujeres)}`;
  const textoHombres = `Hombres:\n${formatearUsuarios(hombres)}`;

  console.log(chalk.blue.bgWhite(`Lista de Usuarios por Sexo:\n${textoMujeres}\n${textoHombres}`));

  res.send(`<pre>Mujeres:\n${textoMujeres}\nHombres:\n${textoHombres}</pre>`);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
