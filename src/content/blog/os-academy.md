---
title: "OS Academy: learn operating systems by breaking them"
description: "An interactive companion to the dinosaur book and OSTEP — you drive the algorithms instead of reading about them."
pubDate: "2026-06-10"
---

Operating systems is one of those subjects that's hard to *feel* from a textbook.
You read about the scheduler, nod along, and still can't picture what actually
happens when two processes race for the same counter.

[OS Academy](https://learn.vamsikrishnapodipireddi.in) is my attempt to fix that.
It's not a wall of text — it's a set of interactive pieces where you drive the
algorithms yourself:

- **Schedule processes** and watch how different policies change turnaround and
  waiting time.
- **Watch page faults happen** as you walk through address translation.
- **Trigger a race condition on purpose**, then add the synchronization that makes
  it go away.

It's built as the hands-on companion to *Operating System Concepts* (Silberschatz —
the "dinosaur book") and OSTEP, with every chapter mapped to an interactive module.

Under the hood it's React + TypeScript on Vite, deployed to Cloudflare. The
[source is on GitHub](https://github.com/vamsi-podipireddi/brillant), and the live
site is at [learn.vamsikrishnapodipireddi.in](https://learn.vamsikrishnapodipireddi.in).
