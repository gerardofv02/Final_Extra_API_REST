import { RouterContext } from "router";
import { eventosCollections } from "../db/mongo.ts";
import { EventoSchema } from "../db/schema.ts";
import { ObjectId } from "mongo";

type GetEventsContext = RouterContext<
    "/events"
>;

type GetEventContext = RouterContext<
    "/event/:id",{
        id:string
    }
>
export const getEvents  = async(context: GetEventsContext) => {
    try{
        const hoy = new Date();
        console.log(hoy);

        const eventos : EventoSchema[] = await eventosCollections.find({fecha :{$gte : hoy}}).toArray();
        console.log(eventos);

        context.response.body = {
            eventos : eventos,
        }
        context.response.status = 200;
        return;

    }catch (e){
        context.response.body = {
            message: "Ha habido algun error",
            error: e
        }
        context.response.status = 400;
        return;
    }

};

export const getEvent = async(context: GetEventContext) => {
    try{

        if(!context.params?.id){
            context.response.body = {
                message: "Falta el id por poner en url"
            }
            context.response.status = 400;
            return;
        }

        const id = context.params.id;

        const evento = await eventosCollections.findOne({_id: new ObjectId(id)});

        if(!evento){
            context.response.body = {
                message: "NO existe un evento con ese id"
            }
            context.response.status = 404;
            return;
        }

        context.response.body = {
            evento: evento,
        }
        context.response.status = 200;
        return;



    }catch(e){
        context.response.body= {
            message: "Ha ocurrido algun error",
            error: e,
        }
        context.response.status = 400;
        return;
    }
}