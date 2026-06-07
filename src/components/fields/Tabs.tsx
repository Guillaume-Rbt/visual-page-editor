import { BlocValue, FieldDefinition, FieldsGroupComponent } from "../../types";
import { defineFieldsGroup } from "../../utils/utils";
import { FieldsRenderer } from "../sidebar/FieldsRenderer";
import { Tabs as TabsLayout } from "../ui/Tabs";

type TabDefinition = {
    name: string;
    fields: FieldDefinition<any, any>[];
    useTabNameAsKey?: boolean;
    key?: string
};

type FieldArgs = TabDefinition[];

type TabsComponentProps = {
    options: FieldArgs;
    value: BlocValue["data"];
    onChange: (v: any) => void;
};

function TabsComponent({ options, value, onChange }: TabsComponentProps) {
    const tabsLabel = options.reduce((acc: string[], cur: TabDefinition) => {
        return [...acc, cur.name];
    }, []);

    const onUpdate = (v: any, path: string) => {
        const data = {} as { [key: string]: any };

        if (path.startsWith(".")) {
            const key = path.substring(1, path.length);
            data[key] = v;
        } else {
            const keys = path.split(".");
            data[keys[0]] = { ...(value[keys[0]] as { [key: string]: any }), [keys[1]]: v };
        }

        onChange(data);
    };

    return (
        <div className='flex flex-col'>
            <div className='flex gap-3'>
                <TabsLayout labels={tabsLabel}>
                    {options.map((t) => (
                        <FieldsRenderer
                            fields={t.fields}
                            dataPath={t.useTabNameAsKey ? (t.key ?? t.name) : ""}
                            data={value}
                            onUpdate={onUpdate}
                        />
                    ))}
                </TabsLayout>
            </div>
        </div>
    );
}

const Component: FieldsGroupComponent<FieldArgs, BlocValue["data"]> = ({ onChange, options, value }) => {
    return <TabsComponent options={options} value={value} onChange={onChange} />;
};

export const Tabs = defineFieldsGroup<TabDefinition[], BlocValue["data"]>(Component);
