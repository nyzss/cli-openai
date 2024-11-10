import {
    brightRed,
    brightYellow,
    green,
    red,
    yellow,
} from "jsr:@std/fmt/colors";

Deno.addSignalListener("SIGINT", () => {
    console.error(green("✅ Goodbye!"));
    Deno.exit(0);
});

const logs: unknown[] = [];

const OPENAI_URL =
    Deno.env.get("OPENAI_URL") || "https://api.openai.com/v1/chat/completions";

const API_KEY = Deno.env.get("OPENAI_API_KEY");
if (!API_KEY) {
    throw new Error("No API key found");
}

const handleLogs = async () => {
    const decoder = new TextDecoder("utf-8");
    try {
        const file = await Deno.readFile("logs.json");
        const decoded = decoder.decode(file);

        const parsedLogs = JSON.parse(decoded);
        logs.push(...parsedLogs);
    } catch (_) {
        console.error(red("❌ Error reading logs"));
        console.log(brightRed("🧹 Do you want to clear the logs? (y/n): "));
        const clearLogs = confirm("");

        if (clearLogs) {
            await Deno.writeFile("logs.json", new TextEncoder().encode("[]"));
        } else {
            console.log(
                brightYellow("🚪 Exiting without clearing logs file...")
            );
            Deno.exit(1);
        }
    }
};
await handleLogs();

const pushToLogs = async (content: JSON | unknown) => {
    logs.push(content);
    await Deno.writeFile(
        "logs.json",
        new TextEncoder().encode(JSON.stringify(logs))
    );
};

const display = (content: string) => {
    console.log(`\n🤖 ${content}\n`);
};

const doRequest = async (content: string) => {
    const newLog = {
        role: "user",
        content,
        response: {},
        created_at: new Date().toISOString(),
    };

    try {
        const res = await fetch(OPENAI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content }],
                temperature: 0.7,
            }),
        });

        const data = await res.json();

        newLog.response = data;
        await pushToLogs(newLog);
        if (res.ok) {
            if (data.choices.length > 1) {
                data.choices.forEach((choice: any) =>
                    display(choice.message.content)
                );
            } else if (data.choices.length === 1) {
                display(data.choices[0].message.content);
            }
        } else {
            console.log(red("❌ Error with the request, please try again."));
        }
    } catch (_) {
        console.log(red("❌ Error with the request, please try again."));
        newLog.response = { error: "Error with the request" };
        await pushToLogs(newLog);
    }
};

const promptString = yellow("📝 Enter your prompt:");

while (true) {
    console.log(promptString);
    const val = prompt("> ");

    if (val === null) {
        break;
    }
    if (val.length > 0 && val.length < 1000) {
        await doRequest(val);
    } else if (val.length === 0) {
        continue;
    } else {
        console.log(
            val || val === ""
                ? red("❌ Please enter a prompt")
                : red("❌ The prompt is too long")
        );
    }
}

console.log(green("✅ Goodbye!"));
