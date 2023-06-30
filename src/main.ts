
import { Application, Router } from "oak";
import { addEvent } from "./resolvers/post.ts";
import { getEvents ,getEvent} from "./resolvers/get.ts";
import { deleteEvent } from "./resolvers/delete.ts";
import { updateEvent } from "./resolvers/put.ts";



const router = new Router();
router
.post("/addEvent", addEvent)
.get("/events", getEvents)
.get("/event/:id", getEvent)
.delete("/deleteEvent/:id",deleteEvent)
.put("/updateEvent",updateEvent)




const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });