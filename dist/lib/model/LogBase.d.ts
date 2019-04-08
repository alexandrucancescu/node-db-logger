import { Schema, Document } from "mongoose";
export interface ILogBase extends Document {
    time: Date;
    instance: string;
    expiresAt: Date;
}
declare const LogBaseSchema: {
    time: {
        type: typeof Schema.Types.Date;
        required: boolean;
        default: () => number;
    };
    expiresAt: {
        type: typeof Schema.Types.Date;
        required: boolean;
    };
    instance: {
        type: typeof Schema.Types.ObjectId;
        required: boolean;
        index: boolean;
    };
};
export default LogBaseSchema;
