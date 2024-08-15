const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operações relacionadas aos usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Recupera a lista de todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID do usuário
 *                   name:
 *                     type: string
 *                     description: Nome do usuário
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Endereço de e-mail do usuário
 *                   role:
 *                     type: string
 *                     description: Função do usuário
 *                   profile_picture:
 *                     type: string
 *                     description: URL da imagem de perfil do usuário
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Recupera um usuário específico
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser recuperado
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID do usuário
 *                 name:
 *                   type: string
 *                   description: Nome do usuário
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Endereço de e-mail do usuário
 *                 role:
 *                   type: string
 *                   description: Função do usuário
 *                 profile_picture:
 *                   type: string
 *                   description: URL da imagem de perfil do usuário
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/users/:userId', authenticateToken, getUser);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Atualiza um usuário específico
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *               profile_picture:
 *                 type: string
 *                 description: URL da imagem de perfil do usuário
 *             required:
 *               - name
 *               - profile_picture
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/users/:userId', authenticateToken, updateUser);

module.exports = router;
