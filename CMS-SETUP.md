# TC Biblis – Website-CMS (Inhalte bearbeiten)

Mit dem CMS können Vorstandsmitglieder **Texte, Bilder, News, Trainer und
Vorstand** bearbeiten – ohne Programmieren. Gespeicherte Änderungen landen
automatisch auf GitHub und die Website aktualisiert sich von selbst.

**Bearbeiten unter:** https://b777-7ao.github.io/tc-biblis/admin/

Diese Variante braucht **keinen Cloudflare-Worker und keine OAuth-App** – nur
einen kostenlosen GitHub-Zugang pro Person.

---

## Einmal pro Person: Zugang einrichten (ca. 5 Min)

### 1. Kostenloses GitHub-Konto (falls noch nicht vorhanden)
https://github.com/signup – E-Mail + Passwort, 2 Minuten.
> Den GitHub-Benutzernamen an den Administrator geben, damit er als Bearbeiter
> freigeschaltet wird (siehe „Bearbeiter freischalten" unten).

### 2. Zugangs-Token erstellen (einmalig)
1. Eingeloggt auf GitHub diese Seite öffnen:
   **https://github.com/settings/tokens?type=beta**
   (Settings → Developer settings → **Fine-grained tokens** → **Generate new token**)
2. Ausfüllen:
   - **Token name:** `TC Biblis CMS`
   - **Expiration:** z. B. 1 Jahr (danach einfach neu erstellen)
   - **Repository access:** „Only select repositories" → **`b777-7AO/tc-biblis`**
   - **Permissions → Repository permissions → Contents:** auf **Read and write** stellen
3. **Generate token** → den angezeigten Token **kopieren** (beginnt mit `github_pat_…`,
   wird nur einmal angezeigt).

### 3. Im CMS anmelden
1. https://b777-7ao.github.io/tc-biblis/admin/ öffnen
2. **„Sign In Using Access Token"** klicken
3. Den kopierten Token einfügen → fertig. Der Browser merkt sich die Anmeldung.

---

## Bearbeiter freischalten (macht der Administrator, einmalig pro Person)
Repo öffnen → **Settings** → **Collaborators** → **Add people** →
GitHub-Benutzernamen eingeben → die Person bestätigt die Einladung per E-Mail.
> Wer den Token wie oben erstellt, muss vorher als Collaborator hinzugefügt sein.

---

## So wird bearbeitet
1. https://b777-7ao.github.io/tc-biblis/admin/ öffnen und anmelden.
2. Links einen Bereich wählen, Werte ändern, dann oben **Save** klicken.
3. Nach ca. 1 Minute ist die Änderung live.

### Was kann bearbeitet werden?
| Bereich im CMS | bearbeitet | erscheint auf |
|---|---|---|
| **Bilder** | alle Hauptfotos (Hero, Plätze, Halle, Jugend, Training, Match, Clubhaus, Gemeinschaft) | überall auf der Website |
| **Seitentexte** | Überschriften & Einleitungen (Startseite + alle Seitenköpfe) | jeweilige Seiten |
| **Aktuelles** | News-Meldungen | Startseite |
| **Trainerteam** | Trainerinnen & Trainer | Seite „Trainerteam" |
| **Vorstand** | Ansprechpartner | Seite „Vorstand" |

**Bild ersetzen:** im Bereich **Bilder** beim gewünschten Slot ein neues Foto
hochladen → Save. Es wird automatisch überall verwendet, wo dieses Bild erscheint.

---

## Optional: „Sign in with GitHub" statt Token (bequemer, aber mehr Aufwand)
Wer lieber einen einfachen „Mit GitHub anmelden"-Knopf möchte, kann zusätzlich
den kostenlosen Login-Helfer einrichten:
1. GitHub **OAuth App** anlegen (Settings → Developer settings → OAuth Apps),
   Callback-URL = die Worker-URL aus Schritt 2 `+ /callback`.
2. Den fertigen Worker **sveltia-cms-auth** bei Cloudflare bereitstellen
   (https://github.com/sveltia/sveltia-cms-auth), Variablen `GITHUB_CLIENT_ID`,
   `GITHUB_CLIENT_SECRET`, `ALLOWED_DOMAINS=b777-7ao.github.io` setzen.
3. In `admin/config.yml` unter `backend:` `base_url: <Worker-URL>` ergänzen.

Danach funktioniert „Sign in with GitHub". Der Token-Weg oben funktioniert auch
ohne diesen Schritt.

---

## Hinweise
- Die Website funktioniert auch **ohne** CMS normal weiter; lädt eine Inhaltsdatei
  einmal nicht, zeigt die Seite automatisch den zuletzt eingebauten Stand.
- Schnell testen ohne Token: im `/admin/` **„Work with Local Repository"** wählen
  und den `tc-biblis`-Ordner auswählen (bearbeitet lokal auf dem eigenen Rechner).
- Bearbeitbare Inhalte liegen in `content/` (`texts.json`, `images.json`,
  `news.json`, `trainers.json`, `board.json`).
