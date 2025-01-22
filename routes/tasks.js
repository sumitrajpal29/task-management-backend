const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

module.exports = (io) => {
    router.post('/', async (req, res) => {
        const { name, status = 'Pending' } = req.body;
        try {
            const [result] = await pool.query('INSERT INTO tasks (name, status) VALUES (?, ?)', [name, status]);
            io.emit('taskAdded', { id: result.insertId, name, status });
            res.status(201).json({ id: result.insertId, name, status });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.get('/', async (req, res) => {
        try {
            const [tasks] = await pool.query('SELECT * FROM tasks');
            res.status(200).json(tasks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        try {
            const [result] = await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.status(200).json({ message: 'Task updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }
            io.emit('taskDeleted', { id });
            res.status(200).json({ message: 'Task deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    return router;

};
