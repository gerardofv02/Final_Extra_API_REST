import { ObjectId } from "mongo";
import { Evento } from "../types.ts";


export type EventoSchema = Omit<Evento,"id"> & {
    _id: ObjectId,
}