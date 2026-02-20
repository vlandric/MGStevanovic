# 🎉 MG Stevanović - Kompletan Setup za Hetzner Deployment

## 📦 Što je Urađeno

### ✅ Folder Struktura
Folder je sada identičan sa `__08__ANDRIC.BA` i `_06__4NDRIC.COM`:

```
MG Stevanovic/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions automatska build & deploy
├── src/
│   ├── index.html                  # Stranica
│   ├── style.css                   # Stilovi
│   ├── script.js                   # JavaSkript logika
│   └── images/
│       └── logo.jpg                # Logotip
├── Dockerfile                      # nginx:alpine sa static files
├── nginx.conf                      # Nginx konfiguracija
├── .gitignore                      # Git ignore fajl
├── README.md                       # Dokumentacija
└── DEPLOYMENT_GUIDE.md             # Deployment instrukcije
```

### ✅ Fajlovi koji su Kreirani

1. **Dockerfile** - Koristi nginx:alpine, kopira nginx.conf i src/ fajlove
2. **nginx.conf** - Konfigurisano za `mgstevanovic.andric.ba`:
   - Gzip kompresija
   - Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
   - SPA routing (try_files za fallback na index.html)
   - Deny hidden files

3. **.github/workflows/deploy.yml** - Automatski deployment:
   - Build Docker image na push na `main` branch
   - Push na GitHub Container Registry
   - SSH deploy na Hetzner server
   - Automatski `docker compose pull` i restart

4. **.gitignore** - Standard ignacija (.DS_Store, .vscode, node_modules, dist, build)

5. **src/** - Svi HTML/CSS/JS/image fajlovi prebačeni iz `verzija 1/`

## 🚀 Što Trebate Raditi

### Korak 1: GitHub Repository Setup

```bash
cd "c:\Users\vland\__02__Privatno\MG Stevanovic"
git init
git add .
git commit -m "Initial commit: MG Stevanovic website for Hetzner"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mgstevanovic.git
git push -u origin main
```

### Korak 2: GitHub Secrets

U GitHub repository, idi na **Settings → Secrets and variables → Actions** i dodaj:

- `SERVER_HOST` - IP adresa Hetzner servera (npr: 123.45.67.89)
- `SERVER_USER` - SSH korisnik (npr: root)
- `SERVER_SSH_KEY` - SSH private key (bez lozinke)

Primjer SSH ključa:
```bash
# Na Hetzner serveru:
ssh-keygen -t rsa -b 4096 -f /root/.ssh/deploy_key -N ""

# Sadržaj /root/.ssh/deploy_key (privatni) ide kao GitHub secret
# Javni ključ ide u /root/.ssh/authorized_keys
```

### Korak 3: Verifikuj Hetzner Setup

Provjerite da `/opt/infra/docker-compose.yml` sadrži:

```yaml
mgstevanovic:
  image: ghcr.io/vlandric/mgstevanovic:latest
  container_name: mgstevanovic
  restart: unless-stopped
  networks:
    - web
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.mgstevanovic.rule=Host(`mgstevanovic.andric.ba`)"
    - "traefik.http.routers.mgstevanovic.entrypoints=websecure"
    - "traefik.http.routers.mgstevanovic.tls.certresolver=letsencrypt"
    - "traefik.http.services.mgstevanovic.loadbalancer.server.port=80"
```

*(Ovo je već dodano u trenutnoj verziji)*

## 🔄 Deployment Proces (Automatski)

1. **Lokalno razvoj**: Radite sa HTML/CSS/JS u `src/` folderu
2. **Git commit & push**:
   ```bash
   git add .
   git commit -m "Update: izmjena styling ili sadržaja"
   git push origin main
   ```
3. **GitHub Actions Aktivacija**: 
   - Automatski se pokreće workflow
   - Gradi Docker image
   - Pušuje na `ghcr.io/vlandric/mgstevanovic:latest`
4. **Hetzner SSH Deploy**:
   - Povlači novi image
   - Restartuje kontejner
   - Dostupno na `https://mgstevanovic.andric.ba` 🎉

## 📝 Build Lokalno (Za Testiranje)

```bash
# Build Docker image
docker build -t mgstevanovic:latest .

# Run kontejner
docker run -p 8080:80 mgstevanovic:latest

# Otvori http://localhost:8080
```

## 🔐 Sigurnost

✅ Sve slike se grade sa `--platform linux/amd64,linux/arm64` (multi-arch)
✅ GitHub Actions koristi GHCR sa autentifikacijom
✅ SSH deploy koristi private key (bez lozinke)
✅ Nginx ima security headers
✅ Traefik se koristi za SSL/TLS sa Let's Encrypt

## 📊 Struktura je Identična sa Ostalim Projektima

| Projekt | Dockerfile | nginx.conf | GitHub Actions | Docker Push |
|---------|----------|-----------|---------------|------------|
| __08__ANDRIC.BA | ✅ | ✅ | ✅ | ✅ |
| _06__4NDRIC.COM | ✅ | ✅ | ✅ | ✅ |
| MG Stevanovic | ✅ | ✅ | ✅ | ✅ |

## ✨ Sumiran Pregled

- **Domena**: `mgstevanovic.andric.ba`
- **Tip**: Static website (HTML/CSS/JS)
- **Server**: Hetzner sa Traefik reverse proxy
- **SSL**: Automatski sa Let's Encrypt
- **Deploy**: GitHub Actions → GHCR → Hetzner SSH
- **Status**: 🟢 Spreman za deployment!

---

**Sve je gotovo! Sada trebate samo GitHub repository i SSH secrets.** 🚀
