import type { Program } from "ollieos/types";

export default {
    name: "minecraft",
    description: "Minecraft.",
    usage_suffix: "[small|normal|huge]",
    arg_descriptions: {
        "small|normal|huge": "The size of world to generate. Can be left blank.",
    },
    compat: "2.0.0",
    completion: async (data) => {
        if (data.arg_index === 0) {
            return ["small", "normal", "huge"].filter(size => size.startsWith(data.current_partial));
        }

        return [];
    },
    main: async (data) => {
        const { kernel, term, process } = data;

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

        if (!kernel.has_window_manager()) {
            term.writeln("Window manager not found.");
            return 1;
        }

        const wind = process.create_window();
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

        wind.add_event_listener("close", () => {
           process.kill(0);
        });

        process.detach();
        return 0;
    }
} as Program;
