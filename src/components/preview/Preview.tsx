import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useEditorContext, useDataGetter, usePartialStore } from "../../Store";
import useBoolean from "../../hooks/useBoolean";
import { Loader } from "../ui/Loader";
import { PreviewBlocks } from "./PreviewBlocks";
import { createPortal } from "react-dom";
import { ComponentValue, Device } from "../../types";
import { useAsync } from "../../hooks/useAsync";
import { translation, VisualEditor } from "../../visual-editor";
import { getScale } from "../../utils/utils";
import DesktopIcon from "../../assets/imgs/desktop.svg?react";
import TabletPortraitIcon from "../../assets/imgs/tablet-landscape.svg?react";
import TabletLandscapeIcon from "../../assets/imgs/tablet-portrait.svg?react";
import MobilePortraitIcon from "../../assets/imgs/mobile-landscape.svg?react";
import MobileLandscapeIcon from "../../assets/imgs/mobile-portrait.svg?react";
import { Tooltip } from "../ui/Tooltip";
import unoCss from "virtual:uno.css?inline";

export default function Preview() {
    const getData = useDataGetter();
    const { urlPreview } = useEditorContext();
    const data = useRef<ComponentValue[]>([]);
    const iframe = useRef<HTMLIFrameElement>(null);
    const htmlAdded = useRef(false);
    const root = useRef<HTMLDivElement>(null);
    const frameWrapper = useRef<HTMLDivElement>(null);
    const currentDevice = useRef<Device | null>(null);
    const initHTML = useRef({});
    const [loaded, setLoadedTrue] = useBoolean(false);

    const handleDeviceChange = (device: Device) => {
        currentDevice.current = device;

        if (iframe.current && frameWrapper.current) {
            iframe.current.style.width = typeof device.size[0] === "number" ? `${device.size[0]}px` : device.size[0];
            iframe.current.style.height = typeof device.size[1] === "number" ? `${device.size[1]}px` : device.size[1];

            const scale = getScale({ element: iframe.current, parent: frameWrapper.current });
            iframe.current.style.transformOrigin = "center center";
            iframe.current.style.transform = `scale(${scale})`;
        }
    };

    useLayoutEffect(() => {
        if (!frameWrapper.current || !iframe.current) return;

        const observer = new ResizeObserver(() => {
            if (currentDevice.current) {
                handleDeviceChange(currentDevice.current);
            }
        });

        observer.observe(frameWrapper.current);
        observer.observe(iframe.current);

        return () => observer.disconnect();
    }, []);

    useAsync(async () => {
        data.current = getData();
        const r = await fetch(urlPreview, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data.current),
        });
        const html = await r.text();
        iframe.current!.srcdoc = html;

        htmlAdded.current = true;
    }, []);

    const onLoad = async () => {
        if (!htmlAdded.current) return;

        const iFrameDoc = iframe.current!.contentDocument!;
        

        const componentsRoot = iFrameDoc.querySelector("#components-root") as HTMLDivElement;
        root.current = componentsRoot;
        initHTML.current = Array.from(componentsRoot.children).reduce((acc, c, i) => {
            return { ...acc, [data.current[i]!._id]: c.outerHTML };
        }, {});

     
        const style = iFrameDoc.createElement("style");
        style.textContent = unoCss;
        iFrameDoc.head.appendChild(style);
        root.current.innerHTML = "";
        setLoadedTrue();
    };

    return (
        <div className='w-[calc(100%_-_2_*var(--spacing))] h-full flex flex-col left-2 relative'>
            {!loaded && <Loader />}
            <PreviewSize onChange={handleDeviceChange}></PreviewSize>
            <div
                className={`relative w-full h-1 grow-1 flex items-center justify-center transition-opacity ${!loaded ? "opacity-0" : "opacity-100"} overflow-hidden rounded-3 bg-primary/2`}
                ref={frameWrapper}>
                <iframe
                    onLoad={onLoad}
                    className={`h-full top-0 left-0 w-full transition-all outline-.3 outline-solid outline-dark/5 shadow-lg`}
                    ref={iframe}></iframe>
                {loaded && createPortal(<PreviewBlocks initHTML={initHTML.current}></PreviewBlocks>, root.current!)}
            </div>
        </div>
    );
}

const DevicesIcons = {
    desktop: <DesktopIcon />,
    tablet: {
        portrait: <TabletPortraitIcon />,
        landscape: <TabletLandscapeIcon />,
    },
    mobile: {
        portrait: <MobilePortraitIcon />,
        landscape: <MobileLandscapeIcon />,
    },
};

function PreviewSize({ onChange }: { onChange: (device: Device) => void }) {
    const [selectedIndex, setSelectedIndex] = useState(() => {
        const index = VisualEditor.devices.findIndex((d) => d.default === true) || 0;
        return index;
    });
    const devices = VisualEditor.devices;

    const handleChange = (index: number) => {
        setSelectedIndex(index);
        onChange(devices[index]);
    };

    useEffect(() => {
        handleChange(selectedIndex); // Set initial device size on mount
    }, []);

    return (
        <div className='flex w-full justify-center'>
            {devices.map((device, index) => (
                <Tooltip
                    key={device.name}
                    text={`${translation("width")} : ${typeof device.size[0] === "number" ? device.size[0] + "px" : device.size[0]}<br>${translation("height")} : ${typeof device.size[1] === "number" ? device.size[1] + "px" : device.size[1]}`}>
                    <button
                        key={device.name}
                        className={`px-4 py-2 text-5 ${selectedIndex === index ? "bg-blue-500 text-white" : "bg-white text-black"} cursor-pointer`}
                        onClick={() => handleChange(index)}>
                        {device.type === "desktop"
                            ? DevicesIcons.desktop
                            : DevicesIcons[device.type][device.orientation || "portrait"]}
                    </button>
                </Tooltip>
            ))}
        </div>
    );
}
