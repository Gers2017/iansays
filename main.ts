import { parse, Args } from "https://deno.land/std@0.119.0/flags/mod.ts";

const flags = parse(Deno.args, {
    boolean: ["help"],
    string: ["file", "text"],
});
const help_text =
    "Usage: iansays --file filename.txt or iansays --text deno is awesome!";

function get_text(flags: Args): string {
    if (!flags.file && !flags.text) {
        console.log(help_text);
        Deno.exit();
    }

    if (flags.file)
        return Deno.readTextFileSync(flags.file).replaceAll("\t", "    ");

    return flags.text.replaceAll("\t", "    ");
}

function get_max_width(lines: string[]) {
    let max_width = 0;
    for (const line of lines) {
        if (line.length > max_width) max_width = line.length;
    }
    return max_width;
}

function format(l: string, c: string, r: string) {
    return `${l} ${c} ${r}`;
}

function build_text_box(lines: string[], max_width: number) {
    const count = lines.length;
    const borders = ["/", "\\", "/", "|", "[", "]"];
    const top = " " + "_".repeat(max_width + 2);
    const bottom = " " + "-".repeat(max_width + 2);
    const result = [];
    result.push(top);

    if (count == 1) {
        result.push(format(borders[4], lines[0], borders[5]));
    } else {
        result.push(format(borders[0], lines[0], borders[1]));

        for (let i = 1; i < count - 1; i++) {
            result.push(format(borders[3], lines[i], borders[3]));
        }

        result.push(format(borders[1], lines[count - 1], borders[0]));
    }

    result.push(bottom);
    return result.join("\n");
}

if (flags.help) {
    console.log(help_text);
    Deno.exit();
}

const max_line_length = 80;
const text = get_text(flags);
let lines = text.split("\n");

while (get_max_width(lines) > max_line_length) {
    lines = lines.reduce<string[]>((prev, line) => {
        if (line.length > max_line_length) {
            let left = line.replaceAll("\n", "").slice(0, max_line_length);
            let right = line.replaceAll("\n", "").slice(max_line_length);
            prev.push(left, right);
        } else {
            prev.push(line);
        }

        return prev;
    }, []);
}

const max_width = get_max_width(lines);

const messages = lines.map((line) => {
    const times = max_width - line.length;
    return line + " ".repeat(times);
});

const text_box = build_text_box(messages, max_width);

const ian = `;;;;\\::;,;,.               ...
'''''\\.....   .......    .  ..
,''...  .. .',;cccc::;'.    ..
ool:'.   ..:oxkxdooolll:.   ..
::;,.    .:oxxl::::cc:::;.    
.....  .'lo:;'...',:c;..'...  
.,;:;,',lkdc:,'',:coxd,.,'..  
':odocclxOkxoollooolloccc,... 
 ...,:lxOxdooxxxddc,,;:cl, ...
    .,oxkdloxxl::c:;,;:cc.    
      .;ddlooc:;;::;;;:c,.    
       ,occcc::lodolccll,   .;
   ..'';ol:;,,,:c::;;:lo;  .,;
  .,:;;;;::;,,'....';,;c,   .,
  .,:;;;;,,,,,,''.',,',c'    .
 .,:;;,,;;,,,;,,,',;,..:.     
.,cc::::::;,,,,;;,,;'..'.     
`;

console.log(text_box);
console.log(ian);
