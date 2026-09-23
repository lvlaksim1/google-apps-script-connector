# Google Apps Script Connector

Универсальный инфраструктурный репозиторий для управления отдельными Google Apps Script-проектами из GitHub Actions.

## Назначение

Один раз авторизуется Google-аккаунт через `clasp`, после чего репозиторий умеет:

- создавать **новые standalone Apps Script projects**;
- хранить связь `GitHub project → scriptId`;
- отправлять исходники в Apps Script;
- создавать и обновлять deployment;
- публиковать Web App;
- выполнять HTTP health-check;
- хранить несекретные идентификаторы deployment в Git.

Production-проекты не нужны для bootstrap и не используются как шаблоны.

## Архитектура

```text
GitHub project directory
        │
        ▼
GitHub Actions
        │
        │ CLASPRC_JSON / CLASPRC_B64
        ▼
      clasp
        │
        ▼
new Google Apps Script project
        │
        ▼
Web App deployment
```

Каждый управляемый проект находится в:

```text
projects/<project-name>/
├── project.json
├── src/
│   ├── Code.gs
│   └── appsscript.json
├── .clasp.json          # появляется после bootstrap; НЕ секрет
├── .gas-deployment-id   # появляется после deploy; НЕ секрет
└── .web-app-url         # появляется после deploy; НЕ секрет
```

## Workflow

`Actions → Apps Script Connector → Run workflow`

Параметры:

- `project` — каталог проекта в `projects/`;
- `operation=bootstrap_deploy` — создать новый Apps Script project (если ещё нет), push, deployment и проверка;
- `operation=deploy` — обновить уже созданный проект и deployment;
- `operation=verify` — проверить публичный Web App без Google OAuth.

## OAuth

Нужен **отдельный** OAuth для этого connector-репозитория. Он не должен зависеть от секретов production-репозиториев.

Поддерживаются два GitHub Actions secret:

- `CLASPRC_JSON` — содержимое `~/.clasprc.json`;
- или `CLASPRC_B64` — тот же JSON в base64.

Достаточно одного из них.

См. [docs/BOOTSTRAP.md](docs/BOOTSTRAP.md).

## Первый тест

В репозитории уже есть полностью отдельный проект:

`projects/relay-probe`

Он не связан ни с одним существующим Apps Script-проектом. После первого `bootstrap_deploy` Google создаст для него новый Script ID и новый deployment.

Ожидаемый публичный ответ:

```text
CHAT_GAS_RELAY_OK
probe=<value>
time=<iso timestamp>
```

Этот probe нужен для проверки канала:

```text
ChatGPT Chat → обычный Web → Google Apps Script Web App
```

После подтверждения транспорта на его месте можно развивать GitHub Relay.
