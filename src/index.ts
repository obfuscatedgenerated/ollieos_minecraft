import type { Program } from "ollieos/types";

export default {
    name: "minecraft",
    description: "Minecraft.",
    usage_suffix: "[small|normal|huge]",
    arg_descriptions: {
        "small|normal|huge": "The size of world to generate. Can be left blank.",
    },
    main: async (data) => {
        const { term } = data;

        let size_arg = "";
        if (data.args.length > 0) {
            size_arg = data.args[0];
        }

        if (size_arg !== "" && size_arg !== "small" && size_arg !== "normal" && size_arg !== "huge") {
            term.writeln("Invalid size. Valid sizes are: small, normal, huge.");
            return 1;
        }

        const url = new URL("https://classic.minecraft.net/");
        if (size_arg !== "") {
            url.searchParams.set("size", size_arg);
        }

        const iframe = document.createElement("iframe");
        iframe.src = url.toString();
        iframe.style.border = "none";
        iframe.style.width = "100%";
        iframe.style.height = "100%";

        const wm = term.get_window_manager();
        if (!wm) {
            term.writeln("Window manager not found.");
            return 1;
        }

        const wind = new wm.Window();
        wind.title = "Minecraft";

        // determine if width or height is the limiting factor
        const width_limited = (window.innerWidth / window.innerHeight) < (4 / 3);

        // generate width and height based on limiting factor. get to 95% of the limiting factor but maintain 4:3 aspect ratio
        // do it in terms of viewport units, ensuring to use the same unit for both width and height
        const unit = width_limited ? "vw" : "vh";
        const win_size = 95;

        const width = width_limited ? win_size : (win_size * (4 / 3));
        const height = width_limited ? (win_size * (3 / 4)) : win_size

        wind.width = `${width}${unit}`;
        wind.height = `${height}${unit}`;

        // use window.inner sizes to center the window
        wind.x = (window.innerWidth - (width_limited ? (win_size / 100 * window.innerWidth) : (win_size * (4 / 3) / 100 * window.innerHeight))) / 2;
        wind.y = (window.innerHeight - (width_limited ? (win_size * (3 / 4) / 100 * window.innerWidth) : (win_size / 100 * window.innerHeight))) / 2;

        wind.dom.appendChild(iframe);
        wind.show();

        return 0;
    }
} as Program;
