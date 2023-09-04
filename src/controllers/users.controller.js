import userModel from '../dao/dbManagers/models/UsersModel.js';
import { Router } from 'express'


const router = Router();

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, 'first_name last_name email age role last_connection');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios.' });
    }
};

const deleteUsers = async (req, res) => {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        await userModel.deleteMany({ last_connection: { $lt: twoDaysAgo } });

        res.status(200).json({ message: 'Usuarios inactivos eliminados con éxito.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuarios inactivos.' });
    }
};

const updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { newRole } = req.body;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (user.role !== newRole) {

            if (newRole === 'user' || newRole === 'premium') {
                await userModel.findByIdAndUpdate(userId, { role: newRole });
                res.json({ message: 'Rol actualizado con éxito' });
            } else {
                res.status(400).json({ error: 'El nuevo rol no es válido.' });
            }
        } else {
            res.status(400).json({ message: 'El usuario ya tiene este rol.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
    }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {

    await userModel.findByIdAndRemove(userId);
    
    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};


  

export default router;

export {
    getUsers,
    deleteUsers,
    updateUserRole,
    deleteUser,
}