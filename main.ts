import { parse, Args } from "https://deno.land/std@0.153.0/flags/mod.ts";

const flags = parse(Deno.args, {
  boolean: ["help", "big", "wrap"],
  string: ["file", "text"],
});

const usage_text =
  "Usage: iansays [...FLAGS]\nExample:\niansays --file filename.txt or iansays --text deno is awesome!";

const commands_text = "Available flags:\n\tfile, text, big, wrap, help";

function print_help() {
  console.log(usage_text);
  console.log(commands_text);
}

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

const ian2 = `;;;;;;\\;;;;;;;;,,,,',,'.....    ..'...
ccccccc\\ccccllc;;;'....
::::::::\\cclc;;::'.
',,,''',,\\;'.....
'''''......    .   .',;:ccc:;,..       .
cllllcc;,'.      .;clddxxxxddool:.     .
dxxxxkxoc'.     .:okKXX0Okkxxddddc.
ccllcc::,.     .;ok0Odlc:cclllcc:c;.
..........    .cxdlc,.....,:lc:'..,....
  .....''.....l00o:,....',;ldxo,..,'...
 ...,cdkkdlc;;kXKOkdoc::loxkOX0l;::,',.
   ..;ldxolclOXNXKOxxkkkkOkoclllodo;...
        .,llxKK0Oxxk0K0OOOx:,,::ldd;  ......
          ,x0KKOxox0KOdclllc;;:cldl.
.''.       .;oOOddkkxl:;::::;,;:cl;
.,'.        .:xkdddolcclodoolclool.     ...,;;;;,.
.'.         .:xdlccccloxkOOkdoddxo'   .:llc:;,,'..
..      .',,,lxxl:;;,;:cccc;;;:lkx'   .::;,'.. ...
.      .;c::::cllc:;,'......,:;:oo.   .,;,,,.
.      .:lcc:;;,,,;;;;,'...';:,,ll.    ......
:.    .,::;;;;::;;,,,,,,,,,;:,.'cl.
,.    'clcc:;;;;;;;;:::;,,,;:' .;:.
'....,loocccclccc:;,',;:::;;:.  .'.            ...
`;

function main(flags: Args) {
  if (flags.help) {
    print_help();
    return;
  }
  const wrap = flags.wrap;
  const use_big = flags.big;
  const max_line_length = 100;
  const text = get_text(flags);
  let lines = text.split("\n");

  if (wrap) {
    while (get_max_width(lines) > max_line_length) {
      lines = lines.reduce<string[]>((prev, line) => {
        if (line.length > max_line_length) {
          const left = line.replaceAll("\n", "").slice(0, max_line_length);
          const right = line.replaceAll("\n", "").slice(max_line_length);
          prev.push(left, right);
        } else {
          prev.push(line);
        }

        return prev;
      }, []);
    }
  }

  const max_width = get_max_width(lines);

  const messages = lines.map((line) => {
    const times = max_width - line.length;
    return line + " ".repeat(times);
  });

  const text_box = build_text_box(messages, max_width);

  console.log(text_box);

  if (use_big) {
    console.log(ian2);
    return;
  }
  console.log(ian);
}

function get_text(flags: Args): string {
  if (!flags.file && !flags.text) {
    print_help();
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

main(flags);
