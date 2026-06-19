import { useState } from "react";

export function Tabs({ labels, children }: { labels: string[]; children: React.ReactNode[] }) {
    const [activeTab, setActiveTab] = useState(labels[0]);

    return (
        <div className='flex flex-col w-full gap-3'>
            <div className='inline-grid grid-flow-col auto-cols-fr gap-3 w-max'>
                {labels.map((t) => (
                    <Tab key={t} selected={activeTab === t} text={t} onClick={() => setActiveTab(t)} />
                ))}
            </div>
            <div className='position-relative grid'>
                {children.map((c, i) => {
                    return (
                        <div
                            key={labels[i]}
                            className={`${activeTab == labels[i] ? "opacity-100 " : "opacity-0 pointer-events-none"} col-start-1 row-start-1 duration-200 transition-[opacity] transition-discrete`}>
                            {c}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function Tab({ selected = false, text, onClick }: { selected?: boolean; text: string; onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`transition-[background,color] flex imtes-center justify-center px-4 py-2.5 font-600 rounded-full cursor-pointer ${selected ? "bg-primary/15 text-primary" : "bg-dark/08 text-dark"} duration-200`}>
            {text}
        </div>
    );
}
