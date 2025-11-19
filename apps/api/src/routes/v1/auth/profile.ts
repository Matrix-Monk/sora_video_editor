import { Router } from "express"
import {authenticate} from "../../../middleware/auth";



const router: Router = Router()



router.get("/me", authenticate, (req, res) => {
  res.json(req.user);
});


export default router;