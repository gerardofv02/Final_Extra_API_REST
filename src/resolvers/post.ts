import { RouterContext } from "router";
import { eventosCollections } from "../db/mongo.ts";
import { EventoSchema } from "../db/schema.ts";
import { Evento } from "../types.ts";

type PostEventContext = RouterContext<
    "/addEvent",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

export const addEvent  = async(context: PostEventContext) => {
    try{   
        const result = context.request.body({ type: "json" });
        const value = await result.value;

        if(!value.titulo  || !value.fecha || !value.inicio || !value.inicio || !value.fin || !value.invitados){
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
        let fecha: Date | null = new Date(value.fecha);
        const invitados: string[] = value.invitados;
        //falta solucionar solo esto
        if(isValidDate(fecha) === false){
            context.response.body = {
                message : "Fecha incorrecta"
            }
            context.response.status = 400;
            return;
        }
        console.log(fecha);

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

        const comprobar = events.filter((evento: EventoSchema) => {
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
            }else if(evento.fin === fin && evento.inicio === inicio && evento){
                return evento;
            }
        
        });
    

        

        if(comprobar.length !== 0){
            context.response.body = {
                message: "SOLAPAN EVENTOS!"
            };
            context.response.status = 400;
            return;
        }

        const evento : Partial<Evento> = {
            descripcion: descripcion,
            fecha: fecha,
            fin:fin,
            inicio:inicio,
            invitados:invitados,
            titulo:titulo
        };

        const _id = await eventosCollections.insertOne(evento as EventoSchema);

        context.response.body = {
            _id: _id,
            titulo: evento.titulo,
            fecha: evento.fecha,
            fin: evento.fin,
            inicio: evento.inicio,
            invitados: evento.invitados,
            descripcion: evento.descripcion,
            
            
        }



    }catch(e) {
        context.response.body = {
            message: "Ha ocurrido un error",
            error: e,
        }
    }
}