# Računko

# Opis projekta
Ovaj projekt je rezultat timskog rada u sklopu projeknog zadatka kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu. \
Cilj ovog projekta je razviti mobilnu aplikaciju preko koje korisnici i obitelji kao grupe mogu pratiti svoje individualne ili zajedničke troškove tako što slikaju račune te dobiti analitički uvid u njih pomoču AI analize i predikcije prošlih i budućih troškova. \
Ovim projektom želimo pomoći ljudima da se lakše snalaze u vlastitim financijama i da pametnije planiraju troškove.

# **Funkcijski zahtjevi**

> **Visoki prioritet:**

F-1 Registracija korisnika: Sustav mora omogućiti registraciju glavnog, sporednog korisnika i administratora putem e-mail adrese ili vanjskih servisa (OAuth 2.0).\
F-2 Prijava u sustav: Korisnici se moraju moći prijaviti putem e-mail adrese ili Google računa kroz siguran sustav autentifikacije.\
F-3 Postavljanje mjesečnog budžeta: Glavni korisnik mora moći definirati i spremiti ukupni mjesečni budžet.\
F-4 Upravljanje kategorijama troškova: Glavni korisnik mora moći pregledavati, dodavati, uređivati i brisati kategorije troškova.\
F-5 Unos i skeniranje računa: Korisnici moraju moći ručno unijeti ili skenirati račun radi automatskog prepoznavanja iznosa, datuma i artikala.\
F-6 Automatska kategorizacija troškova: Sustav mora koristiti AI model za automatsku kategorizaciju troškova s više od 90% točnosti.\
F-7 Evidencija troškova: Sustav mora omogućiti pregled, uređivanje i brisanje vlastitih troškova; roditelj može uređivati troškove djeteta.\
F-9 Kreiranje grupe (obitelji): Glavni korisnik mora moći kreirati grupu i automatski postati njen administrator.\
F-10 Slanje zahtjeva za ulazak u grupu: Sporedni korisnik mora moći poslati zahtjev za pridruživanje postojećoj grupi.\
F-11 Odobravanje zahtjeva za ulazak u grupu: Glavni korisnik mora moći odobriti zahtjev i dodijeliti ulogu (roditelj/partner/dijete).\
F-12 Upravljanje sporednim korisnicima: Glavni korisnik mora moći dodati, urediti i izbrisati sporedne korisnike te upravljati njihovim ulogama i pristupima.\
F-14 ChatBot savjetnik: Sustav mora imati integriranog AI chatBota koji daje financijske savjete korisniku.\
F-16 Administracija korisnika: Administrator mora imati mogućnost pregleda, uređivanja i brisanja svih korisničkih računa.\
F-19 Odabir trgovine/lokacije: Sustav mora omogućiti odabir trgovine ili lokacije pri unosu računa.\
F-21 Postavljanje limita za dijete: Roditelj mora moći definirati mjesečni limit potrošnje djeteta te primati obavijesti o prekoračenju.\
F-22 Upravljanje ulogama: Glavni korisnik mora moći dodijeliti, izmijeniti i ukloniti korisničke uloge unutar grupe.

> **Srednji prioritet:**

F-8 Usporedba potrošnje po mjesecima: Sustav mora omogućiti usporedbu potrošnje između različitih mjeseci uz grafički prikaz trendova.\
F-9 Dodavanje fiksnih troškova: Glavni korisnik može definirati fiksne troškove koji se automatski dodaju svakog mjeseca.\
F-13 Evidencija zajedničkih troškova: Sustav mora prikazivati objedinjenu potrošnju svih korisnika u grupi.\
F-17 Generiranje izvještaja: Administrator mora moći generirati izvještaje u PDF/CSV formatu o potrošnji i korištenju sustava.\
F-18 Pregled pohranjenih računa: Korisnici moraju moći pregledati sve pohranjene slike računa.\
F-20 Upravljanje budžetnim ciljevima: Glavni korisnik mora moći definirati i pratiti ciljeve štednje ili potrošnje.\
F-24 Povijest aktivnosti: Administrator mora vidjeti povijest događaja kao što su registracije, brisanja i promjene uloga.

> **Nizak prioritet:**

F-15 Grafički prikaz troškova: Sustav mora omogućiti vizualizaciju potrošnje po kategorijama.\
F-23 Obavijesti: Sustav mora slati obavijesti o pristiglim zahtjevima za ulazak u grupu te o prekoračenju limita djeteta.

# **Nefunkcionalni zahtjevi**

> **Visoki prioritet:**

