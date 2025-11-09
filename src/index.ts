import { VirtualWindow } from "ollieos/src/windowing";
import type { Program } from "ollieos/src/types";

export default {
    name: "minecraft",
    description: "Minecraft.",
    usage_suffix: "",
    arg_descriptions: {},
    main: async (data) => {
        const iframe = document.createElement("iframe");
        iframe.src = "https://classic.minecraft.net/";
        iframe.style.border = "none";
        iframe.style.width = "100%";
        iframe.style.height = "100%";

        const wind = new VirtualWindow();
        wind.title = "Minecraft";

        const height = 95;
        const width = height / 4/3

        const x = (100 - width) / 2;
        const y = (100 - height) / 2;

        wind.width = `${width}vw`;
        wind.height = `${height}vh`;

        wind.x = `${x}vw`;
        wind.y = `${y}vh`;

        wind.dom.appendChild(iframe);
        wind.show();

        return 0;
    }
} as Program;
