# WordPress theme — `tc-biblis-theme`

The live site **tc-biblis.de** runs on WordPress (Host Europe WebPack) using this
custom block theme. It is a separate deploy target from the GitHub Pages static
site in the repo root.

## Automatic deploy

`.github/workflows/deploy-theme.yml` deploys this folder to the live server over
SFTP on every push to `main` that touches `wordpress/tc-biblis-theme/**`
(or via a manual run from the Actions tab).

Cache-busting is automatic: `functions.php` versions CSS/JS by file modification
time, so no manual version bumps are needed.

### Required repository secrets

Set these under **Settings → Secrets and variables → Actions**:

| Secret | Example | Notes |
|---|---|---|
| `SFTP_HOST` | `wp634.webpack.hosteurope.de` | SFTP hostname from the Host Europe KIS |
| `SFTP_PORT` | `22` | optional, defaults to 22 |
| `SFTP_USER` | `kdXXXXXX` or an SSH/SFTP user | the SFTP login (NOT the WordPress login) |
| `SFTP_PASSWORD` | `••••••` | the SFTP password |
| `SFTP_REMOTE_DIR` | `/wp-content/themes/tc-biblis-theme` | absolute path to the theme dir on the server; **must end in `/tc-biblis-theme`** |

The workflow refuses to run if `SFTP_REMOTE_DIR` does not end in
`/tc-biblis-theme`, so a wrong path can never let the mirror's `--delete` touch
the rest of the site.

## Manual deploy (fallback)

If SFTP is unavailable, build a zip and upload it via **WP admin → Design →
Themes → Add New → Upload Theme → Replace current with uploaded**:

```sh
cd wordpress && zip -rq tc-biblis-theme.zip tc-biblis-theme -x '*.DS_Store'
```
