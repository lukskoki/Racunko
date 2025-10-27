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

### 5. Konfiguracija .env fajla

Treba u core/settings.py u allowed hosts stavit svoju ip adresu preko koje se server runna
npr. ALLOWED_HOSTS=['123.123.123.123']



### 6. Migracije

```bash
python manage.py migrate
```


### 7. Pokretanje aplikacije

Umjesto 123.123.123.123, upisat svoju ip adresu
```bash
python manage.py runserver 123.123.123.123
```
