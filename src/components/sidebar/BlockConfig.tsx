import { useBlockData } from "../../Store";
import { Text } from "../fields/Text";
import { FieldsRenderer } from "./FieldsRenderer";

export function BlockConfig({
    id,
    onUpdate,
}: {
    id: string;
    onUpdate: (v: any, path: string) => void;
}) {
    const fields = [
        Text("id", {
            label: "ID",
            defaultValue: "",
        }),
        Text("class", {
            label: "Class",
            defaultValue: "",
        }),
        Text("css", {
            multiline: true,
            label: "CSS Personnalisé",
            defaultValue: "",
        }),
    ];

    const onChange = (value: any, path: string) => {
        console.log("BlockConfig onChange", value, `${path}`);
        onUpdate(value, `${path}`);
    };

    return (
        <FieldsRenderer
            fields={fields}
            data={useBlockData(id).config ?? { id: "", class: "", css: "" }}
            dataPath={`${id}.config`}
            onUpdate={onChange}
        />
    );
}
