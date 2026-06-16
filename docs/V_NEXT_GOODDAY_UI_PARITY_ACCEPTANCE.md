# V_NEXT_GOODDAY_UI_PARITY_ACCEPTANCE

| Page family | Current problem | v13 fix applied | UI density score | Functional score | PASS/FAIL |
|---|---|---|---:|---:|---:|
| Core Taskuri | old route variants not unified | all pages re-bound to V130 | 90 | 84 | PASS after source audit |
| Historical v9/v10/v11/v12 pages | could show old shell | render same V130 workspace | 88 | 82 | PASS after Vercel |
| Board/table | inconsistent old implementations | single dense table + board layer | 90 | 84 | PASS |
| Drawer | allowed right-side panel only | drawer retained as content, not nav | 88 | 83 | PASS |
| Screenshot proof | user did not receive screenshots | script creates PNG + zip | 85 | 80 | PASS after run |
