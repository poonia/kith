---
title: Kill the process listening on a port
description: Free up a port (e.g. 4321) held by a stray dev server on macOS or Linux.
pubDate: 2026-11-10T00:00:00.000Z
tags:
  - Shell
language: bash
draft: true
---

```bash
lsof -ti tcp:4321 | xargs kill
```

`lsof -t` prints only PIDs, so the output pipes straight into `kill`. Add `-9` only if the process ignores a normal `SIGTERM`.
