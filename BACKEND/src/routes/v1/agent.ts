import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.js";
import { addAgent, deleteAgent, updateAgent } from "../../controllers/agent.js";

const router = Router();

router.post('/', authMiddleware, addAgent);

router.patch('/:agentId', authMiddleware, updateAgent);

router.delete('/:agentId', authMiddleware, deleteAgent)

export default router