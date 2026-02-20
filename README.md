# MG Stevanović - Mermer & Granit

Profesionalna obrada mermera i granita - web prezentacija.

## Struktura

```
├── src/
│   ├── index.html       # HTML stranica
│   ├── style.css        # CSS stilovi
│   ├── script.js        # JavaScript
│   └── images/          # Slike i logo
├── Dockerfile           # Docker konfiguracija
├── nginx.conf           # Nginx serverska konfiguracija
└── .github/
    └── workflows/
        └── deploy.yml   # GitHub Actions workflow
```

## Razvoj

Lokalno testiranje:
```bash
docker build -t mgstevanovic:latest .
docker run -p 8080:80 mgstevanovic:latest
```

Zatim posjetite `http://localhost:8080`

## Deployment

Automatski je deployment na Hetzner kroz GitHub Actions. Svaki push na `main` branch:

1. Gradi Docker image
2. Pušuje na GitHub Container Registry (GHCR)
3. Povlačiimage sa GHCR-a na Hetzner serveru
4. Restartuje kontejner kroz docker-compose

### Potrebni Secrets

U GitHub repository settings trebate postaviti:
- `SERVER_HOST` - IP adresa Hetzner servera
- `SERVER_USER` - Korisničko ime na serveru
- `SERVER_SSH_KEY` - SSH private key za servidor

## Konfiguracija

### nginx.conf
Sadrži sve potrebne header-e, kompresiju i rewrite-ove za SPA.

### docker-compose.yml
U `/opt/infra/docker-compose.yml` trebate dodati (već je dodano):

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

## Autor

Vladan Andrić
