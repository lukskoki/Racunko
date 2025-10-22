# Računko

# Opis projekta
Ovaj projekt je rezultat timskog rada u sklopu projeknog zadatka kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu. \
Cilj ovog projekta je razviti mobilnu aplikaciju preko koje korisnici i obitelji kao grupe mogu pratiti svoje individualne ili zajedničke troškove tako što slikaju račune te dobiti analitički uvid u njih pomoču AI analize i predikcije prošlih i budućih troškova. \
Ovim projektom želimo pomoći ljudima da se lakše snalaze u vlastitim financijama i da pametnije planiraju troškove.

# Funkcijski zahtjevi

> **Visoki prioritet:**

F-1 Registracija korisnika: Sustav mora omogućiti registraciju glavnog korisnika putem e-mail adrese ili vanjskih servisa (OAuth 2.0).\
F-2 Prijava u sustav: Korisnici se moraju moći prijaviti putem e-mail adrese ili vanjskih servisa.\
F-3 Postavljanje mjesečnog budžeta: Glavni korisnik mora moći definirati ukupni mjesečni budžet.\
F-4 Upravljanje kategorijama troškova: Glavni korisnik mora moći pregledavati, dodavati, uređivati i brisati kategorije troškova.\
F-5 Skeniranje računa: Korisnici moraju moći slikati ili učitati račun radi automatskog prepoznavanja podataka.\
F-6 Automatska kategorizacija troškova: Sustav mora koristiti AI model za razvrstavanje proizvoda po kategorijama troškova.\
F-7 Evidencija troškova: Sustav mora omogućiti pregled i uređivanje svih unesenih troškova.\
F-10 Upravljanje sporednim korisnicima: Glavni korisnik mora moći dodati, urediti i izbrisati sporedne korisnike te im dodijeliti razine pristupa.\
F-14 Administracija korisnika: Administrator mora imati mogućnost pregleda, uređivanja i brisanja svih korisničkih računa.

> **Srednji prioritet:**

F-8 Usporedba potrošnje po mjesecima: Sustav mora omogućiti usporedbu troškova između različitih mjeseci.\
F-9 Dodavanje fiksnih troškova: Glavni korisnik može definirati fiksne troškove (npr. najam, kredit) koji se automatski dodaju svaki mjesec.\
F-11 Evidencija zajedničkih troškova: Sustav mora omogućiti prikaz zajedničke potrošnje glavnog i sporednih korisnika.\
F-12 ChatBot savjetnik: Sustav mora imati integriranog chatBota koji daje financijske savjete temeljem potrošnje.\
F-13 Grafički prikaz troškova: Sustav mora omogućiti vizualizaciju potrošnje po kategorijama.\
F-15 Generiranje izvještaja: Administrator mora moći generirati izvještaje o korištenju aplikacije i ukupnoj statistici troškova.\
F-16 Pregled pohranjenih računa: Korisnici moraju moći pregledati slike računa pohranjene u bazi podataka.

# Nefunkcionalni zahtjevi

> **Visoki prioritet:**

NF-1.1 – Autentifikacija i autorizacija: Sustav mora koristiti sigurne metode autentifikacije (OAuth 2.0, šifrirane lozinke).\
NF-1.2 – Sigurnost podataka: Svi korisnički i financijski podaci moraju biti zaštićeni u skladu s GDPR regulativom.\
NF-1.3 – Komunikacijski protokoli: Sva komunikacija između klijenta i poslužitelja mora koristiti HTTPS protokol.\
NF-2.2 – Prepoznavanje računa: AI modul mora prepoznati tekst s računa s minimalno 90% točnosti.\
NF-3.1 – Održavanje: Sustav treba biti razvijen prema MVC arhitekturi radi lakšeg održavanja i nadogradnje.\
NF-3.2 – Dokumentacija: Sustav mora biti popraćen tehničkom dokumentacijom i korisničkim priručnikom.\
NF-4.2 – Sigurnosno kopiranje: Podaci se moraju automatski arhivirati svakih 24 sata.\
NF-5.1 – Podržane platforme: Aplikacija mora biti prilagođena za mobilne uređaje i preglednike (responsivni dizajn).\
NF-6.1 – Testiranje: Sustav mora biti testiran automatiziranim alatima (npr. Selenium, Jest) za funkcionalnost i sigurnost.

