# MG Stevanović - Hetzner Deployment Setup

## ✅ Što je Done - Struktura je Gotova!

MG Stevanovic folder je sada strukturiran identično kao `__08__ANDRIC.BA` i `_06__4NDRIC.COM`:

```
MG Stevanovic/
├── .github/
│   └── workflows/
│       └── deploy.yml          ✅ GitHub Actions workflow
├── .gitignore                  ✅ Git ignore pravila
├── Dockerfile                  ✅ Docker image build
├── README.md                   ✅ Dokumentacija
├── nginx.conf                  ✅ Nginx konfiguracija za mgstevanovic.andric.ba
└── src/
    ├── index.html              ✅ Stranica
    ├── style.css               ✅ Stilovi
    ├── script.js               ✅ Skripte
    └── images/
        └── logo.jpg            ✅ Prebačena slika
```

## 🔧 Što Trebate Uraditi Sada

### 1. Inicijalizuj Git Repository

```bash
cd "c:\Users\vland\__02__Privatno\MG Stevanovic"
git init
git add .
git commit -m "Initial commit: MG Stevanovic website setup for Hetzner deployment"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/mgstevanovic.git
# git push -u origin main
```

### 2. Push to GitHub

Trebate da:
- Kreirate `mgstevanovic` repository na GitHub-u
- Postavite GitHub Actions secrets:
  - `SERVER_HOST` - Hetzner server IP
  - `SERVER_USER` - SSH korisnik
  - `SERVER_SSH_KEY` - SSH private key

### 3. Ažuriraj Hetzner Docker Compose

Na `/opt/infra/docker-compose.yml` serveru trebate dodati `mgstevanovic` servis (već je u `_07__INFRA` verziji):

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

### 4. Deploy Proces (Automatski)

- Svaki push na `main` branch će:
  1. Izgraditi Docker image sa `ghcr.io/vlandric/mgstevanovic:latest` tagom
  2. Pushovati na GitHub Container Registry
  3. SSH-om će se konektovati na Hetzner server
  4. Izvršiti `docker compose pull mgstevanovic`
  5. Restartovati servis sa `docker compose up -d --no-deps mgstevanovic`

## 📋 Checkpoints

✅ `Dockerfile` - nginx:alpine sa static files
✅ `nginx.conf` - za mgstevanovic.andric.ba sa GZIP, security headers, i SPA routing
✅ `/src` folder - HTML, CSS, JS, images svi na mjestu
✅ `.github/workflows/deploy.yml` - GitHub Actions workflow
✅ `.gitignore` - standard ignoracije
✅ `README.md` - dokumentacija

## 🚀 Deployment URL

Kada sve bude gotovo:
- **Domena**: `https://mgstevanovic.andric.ba`
- **Status**: Automatski će biti dostupan preko Traefik reverse proxy-ja

## 📝 Napjmenekumene SSH u GitHub Actions

Trebate da kreirate deploy ključe bez lozinke:

```bash
# Na Hetzner serveru:
ssh-keygen -t rsa -b 4096 -f ~/.ssh/deploy_key -N ""

# Sadržaj ~/.ssh/deploy_key postavljate kao GitHub secret: SERVER_SSH_KEY
# Javni ključ ~/.ssh/deploy_key.pub ide u ~/.ssh/authorized_keys
```

---

**Sve je sprema za GitHub deployment! 🎉**
