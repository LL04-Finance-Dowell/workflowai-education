import { Router } from "express";
import healtcheckRoutes from './healthcheck.route.js'
 
const router = Router()

router.use("/healtcheckup", healtcheckRoutes)

export default router