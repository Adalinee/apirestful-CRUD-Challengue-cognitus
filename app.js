const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Configura CORS para permitir solicitudes desde cualquier origen
app.use(cors());
app.use(express.json()); // Permite procesar solicitudes con cuerpo en formato JSON

// Se establece la conexión
var conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cognitusdb'
});

conexion.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log('Conexión exitosa');
    }
});

// Ruta de prueba
app.get('/', function (req, res) {
    res.send('Hello World');
});

// Mostrar todas las tareas
app.get('/api/task', (req, res) => {
    conexion.query('SELECT * FROM tarea', (error, rows) => {
        if (error) {
            return res.status(500).send({ error: 'Error al obtener tareas' });
        } else {
            res.send(rows);
        }
    });
});

// Mostrar una tarea específica por ID
app.get('/api/task/:id', (req, res) => {
    conexion.query('SELECT * FROM tarea WHERE id = ?', [req.params.id], (error, row) => {
        if (error) {
            return res.status(500).send({ error: 'Error al obtener la tarea' });
        } else if (row.length === 0) {
            res.status(404).send({ message: "Tarea no encontrada" });
        } else {
            res.send(row);
        }
    });
});

// Crear una nueva tarea
app.post('/api/task/', (req, res) => {
    const { task, description } = req.body;

    // Validación básica
    if (!task || !description) {
        return res.status(400).send({
            error: "Todos los campos 'task', 'description'"
        });
    }

    let data = { task, description};
    let sql = "INSERT INTO tarea SET ?";
    conexion.query(sql, data, function (error, results) {
        if (error) {
            return res.status(500).send({ error: 'Error al crear la tarea' });
        } else {
            res.send({
                message: "Tarea creada con éxito",
                taskId: results.insertId,
                task: data
            });
        }
    });
});

// Editar tarea
app.put('/api/task/:id', (req, res) => {
    let id = req.params.id;
    let task = req.body.task;
    let description = req.body.description;
    let status = req.body.status;

    let sql = "UPDATE tarea SET task = ?, description = ?, status = ? WHERE id = ?";

    conexion.query(sql, [task, description, status, id], function (error, results) {
        if (error) {
            return res.status(500).send({ error: 'Error al actualizar la tarea' });
        } else if (results.affectedRows === 0) {
            res.status(404).send({ message: "Tarea no encontrada" });
        } else {
            res.send({
                message: "Tarea editada con éxito",
                taskId: id
            });
        }
    });
});

// Eliminar tarea
app.delete('/api/task/:id', (req, res) => {
    conexion.query('DELETE FROM tarea WHERE id = ?', [req.params.id], function (error, results) {
        if (error) {
            return res.status(500).send({ error: 'Error al eliminar la tarea' });
        } else {
            res.send({
                message: "Tarea borrada con éxito",
                taskId: req.params.id
            });
        }
    });
});

// Iniciar el servidor
app.listen(3000, function () {
    console.log('Servidor OK en el puerto 3000');
});
