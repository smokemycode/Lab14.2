import { Router } from "express";

const router = Router();

router.use((req, res) => {
	res.status(404).send("<h1>😝 404 Error!</h1>");
});

export default router;
