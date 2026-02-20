# MG Stevanović - Hetzner Deployment - Sljedeći Koraci

## 🎯 Šta je Trebalo Uraditi (GOTOVO ✅)

MG Stevanovic folder je sada strukturiran identično kao `__08__ANDRIC.BA` i `_06__4NDRIC.COM` sa svim potrebnih datotekama za deployment na Hetzner infrastrukturi.

### ✅ Sve je Spremljeno:

**Lokalnih fajlova:**
- ✅ `Dockerfile` - Docker image konfiguracija
- ✅ `nginx.conf` - Web server konfiguracija  
- ✅ `src/index.html` - HTML stranica
- ✅ `src/style.css` - CSS stilovi
- ✅ `src/script.js` - JavaScript logika
- ✅ `src/images/logo.jpg` - Logotip
- ✅ `.github/workflows/deploy.yml` - GitHub Actions workflow
- ✅ `.gitignore` - Git ignore file
- ✅ `README.md` - Dokumentacija
- ✅ `DEPLOYMENT_GUIDE.md` - Deployment uputstva
- ✅ `SETUP_COMPLETE.md` - Setup summary

**Na Hetzneru (već gotovo):**
- ✅ `_07__INFRA/docker-compose.yml` - mgstevanovic servis je već dodan
- ✅ Traefik koristi se kao reverse proxy
- ✅ Let's Encrypt je konfigurisan za SSL

---

## 🚀 Šta Trebate Uraditi Sada

### **1️⃣ GITHUB REPOSITORY**

#### 1a. Kreirajte novi repository na https://github.com/new

```
Repository name: mgstevanovic
Description: MG Stevanović - Marble and Granite Website
Visibility: Public (ili Private ako trebate)
```

#### 1b. Initialize Git i Push

```bash
cd "C:\Users\vland\__02__Privatno\MG Stevanovic"
git config --global user.email "your@email.com"
git config --global user.name "Your Name"
git init
git add .
git commit -m "Initial commit: MG Stevanovic website for Hetzner deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mgstevanovic.git
git push -u origin main
```

---

### **2️⃣ GITHUB SECRETS SETUP**

Trebate da postavite 3 rada GitHub Actions secretsa:

**Gdje:** GitHub Repository → Settings → Secrets and variables → Actions → New repository secret

#### Secret 1: `SERVER_HOST`
- **Value:** IP adresa Hetzner servera (npr: `123.45.67.89`)

#### Secret 2: `SERVER_USER`  
- **Value:** SSH korisnik (obično `root`)

#### Secret 3: `SERVER_SSH_KEY`
- **Value:** SSH private key (koji nema lozinku)

**Kako dobiti SSH ključ:**

Na Hetzner serveru:
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/deploy_key -N ""
cat ~/.ssh/deploy_key
```

Kopijuj cijeli sadržaj `deploy_key` fajla (privatni ključ) i primi kao `SERVER_SSH_KEY` secret.

Javni ključ (`deploy_key.pub`) trebate dodati u `~/.ssh/authorized_keys`:
```bash
cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

---

### **3️⃣ HETZNER DOCKER-COMPOSE VERIFIKACIJA**

Provjerite da `/opt/infra/docker-compose.yml` na Hetzneru sadrži `mgstevanovic` servis:

```bash
ssh root@YOUR_SERVER_IP
grep -A 12 "MGSTEVANOVIC" /opt/infra/docker-compose.yml
```

Trebao bi biti sličan ovome:
```yaml
  # ===== MGSTEVANOVIC.ANDRIC.BA =====
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

*(Ovo je već trebalo biti tamo, ali provjerite)*

---

## 🔄 Kako Radi Deployment

1. **Vi lokalno kreirate ili mijenjate fajlove** (HTML, CSS, JS)
2. **Git commit & push na main branch**
3. **GitHub Actions automatski se pokreće:**
   - Gradi Docker image (`ubuntu-latest` runner)
   - Multi-arch build (`linux/amd64`, `linux/arm64`)
   - Pušuje na GitHub Container Registry kao `ghcr.io/YOUR_USERNAME/mgstevanovic:latest`
4. **SSH koristi se za deployment na Hetzner:**
   - Konektuje se na server
   - `cd /opt/infra`
   - `git pull` (povlači latest docker-compose.yml)
   - `docker compose pull mgstevanovic` (povlači novi image)
   - `docker compose up -d --no-deps mgstevanovic` (restartuje servis)
5. **Dostupno je na `https://mgstevanovic.andric.ba` 🎉**

---

## 📋 Checklist Prije Prvog Deployment-a

- [ ] GitHub repository je kreiran
- [ ] MG Stevanovic folder je pushed na GitHub
- [ ] `SERVER_HOST` secret je postavljeno
- [ ] `SERVER_USER` secret je postavljeno  
- [ ] `SERVER_SSH_KEY` secret je postavljeno
- [ ] SSH ključ je dodan u `authorized_keys` na Hetzneru
- [ ] `/opt/infra/docker-compose.yml` sadrži `mgstevanovic` servis
- [ ] DNS je kreitan za `mgstevanovic.andric.ba` (trebalo bi biti)

---

## 🧪 Test Push za Provijeru

Možete da testira workflow sa malim promjenom:

```bash
# Na lokalnom računaru
echo "<!-- Version: $(date +%s) -->" >> src/index.html
git add src/index.html
git commit -m "Test deployment"
git push origin main
```

Zatim idi na GitHub → Actions i vidi da li se build završio успeshно.

---

## 🔍 Troubleshuting

### ❌ GitHub Action Fail
- Provjera logs u GitHub Actions tab
- Obično je to SSH key ili SERVER_HOST greša

### ❌ Docker Pull Fail
```bash
# Hetzner server
docker compose pull mgstevanovic
docker compose up -d --no-deps mgstevanovic
docker compose logs mgstevanovic
```

### ❌ SSL Certificate Issue
```bash
# Hetzner server - provjerite Traefik
docker logs traefik | grep mgstevanovic
```

---

## 💡 Korisni Komandi

```bash
# Hetzner SSH pristup
ssh root@YOUR_SERVER_IP

# Vidjeti sve running kontejnere
docker ps | grep -E "traefik|mgstevanovic|4ndric|andric-ba"

# Vidjeti logs
docker compose logs mgstevanovic

# Manual restart
docker compose down mgstevanovic
docker compose up -d mgstevanovic

# Provjerite dostupnost
curl -I https://mgstevanovic.andric.ba
```

---

## 🎯 Rezultat

Kada je sve urađeno, trebali bi imati:
- ✅ Live website na `https://mgstevanovic.andric.ba`
- ✅ Automatski SSL sa Let's Encrypt
- ✅ Automatski deployment sa GitHub push-om
- ✅ Identična infrastruktura sa `/04__ANDRIC.BA` i `/_06__4NDRIC.COM`

---

**Sada je do вас da kompletira GitHub setup i testirate deployment! 🚀**