> **Srednji prioritet:**

NF-2.1 – Performanse: Sustav mora obraditi i prikazati podatke o troškovima unutar 2 sekunde po zahtjevu korisnika.\
NF-3.3 – Skalabilnost: Sustav mora biti dizajniran tako da podržava rast broja korisnika bez pada performansi.\
NF-4.1 – Dostupnost: Sustav mora imati minimalno 99% dostupnost tijekom godine.\
NF-6.2 – Integracija s vanjskim servisima: Sustav mora podržavati integraciju s autentifikacijskim i AI servisima (OAuth, OCR API).

# Tehnologije

#Instalcija
# Članovi tima 
- Luka Kovačević
- Luka Uršić
- Luka Majcen
- Filip Šturlić
- Ante Galić
- Timon Menalo

# Kontribucije
>Pravila ovise o organizaciji tima i su često izdvojena u CONTRIBUTING.md



# 📝 Kodeks ponašanja [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
Kao studenti sigurno ste upoznati s minimumom prihvatljivog ponašanja definiran u [KODEKS PONAŠANJA STUDENATA FAKULTETA ELEKTROTEHNIKE I RAČUNARSTVA SVEUČILIŠTA U ZAGREBU](https://www.fer.hr/_download/repository/Kodeks_ponasanja_studenata_FER-a_procisceni_tekst_2016%5B1%5D.pdf), te dodatnim naputcima za timski rad na predmetu [Programsko inženjerstvo](https://wwww.fer.hr).
Očekujemo da ćete poštovati [etički kodeks IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html) koji ima važnu obrazovnu funkciju sa svrhom postavljanja najviših standarda integriteta, odgovornog ponašanja i etičkog ponašanja u profesionalnim aktivnosti. Time profesionalna zajednica programskih inženjera definira opća načela koja definiranju  moralni karakter, donošenje važnih poslovnih odluka i uspostavljanje jasnih moralnih očekivanja za sve pripadnike zajenice.

Kodeks ponašanja skup je provedivih pravila koja služe za jasnu komunikaciju očekivanja i zahtjeva za rad zajednice/tima. Njime se jasno definiraju obaveze, prava, neprihvatljiva ponašanja te  odgovarajuće posljedice (za razliku od etičkog kodeksa). U ovom repozitoriju dan je jedan od široko prihvačenih kodeks ponašanja za rad u zajednici otvorenog koda.
>### Poboljšajte funkcioniranje tima:
>* definirajte načina na koji će rad biti podijeljen među članovima grupe
>* dogovorite kako će grupa međusobno komunicirati.
>* ne gubite vrijeme na dogovore na koji će grupa rješavati sporove primjenite standarde!
>* implicitno podrazmijevamo da će svi članovi grupe slijediti kodeks ponašanja.
 
>###  Prijava problema
>Najgore što se može dogoditi je da netko šuti kad postoje problemi. Postoji nekoliko stvari koje možete učiniti kako biste najbolje riješili sukobe i probleme:
>* Obratite mi se izravno [e-pošta](mailto:vlado.sruk@fer.hr) i  učinit ćemo sve što je u našoj moći da u punom povjerenju saznamo koje korake trebamo poduzeti kako bismo riješili problem.
>* Razgovarajte s vašim asistentom jer ima najbolji uvid u dinamiku tima. Zajedno ćete saznati kako riješiti sukob i kako izbjeći daljnje utjecanje u vašem radu.
>* Ako se osjećate ugodno neposredno razgovarajte o problemu. Manje incidente trebalo bi rješavati izravno. Odvojite vrijeme i privatno razgovarajte s pogođenim članom tima te vjerujte u iskrenost.

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
