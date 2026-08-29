import { useBlockData } from "../../Store";
import { Text } from "../fields/Text";
import { Row } from "../fields/Row";
import { FieldsRenderer } from "./FieldsRenderer";
import { translation } from "../../utils/utils";
import { Repeater } from "../fields/Repeater";

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
            label: translation("personnalCSS"),
            defaultValue: "",
        }),
        Repeater("attributes", {
            label: translation("otherAttributes"),
            itemLabel: "name",
            fields: [
                Row({
                    fields: [
                        Text("name", {
                            label: translation("configAttributesName"),
                            defaultValue: "",
                        }),
                        Text("value", {
                            label: translation("configAttributesValue"),
                            defaultValue: "",
                        }),
                    ],
                }),
            ],
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
