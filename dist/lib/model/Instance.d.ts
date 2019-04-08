import { Document } from "mongoose";
export interface IInstance extends Document {
    location: string;
    ip: string;
    name: string;
}
