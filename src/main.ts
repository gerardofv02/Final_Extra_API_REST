
import { Application, Router } from "oak";



const router = new Router();
router




const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });