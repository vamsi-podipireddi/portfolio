---
title: "Lekha: reading my inbox with a local LLM"
description: "A privacy-first tool that turns Gmail into structured insight — transactions, subscriptions, travel — without anything leaving my machine."
pubDate: "2026-06-05"
---

Your inbox already contains a remarkably complete picture of your financial life:
every transaction alert, every subscription renewal, every travel booking. The
problem is that it's all unstructured text, scattered across thousands of emails.

**Lekha** (लेखा — "account / writing") is my take on extracting that signal, with one
hard constraint: nothing leaves my hardware.

## How it works

- **Push-based sync.** Gmail pushes new mail via Google Cloud Pub/Sub — no polling.
- **Smart routing.** Known senders are handled by fast regex rules; unknown senders
  go to the model; promotional mail is skipped entirely. Most email never needs the
  LLM at all.
- **Local extraction.** When the LLM *is* needed, it's a local model (Ollama running
  Qwen 2.5) that pulls out transactions, subscriptions, travel segments, and calendar
  events as structured data.
- **Privacy-first.** All processing happens on my own machine. Nothing is sent to a
  third-party API.

The result is a self-hosted MVP that runs on the Cloudflare and Google free tiers
plus a local model — roughly the cost of the electricity to run it.

It's a private project for now — the [repo lives here](https://github.com/vamsi-podipireddi/Lekha).
