# Bootstrap Google OAuth

## Изоляция

Для этого репозитория используется собственная авторизация `clasp`.

Не копируйте Script ID существующего приложения и не привязывайте connector к production Apps Script project.

## 1. Включить Apps Script API

В Google Apps Script user settings должен быть включён Apps Script API.

## 2. Получить OAuth один раз

На доверенном компьютере или в Google Cloud Shell:

```bash
npm install -g @google/clasp@3.4.1
clasp login --no-localhost
```

После авторизации:

```bash
cat ~/.clasprc.json
```

Содержимое является секретом.

## 3. Сохранить в GitHub

В:

`google-apps-script-connector → Settings → Secrets and variables → Actions`

создать **один** из секретов:

- `CLASPRC_JSON` — JSON как есть;
- `CLASPRC_B64` — base64-представление JSON.

После этого OAuth больше не нужен в чате и не хранится в исходниках.

## 4. Создать отдельный тестовый Apps Script

Запустить workflow:

- project: `relay-probe`
- operation: `bootstrap_deploy`

Workflow:

1. создаст новый standalone Apps Script project;
2. сохранит новый `.clasp.json` в `projects/relay-probe`;
3. отправит исходники;
4. создаст Web App deployment;
5. сохранит deployment ID и URL;
6. проверит публичный HTTP-ответ.

## Security

`.clasprc.json` никогда не коммитится целиком как credential-файл. Коммитится только project-local `.clasp.json`, содержащий Script ID и настройки source path.

Не используйте OAuth из другого production-репозитория как скрытую runtime-зависимость этого connector.
