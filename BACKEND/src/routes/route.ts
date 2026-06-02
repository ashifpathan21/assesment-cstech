import { Router } from "express";
import UserRoutes from './v1/user.js'
import AgentRoutes from './v1/agent.js'
import FileRoutes from './v1/file.js'

const router = Router();

router.use('/user', UserRoutes);
router.use('/agent', AgentRoutes)
router.use('/file',FileRoutes)


export default router