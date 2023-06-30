import { RouterContext } from "router";
import { eventosCollections } from "../db/mongo.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { EventoSchema } from "../db/schema.ts";

type UpdateEventContext = RouterContext<
    "/updateEvent",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}


export const updateEvent = async(context: UpdateEventContext) => {
    try{
        const result = context.request.body({ type: "json" });
        const value = await result.value;

        if(!value.titulo  || !value.fecha || !value.inicio || !value.inicio || !value.fin || !value.invitados || !value.id){
            context.response.body = {
                message: "Faltan datos por poner",
            }
            context.response.status = 400;
            return;
        }

        const titulo: string = value.titulo;
        const descripcion : string | undefined= value.descripcion;
        const inicio: number = value.inicio;
        const fin: number = value.fin;
        const fecha: Date | null = new Date(value.fecha);
        const invitados: string[] = value.invitados;
        const id: string = value.id;

        const mievento = await eventosCollections.findOne({_id: new ObjectId(id)});

        if(!mievento){
            context.response.body = {
                message: "No existe un evento con ese id"
            }
            context.response.status = 404;
            return;
        }

                //falta solucionar solo esto
                if(isValidDate(fecha) === false){
                    context.response.body = {
                        message : "Fecha incorrecta"
                    }
                    context.response.status = 400;
                    return;
                }
        
                if(fin <= inicio){
                    context.response.body = {
                        message: "La hora finales menor o igual a la inicial!",
        
                    }
                    context.response.status = 400;
                    return;
                }
        
                if(inicio < 0 || inicio > 24 || fin < 0 || fin >24){
                    context.response.body = {
                        message : "Horas incorrectas",
                    }
                    context.response.status = 400;
                    return;
                }
        
                const events = await eventosCollections.find({fecha}).toArray();
                console.log(events);
        
                const comprobar = events.filter((evento: EventoSchema) => {
                    if(evento._id.toString() !== mievento._id.toString()){
                        console.log(evento._id , mievento._id)
                    if(evento.inicio < fin && evento.inicio > inicio ){
                        console.log(evento);
                        return evento;
        
                    }else if(evento.fin > inicio && evento.fin < fin ){
                        console.log(evento);
                        return evento;
        
                    }else if(evento.inicio > inicio && evento.fin < fin ){
                        console.log(evento);
                        return evento;
        
                    }else if(evento.inicio < inicio && evento.fin > fin ){
                        console.log(evento);
        
                        return evento;
                    }else if(evento.fin === fin && evento.inicio === inicio ){
                        return evento;
                    }
                }
                
                });
                console.log(comprobar);

            
        
                if(comprobar.length !== 0){
                    context.response.body = {
                        message: "SOLAPAN EVENTOS!"
                    };
                    context.response.status = 400;
                    return;
                }

               const xd =  await eventosCollections.updateOne(
                    {_id : new ObjectId(id)},
                    {$set:{
                        titulo,
                        descripcion,
                        inicio,
                        fin,
                        invitados,
                        fecha
                    } }
                );
                console.log(xd);
                context.response.body = {
                    message: "Evento actualizado"
                };
                context.response.status = 200;
                return;
        


    }catch(e){
        context.response.body = {
            message: "Ha ocurrido algun error",
            error: e,
        }
        context.response.status = 400;
        return;
    }
}