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

        // determine if width or height is the limiting factor
        const width_limited = (window.innerWidth / window.innerHeight) < (4 / 3);

        // generate width and height based on limiting factor. get to 95% of the limiting factor but maintain 4:3 aspect ratio
        // do it in terms of viewport units, ensuring to use the same unit for both width and height
        const unit = width_limited ? "vw" : "vh";
        const size = 95;

        const width = width_limited ? size : (size * (4 / 3));
        const height = width_limited ? (size * (3 / 4)) : size

        wind.width = `${width}${unit}`;
        wind.height = `${height}${unit}`;

        // use viewport units again for centering
        const top = (100 - height) / 2;
        const left = (100 - width) / 2;

        wind.x = `${left}${unit}`;
        wind.y = `${top}${unit}`;

        wind.dom.appendChild(iframe);
        wind.show();

        return 0;
    }
} as Program;
