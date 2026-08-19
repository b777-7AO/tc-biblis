# One-click „Sign in with GitHub" für das CMS

Damit Bearbeiter sich mit **einem Klick** anmelden (statt einen Token einzufügen),
braucht es einen kleinen, kostenlosen Login-Helfer. Das ist eine **einmalige**
Einrichtung (ca. 10 Min). Danach klicken alle nur noch „Sign in with GitHub".

Wir nutzen den fertigen, gepflegten Open-Source-Helfer **sveltia-cms-auth**
(läuft kostenlos als Cloudflare Worker).

---

## Schritt 1 – GitHub OAuth-App anlegen
1. Öffnen: **https://github.com/settings/developers** → **OAuth Apps** → **New OAuth App**
2. Eintragen:
   - **Application name:** `TC Biblis CMS`
   - **Homepage URL:** `https://b777-7ao.github.io/tc-biblis/`
   - **Authorization callback URL:** vorerst irgendetwas, z. B.
     `https://example.com/callback` (wird in Schritt 3 korrigiert)
3. **Register application**
4. **Client ID** notieren → **Generate a new client secret** → **Client Secret**
   notieren (wird nur einmal angezeigt).

## Schritt 2 – Worker bei Cloudflare bereitstellen (kostenlos)
1. Falls nötig, kostenloses Cloudflare-Konto: https://dash.cloudflare.com/sign-up
2. Auf **https://github.com/sveltia/sveltia-cms-auth** den Button
   **„Deploy to Cloudflare"** klicken und dem Assistenten folgen.
3. Beim Einrichten diese **Variablen / Secrets** setzen:
   | Name | Wert |
   |------|------|
   | `GITHUB_CLIENT_ID` | die Client ID aus Schritt 1 |
   | `GITHUB_CLIENT_SECRET` | das Client Secret aus Schritt 1 |
   | `ALLOWED_DOMAINS` | `b777-7ao.github.io` |
4. Nach dem Deploy gibt es eine Worker-URL, z. B.
   **`https://tc-biblis-cms.deinname.workers.dev`** – diese notieren.

## Schritt 3 – Callback-URL in der OAuth-App korrigieren
Zurück in der GitHub OAuth-App (Schritt 1) die **Authorization callback URL**
auf die echte Worker-URL `+ /callback` setzen:
`https://tc-biblis-cms.deinname.workers.dev/callback` → **Update application**.

## Schritt 4 – CMS auf den Worker zeigen lassen
In **`admin/config.yml`** unter `backend:` die vorbereitete Zeile aktivieren
(das `#` entfernen) und die echte Worker-URL eintragen:

```yaml
backend:
  name: github
  repo: b777-7AO/tc-biblis
  branch: main
  base_url: https://tc-biblis-cms.deinname.workers.dev
```

Datei speichern & pushen (oder direkt auf github.com bearbeiten).
> Tipp: Schickst du mir einfach die Worker-URL, trage ich diese Zeile ein und
> pushe sie für dich.

---

## Fertig
Ab jetzt zeigt **https://b777-7ao.github.io/tc-biblis/admin/** beim Klick auf
**„Sign in with GitHub"** den GitHub-Login → „Authorize" → und der Bearbeiter ist
drin. Kein Token mehr nötig.

Bearbeiter müssen weiterhin als **Collaborator** im Repo hinzugefügt sein
(Repo → Settings → Collaborators), damit sie speichern dürfen.

> Hinweis: Der Token-Login („Sign In Using Access Token") funktioniert parallel
> weiter – dieser Schritt macht den Login nur bequemer, ersetzt nichts.
