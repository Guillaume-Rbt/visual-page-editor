import { ComponentValue, FieldDefinition, FieldsGroupComponent } from "../../types";
import { defineFieldsGroup } from "../../utils/utils";
import { FieldsRenderer } from "../sidebar/FieldsRenderer";
import { Tabs as TabsLayout } from "../ui/Tabs";

type TabDefinition = {
    name: string;
    fields: FieldDefinition<any, any>[];
    useTabNameAsKey?: boolean;
    key?: string;
};

type FieldArgs = TabDefinition[];

type TabsComponentProps = {
    options: FieldArgs;
    value: ComponentValue["data"];
    onChange: (v: any) => void;
};

function TabsComponent({ options, value, onChange }: TabsComponentProps) {
    const tabsLabel = options.reduce((acc: string[], cur: TabDefinition) => {
        return [...acc, cur.name];
    }, []);

    return (
        <div className='flex flex-col'>
            <div className='flex gap-3'>
                <TabsLayout labels={tabsLabel}>
                    {options.map((t) => {
                        const tabKey = t.key ?? t.name;
                        const tabData = t.useTabNameAsKey
                            ? (value[tabKey] ?? {})
                            : value;

                        return (
                            <FieldsRenderer
                                key={tabKey}
                                fields={t.fields}
                                dataPath=''
                                data={tabData}
                                onUpdate={(v, path) => {
                                    const key = path.substring(1);
                                    onChange(
                                        t.useTabNameAsKey
                                            ? { [tabKey]: { ...tabData, [key]: v } }
                                            : { [key]: v },
                                    );
                                }}
                            />
                        );
                    })}
                </TabsLayout>
            </div>
        </div>
    );
}

const Component: FieldsGroupComponent<FieldArgs, ComponentValue["data"]> = ({ onChange, options, value }) => {
    return <TabsComponent options={options} value={value} onChange={onChange} />;
};

export const Tabs = defineFieldsGroup<TabDefinition[], ComponentValue["data"]>(Component);
