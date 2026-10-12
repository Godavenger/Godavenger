<div align="center">

# Sharanya Mondal

Early-career developer building small, real tools related to AI stuff

[![Profile views](https://komarev.com/ghpvc/?username=Godavenger&color=1f6feb&style=flat-square&label=Profile+views)](https://github.com/Godavenger)
[![Follow](https://img.shields.io/github/followers/Godavenger?style=flat-square&logo=github&label=Follow&color=1f6feb)](https://github.com/Godavenger)

</div>

I'm Sharanya, early in my dev career, and I learn best by building. Pick a real problem, scope it down to something I can actually finish, and ship it where people can see it. I like developer tooling and the quiet gap between what an API's spec promises and what the service actually returns. The project below is my first public one. I'd rather finish one real thing than start ten.

## Featured project: driftcheck

**[driftcheck](https://github.com/Godavenger/driftcheck)** — a Python CLI that catches the moment a live API drifts from its OpenAPI contract.

[![Live API conformance](https://img.shields.io/endpoint?url=https://godavenger.github.io/driftcheck/badge.json)](https://godavenger.github.io/driftcheck/)
[![CI](https://github.com/Godavenger/driftcheck/actions/workflows/ci.yml/badge.svg)](https://github.com/Godavenger/driftcheck/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](https://github.com/Godavenger/driftcheck/blob/main/LICENSE)
![Python 3.11+](https://img.shields.io/badge/python-3.11%2B-3776AB?logo=python&logoColor=white)

Point it at an OpenAPI spec and the service running behind it. driftcheck calls the real endpoints, compares each response to the contract (status codes, and response schemas via `jsonschema`), and names exactly where the two disagree.

The part I like most is that it watches itself. A scheduled GitHub Action re-runs it against a live public API, the [Swagger Petstore](https://petstore3.swagger.io), and publishes the outcome two ways: the conformance badge above, and a self-contained, dark-mode HTML report on GitHub Pages. The verdict is encoded in the badge's content rather than the workflow's status, so it keeps reporting honestly: green while the API matches its contract, red the moment it stops.

This is real drift, not a staged demo. In a recent run against the live Petstore:

> `GET /store/inventory` returned **500** — a status its published spec never documents.

- Outputs to console, JSON, Markdown, or a standalone HTML page.
- Returns a non-zero exit code on drift, so it can gate a CI build instead of only reporting after the fact.
- 45 passing tests, MIT-licensed, Python 3.11+, packaged with `uv`.

Contract testing isn't new. Schemathesis, Dredd, and oasdiff each cover parts of this, and part of why I built driftcheck was to understand the problem from the ground up. The angle I leaned into is the one they don't make easy: an always-on conformance badge with no infrastructure behind it. No database, no secrets, no server to keep alive.

**Repo → [github.com/Godavenger/driftcheck](https://github.com/Godavenger/driftcheck) · Live report → [godavenger.github.io/driftcheck](https://godavenger.github.io/driftcheck/)**

## The stack behind it

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Typer](https://img.shields.io/badge/Typer-2C3E50?style=flat-square)
![httpx](https://img.shields.io/badge/httpx-005571?style=flat-square)
![jsonschema](https://img.shields.io/badge/jsonschema-1F6FEB?style=flat-square)
![OpenAPI](https://img.shields.io/badge/OpenAPI-6BA539?style=flat-square&logo=openapiinitiative&logoColor=white)
![pytest](https://img.shields.io/badge/pytest-0A9EDC?style=flat-square&logo=pytest&logoColor=white)
![Ruff](https://img.shields.io/badge/Ruff-261230?style=flat-square&logo=ruff&logoColor=D7FF64)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![uv](https://img.shields.io/badge/uv-DE5FE9?style=flat-square&logo=uv&logoColor=white)

## Now and next

- Getting sharper at the fundamentals: honest type hints, tests I actually trust, clean packaging with `uv`.
- Going deeper on API and contract testing, and what really breaks between a spec and a running service.
- Making GitHub Actions handle the boring parts: scheduled checks, badges, reports on Pages.
- Next for driftcheck: wider OpenAPI coverage and friendlier diff output. Then a second small project once this one earns it.

## Reach me

- GitHub — [@Godavenger](https://github.com/Godavenger)
- Email — sharanyamondal9@gmail.com
- Bugs, feedback, and nitpicks on driftcheck are genuinely welcome.

## By the numbers

<div align="center">

<img height="165" alt="Godavenger's GitHub stats" src="https://github-readme-stats.vercel.app/api?username=Godavenger&show_icons=true&hide_border=true&count_private=true&theme=tokyonight" />
<img height="165" alt="Most-used languages" src="https://github-readme-stats.vercel.app/api/top-langs/?username=Godavenger&layout=donut&hide_border=true&theme=tokyonight" />

<img alt="Contribution streak" src="https://streak-stats.demolab.com/?user=Godavenger&hide_border=true&theme=tokyonight" />

<img alt="Contribution activity" src="https://github-readme-activity-graph.vercel.app/graph?username=Godavenger&hide_border=true&theme=tokyo-night&area=true" />

<img alt="Trophies" src="https://github-profile-trophy.vercel.app/?username=Godavenger&theme=tokyonight&no-frame=true&column=7&margin-w=4" />

Building in the open as <b>@Godavenger</b>.

</div>
