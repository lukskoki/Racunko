# Backend Setup

## Instalacija

### 1. Kreiranje virtualnog okruzenja

```bash
python -m venv .venv
```

### 2. Aktiviranje virtualnog okruzenja

**Windows:**
```bash
.venv\Scripts\activate
```

**Linux/Mac:**
```bash
source .venv/bin/activate
```

### 3. Instalacija potrebnih paketa

```bash
pip install -r requirements.txt
```

### 4. Konfiguracija .env fajla

Kreiraj `.env` fajl u `/backend` folderu sa sljedecim sadrzajem:

```
DEBUG=True
```

### 5. Pokretanje aplikacije

```bash
python manage.py runserver
```