NF-1.1 – Autentifikacija i autorizacija: Sustav mora koristiti sigurne metode autentifikacije (OAuth 2.0, šifrirane lozinke).\
NF-1.2 – Sigurnost podataka: Svi korisnički i financijski podaci moraju biti zaštićeni u skladu s GDPR regulativom i šifrirani.\
NF-1.3 – Komunikacijski protokoli: Cjelokupna komunikacija između klijenta i poslužitelja mora koristiti HTTPS protokol.\
NF-2.2 – Prepoznavanje računa: AI modul mora prepoznati tekst s računa s minimalno 90% točnosti.\
NF-3.2 – Održavanje: Sustav mora biti razvijen prema MVC arhitekturi radi lakšeg održavanja i nadogradnje.\
NF-6.1 – Testiranje: Sustav mora biti testiran automatiziranim alatima (Selenium, Jest) radi provjere funkcionalnosti i sigurnosti.

> **Srednji prioritet:**

NF-2.1 – Performanse: Sustav mora obraditi i prikazati podatke o troškovima unutar 2 sekunde po zahtjevu korisnika.\
NF-3.1 – Skalabilnost: Sustav mora podržati do 1000 aktivnih korisnika bez pada performansi većeg od 10%.\
NF-4.1 – Dostupnost: Sustav mora biti dostupan minimalno 99% vremena tijekom godine.\
NF-6.2 – Integracija s vanjskim servisima: Sustav mora omogućiti integraciju s autentifikacijskim i AI servisima (OAuth, OCR/API).

> **Nizak prioritet:**

NF-5.1 – Podržane platforme: Aplikacija mora biti prilagođena mobilnim uređajima i web preglednicima (responsivni dizajn).\
NF-3.3 – Dokumentacija: Sustav mora imati tehničku dokumentaciju, korisnički priručnik i upute za instalaciju.

# Tehnologije
- Komunikacija: WhatsApp, Discord i Microsoft Teams
- UML dijagrami i dijagram baze: Astah, ERDPlus, VisualParadigm Online
- Frontend: React
- Backend: Python (Django)
- Baza podataka: Postgres
- Deploy: Heroku
- Dokumentacija: Github wiki
- Vanjski servis za ChatBot(ChatGPT) i prijavu Google Auth

# Članovi tima 
- Luka Kovačević
- Luka Uršić
- Luka Majcen
- Filip Šturlić
- Ante Galić
- Timon Menalo

# 📝 Kodeks ponašanja [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
Kao studenti sigurno ste upoznati s minimumom prihvatljivog ponašanja definiran u [KODEKS PONAŠANJA STUDENATA FAKULTETA ELEKTROTEHNIKE I RAČUNARSTVA SVEUČILIŠTA U ZAGREBU](https://www.fer.hr/_download/repository/Kodeks_ponasanja_studenata_FER-a_procisceni_tekst_2016%5B1%5D.pdf), te dodatnim naputcima za timski rad na predmetu [Programsko inženjerstvo](https://wwww.fer.hr).
Očekujemo da ćete poštovati [etički kodeks IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html) koji ima važnu obrazovnu funkciju sa svrhom postavljanja najviših standarda integriteta, odgovornog ponašanja i etičkog ponašanja u profesionalnim aktivnosti. Time profesionalna zajednica programskih inženjera definira opća načela koja definiranju  moralni karakter, donošenje važnih poslovnih odluka i uspostavljanje jasnih moralnih očekivanja za sve pripadnike zajenice.

Kodeks ponašanja skup je provedivih pravila koja služe za jasnu komunikaciju očekivanja i zahtjeva za rad zajednice/tima. Njime se jasno definiraju obaveze, prava, neprihvatljiva ponašanja te  odgovarajuće posljedice (za razliku od etičkog kodeksa). U ovom repozitoriju dan je jedan od široko prihvačenih kodeks ponašanja za rad u zajednici otvorenog koda.

# 📝 Licenca
Važeča (1)
[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

Ovaj repozitorij sadrži otvoreni obrazovni sadržaji (eng. Open Educational Resources)  i licenciran je prema pravilima Creative Commons licencije koja omogućava da preuzmete djelo, podijelite ga s drugima uz 
uvjet da navođenja autora, ne upotrebljavate ga u komercijalne svrhe te dijelite pod istim uvjetima [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License HR][cc-by-nc-sa].
>
> ### Napomena:
>
> Svi paketi distribuiraju se pod vlastitim licencama.
> Svi upotrijebleni materijali  (slike, modeli, animacije, ...) distribuiraju se pod vlastitim licencama.

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: https://creativecommons.org/licenses/by-nc/4.0/deed.hr 
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg

Orginal [![cc0-1.0][cc0-1.0-shield]][cc0-1.0]
>
>COPYING: All the content within this repository is dedicated to the public domain under the CC0 1.0 Universal (CC0 1.0) Public Domain Dedication.
>
[![CC0-1.0][cc0-1.0-image]][cc0-1.0]

[cc0-1.0]: https://creativecommons.org/licenses/by/1.0/deed.en
[cc0-1.0-image]: https://licensebuttons.net/l/by/1.0/88x31.png
[cc0-1.0-shield]: https://img.shields.io/badge/License-CC0--1.0-lightgrey.svg

### Reference na licenciranje repozitorija
[Adding a license to a repository](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository)
