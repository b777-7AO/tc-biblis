# TC Biblis – Website-CMS einrichten

Mit dem CMS können Vorstandsmitglieder Inhalte der Website **ohne Programmieren**
bearbeiten (News, Trainerteam, Vorstand). Gespeicherte Änderungen landen
automatisch auf GitHub und die Seite aktualisiert sich von selbst.

Die Bearbeitungs-Oberfläche liegt unter:
**https://julianito03.github.io/tc-biblis/admin/**

---

## Teil 1 — Einmalige Einrichtung (technisch, ca. 15 Min)

Diese Schritte macht **eine** Person einmalig. Danach können alle Editoren
einfach mit GitHub-Login arbeiten.

### 1. GitHub OAuth-App anlegen (für den Login)
1. Auf GitHub einloggen → **Settings** → **Developer settings** →
   **OAuth Apps** → **New OAuth App**.
2. Ausfüllen:
   - **Application name:** `TC Biblis CMS`
   - **Homepage URL:** `https://julianito03.github.io/tc-biblis/`
   - **Authorization callback URL:** `https://tc-biblis-cms.<dein-subdomain>.workers.dev/callback`
     (die genaue URL bekommst du in Schritt 2 – du kannst sie danach hier eintragen)
3. **Register application** → **Client ID** notieren →
   **Generate a new client secret** → **Client Secret** notieren (nur einmal sichtbar!).

### 2. Login-Helfer („Auth Worker") bei Cloudflare bereitstellen (kostenlos)
Wir nutzen den fertigen Open-Source-Helfer **sveltia-cms-auth**.
1. Kostenloses Cloudflare-Konto erstellen: https://dash.cloudflare.com/sign-up
2. Auf der Projektseite **https://github.com/sveltia/sveltia-cms-auth** dem
   „Deploy to Cloudflare"-Knopf folgen (oder per `wrangler deploy`).
3. Beim Deploy diese **Variablen** setzen:
   - `GITHUB_CLIENT_ID` = die Client ID aus Schritt 1
   - `GITHUB_CLIENT_SECRET` = das Client Secret aus Schritt 1
   - `ALLOWED_DOMAINS` = `julianito03.github.io`
4. Nach dem Deploy bekommst du eine Worker-URL, z. B.
   `https://tc-biblis-cms.deinname.workers.dev`.
5. Diese URL in der **GitHub OAuth-App** (Schritt 1) als Callback eintragen:
   `https://tc-biblis-cms.deinname.workers.dev/callback`.

### 3. CMS auf den Worker zeigen lassen
In der Datei **`admin/config.yml`** die Zeile

```yaml
base_url: https://REPLACE-WITH-YOUR-AUTH-WORKER.workers.dev
```

durch deine echte Worker-URL ersetzen (ohne `/callback`), z. B.

```yaml
base_url: https://tc-biblis-cms.deinname.workers.dev
```

Datei speichern und auf GitHub pushen (oder direkt auf github.com bearbeiten).

### 4. Editoren freischalten
Jeder Editor braucht ein **kostenloses GitHub-Konto** (E-Mail + Passwort,
Anmeldung unter https://github.com/signup – dauert 2 Minuten).
Dann im Repo: **Settings** → **Collaborators** → **Add people** →
GitHub-Benutzername eingeben → Einladung wird per E-Mail verschickt.
> Tipp: Du kannst die Konten vorab für die Vorstandsmitglieder anlegen und ihnen
> einfach Benutzername + Passwort geben – dann fühlt sich der Login wie ein
> normaler Website-Login an.

✅ Fertig. Ab jetzt funktioniert die Bearbeitung.

---

## Teil 2 — So bearbeiten die Vorstandsmitglieder die Inhalte

1. Seite öffnen: **https://julianito03.github.io/tc-biblis/admin/**
2. **„Login with GitHub"** klicken und einmalig bestätigen.
3. Links einen Bereich wählen:
   - **Aktuelles (Startseite)** – News-Meldungen
   - **Trainerteam** – Trainerinnen & Trainer
   - **Vorstand** – Ansprechpartner
4. Einträge ändern, hinzufügen (**+**) oder löschen, dann oben **Save** /
   **Publish** klicken.
5. Nach ca. 1 Minute ist die Änderung live auf der Website. Fertig!

### Was kann bearbeitet werden?
| Bereich | Datei | erscheint auf |
|---|---|---|
| News | `content/news.json` | Startseite – „Neuigkeiten aus dem Verein" |
| Trainerteam | `content/trainers.json` | Seite „Trainerteam" |
| Vorstand | `content/board.json` | Seite „Vorstand" |

Weitere Bereiche (Trainingszeiten, Texte, Bilder) können jederzeit ergänzt
werden – einfach Bescheid geben.

---

## Hinweise
- Die Website funktioniert auch **ohne** CMS normal weiter; das CMS ist nur die
  Bearbeitungs-Oberfläche. Lädt eine Inhaltsdatei einmal nicht, zeigt die Seite
  automatisch den zuletzt eingebauten Stand.
- Bilder hochladen ist möglich (Ordner `assets/img`), aktuell sind aber nur
  Text-Inhalte als bearbeitbare Felder eingerichtet.
- Alternativen ohne Cloudflare-Worker: **Pages CMS** (pagescms.org) bietet einen
  gehosteten Editor; dafür müsste statt `admin/config.yml` eine `.pages.yml`
  angelegt werden. Bei Bedarf umstellbar.
