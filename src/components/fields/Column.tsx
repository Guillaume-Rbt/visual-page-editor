import { FieldDefinition } from "../../types";
import { Row } from "./Row";

type FieldArgs = { fields: FieldDefinition<any, any>[] };

export const Column = (options: FieldArgs) => {
    return Row({ ...options, columns: "100%" });
};
