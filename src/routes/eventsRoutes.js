const express = require('express');
const router = express.Router();
const { createEvent, editEvent, getAllEvents, getEventById, deleteEvent, registerForEvent, cancelEventRegistration, designateRole, removeUserFromEvent } = require('../controllers/eventController');
const authenticateToken = require('../middlewares/authenticateToken');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Operations related to events
 */

/**
 * @swagger
 * /users/events:
 *   post:
 *     summary: Criar um novo evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Event details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Annual Conference"
 *               description:
 *                 type: string
 *                 example: "A conference about annual achievements."
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-01"
 *               location:
 *                 type: string
 *                 example: "New York City"
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "b8a3c3c7-f6e4-4b9a-8f8e-7d8b03d0a6c5"
 *                 title:
 *                   type: string
 *                   example: "Annual Conference"
 *                 description:
 *                   type: string
 *                   example: "A conference about annual achievements."
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2024-12-31"
 *                 end_date:
 *                   type: string
 *                   format: date
 *                   example: "2025-01-01"
 *                 location:
 *                   type: string
 *                   example: "New York City"
 *                 adm_id:
 *                   type: string
 *                   example: "a4f24f24-3b1e-4c7e-8c1f-1d1a6a2b3c4d"
 *       400:
 *         description: Usuário não encontrado
 */
router.post('/users/events', authenticateToken, createEvent);

/**
 * @swagger
 * /events/{eventId}:
 *   put:
 *     summary: Editar um evento existente
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: ID do evento a ser atualizado
 *         schema:
 *           type: string
 *           example: "b8a3c3c7-f6e4-4b9a-8f8e-7d8b03d0a6c5"
 *     requestBody:
 *       description: Updated event details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Annual Conference - Updated"
 *               description:
 *                 type: string
 *                 example: "Updated description for the conference."
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-25"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-02"
 *               location:
 *                 type: string
 *                 example: "San Francisco"
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *       404:
 *         description: Evento não encontrado
 *       401:
 *         description: Não autorizado a editar este evento
 */
router.put('/events/:eventId', authenticateToken, editEvent);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Recuperar todos os eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Lista de todos os eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "b8a3c3c7-f6e4-4b9a-8f8e-7d8b03d0a6c5"
 *                   title:
 *                     type: string
 *                     example: "Annual Conference"
 *                   description:
 *                     type: string
 *                     example: "A conference about annual achievements."
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-12-31"
 *                   end_date:
 *                     type: string
 *                     format: date
 *                     example: "2025-01-01"
 *                   location:
 *                     type: string
 *                     example: "New York City"
 *                   adm_id:
 *                     type: string
 *                     example: "a4f24f24-3b1e-4c7e-8c1f-1d1a6a2b3c4d"
 */
router.get('/events', getAllEvents);

/**
 * @swagger
 * /events/{eventId}:
 *   get:
 *     summary: Recuperar um evento específico por ID
 *     tags: [Events]
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: ID do evento a ser recuperado
 *         schema:
 *           type: string
 *           example: "b8a3c3c7-f6e4-4b9a-8f8e-7d8b03d0a6c5"
 *     responses:
 *       200:
 *         description: Detalhes do evento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "b8a3c3c7-f6e4-4b9a-8f8e-7d8b03d0a6c5"
 *                 title:
 *                   type: string
 *                   example: "Annual Conference"
 *                 description:
 *                   type: string
 *                   example: "A conference about annual achievements."
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2024-12-31"
 *                 end_date:
 *                   type: string
 *                   format: date
 *                   example: "2025-01-01"
 *                 location:
 *                   type: string
 *                   example: "New York City"
 *                 adm_id:
 *                   type: string
 *                   example: "a4f24f24-3b1e-4c7e-8c1f-1d1a6a2b3c4d"
 *       404:
 *         description: Evento não encontrado
 */
router.get('/events/:eventId', getEventById);

/**
 * @swagger
 * /events/{eventId}:
 *   delete:
 *     summary: Excluir um evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: ID do evento a ser excluído
 *         schema:
 *           type: string
 *           example: "b8a3c3c7-f6e4-4b9a-8f8e-7d8b03d0a6c5"
 *     responses:
 *       200:
 *         description: Evento excluído com sucesso
 *       404:
 *         description: Evento não encontrado
 *       401:
 *         description: Não autorizado a excluir este evento
 */
router.delete('/events/:eventId', authenticateToken, deleteEvent);

/**
 * @swagger
 * /events/{eventId}/register:
 *   post:
 *     summary: Registrar um usuário para um evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: ID do evento para se inscrever
 *         schema:
 *           type: string
 *           example: "b8a3c3c7-f6e4-4b9a-8f8e-7d8b03d0a6c5"
 *     responses:
 *       200:
 *         description: Inscrito com sucesso no evento
 *       404:
 *         description: Evento não encontrado
 *       400:
 *         description: Já registrado ou outro erro de registro
 */
router.post('/events/:eventId/register', authenticateToken, registerForEvent);

/**
 * @swagger
 * /events/{eventId}/unsubscribe:
 *   delete:
 *     summary: Cancelar a inscrição de um usuário em um evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: ID do evento para cancelar inscrição
 *         schema:
 *           type: string
 *           example: "b8a3c3c7-f6e4-4b9a-8f8e-7d8b03d0a6c5"
 *     responses:
 *       200:
 *         description: Cadastro cancelado com sucesso
 *       404:
 *         description: Evento ou usuário não encontrado
 *       400:
 *         description: Usuário não cadastrado no evento
 */
router.delete('/events/:eventId/unsubscribe', authenticateToken, cancelEventRegistration);

/**
 * @swagger
 * /events/{eventId}/role:
 *   put:
 *     summary: Atribuir uma função a um usuário para um evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: ID do evento
 *         schema:
 *           type: string
 *           example: "b8a3c3c7-f6e4-4b9a-8f8e-7d8b03d0a6c5"
 *       - name: userId
 *         in: query
 *         required: true
 *         description: ID do usuário para atribuir uma função
 *         schema:
 *           type: string
 *           example: "a4f24f24-3b1e-4c7e-8c1f-1d1a6a2b3c4d"
 *     requestBody:
 *       description: Função a atribuir
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [organizer, participant]
 *                 example: "participant"
 *     responses:
 *       200:
 *         description: Função atribuída com sucesso
 *       400:
 *         description: Função inválida ou usuário não registrado
 *       401:
 *         description: Não autorizado a atribuir funções
 */
router.put('/events/:eventId/role', authenticateToken, designateRole);

/**
 * @swagger
 * /events/{eventId}/users/{userIdToRemove}:
 *   delete:
 *     summary: Remover um usuário de um evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: ID do evento
 *         schema:
 *           type: string
 *           example: "b8a3c3c7-f6e4-4b9a-8f8e-7d8b03d0a6c5"
 *       - name: userIdToRemove
 *         in: path
 *         required: true
 *         description: ID do usuário a ser removido
 *         schema:
 *           type: string
 *           example: "a4f24f24-3b1e-4c7e-8c1f-1d1a6a2b3c4d"
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       400:
 *         description: Usuário não cadastrado no evento
 *       404:
 *         description: Evento ou usuário não encontrado
 *       401:
 *         description: Não autorizado para remover usuário
 */
router.delete('/events/:eventId/users/:userIdToRemove', authenticateToken, removeUserFromEvent);

module.exports = router;
