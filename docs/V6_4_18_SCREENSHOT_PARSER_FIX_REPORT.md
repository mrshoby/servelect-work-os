# v6.4.18 screenshot parser fix report

## Problema
Scriptul `RUN_SERVELECT_WORK_OS_V6_4_17_REAL_SCREENSHOT_CAPTURE_AUDIT.ps1` avea un regex cu ghilimele escapate in string PowerShell:

`<div id="__next"?>`

PowerShell a interpretat incorect expresia si a oprit executia cu `ParserError`.

## Fix
Am inlocuit verificarea EMPTY_NEXT_BODY cu un pattern PowerShell-safe:

`if ($domText -match '<div id="__next"></div>') { $state = 'EMPTY_NEXT_BODY' }`

## Scope
Nu schimba designul, componentele Taskuri, datele sau functionalitatea. Repara doar auditul de screenshot.
