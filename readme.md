# CLI OpenAI Tool (Deno)

A simple CLI tool to interact with OpenAI’s API using Deno. Send prompts, get responses, and log conversations locally. Built as a learning project.

## Setup

1. **Prerequisites**: Install [Deno](https://deno.land/).
2. **Environment**: Create a `.env` file (based on `.env.template`) with:
   ```env
   OPENAI_API_KEY=<your_api_key>
   OPENAI_URL=https://api.openai.com/v1/chat/completions
   ```

## Usage

Run with necessary permissions:

```bash
deno run --allow-net --allow-read --allow-write your_script.ts
```

- **Prompt**: Enter a prompt when asked.
- **Logs**: All prompts and responses are saved in `logs.json`.

## Notes

- `.env` keeps API keys hidden.
- Run with `Ctrl+C` to exit.

---

This is a learning project, and I’m open to suggestions for improvement!