use wypozyczalnia
db.createCollection("filmy")
db.createCollection("klienci")
db.createCollection("wypozyczenia")
db.filmy.insertMany([
  {
    _id: ObjectId('65677283ce9ec974b9cd7492'),
    tytul: 'Chłopi',
    gatunek: 'Dramat',
    rezyser: 'DK Welchman',
    czas_trwania_min: 116,
    ocena: 8.3,
    opis: 'Na tle zmieniających się pór roku i sezonowych prac polowych rozgrywają się losy rodziny Borynów i pięknej, tajemniczej Jagny.',
    aktorzy: [ 'Kamila Urzędowska', 'Mirosław Baka', 'Robert Gulaczyk' ],
    data_dodania: ISODate('2023-11-29T00:00:00.000Z')
  },
  {
    _id: ObjectId('65677283ce9ec974b9cd7493'),
    tytul: 'Czas krwawego księżyca',
    gatunek: 'Kryminał',
    rezyser: 'Martin Scorsese',
    czas_trwania_min: '206',
    ocena: '7.5',
    opis: 'Gdy na terenie zamieszkiwanym przez Osagów odkryta zostaje ropa naftowa, członkowie plemienia zaczynają ginąć lub umierać z nieznanych przyczyn. Sprawa ta przykuwa uwagę FBI i J. Edgara Hoovera.',
    aktorzy: [ 'Leonardo DiCaprio', 'Robert DeNiro', 'Lily Gladstone' ],
    data_dodania: ISODate('2023-11-29T00:00:00.000Z')
  },
  {
    _id: ObjectId('65677283ce9ec974b9cd7494'),
    tytul: 'Skazani na Shawshank',
    gatunek: 'Dramat',
    rezyser: 'Frank Darabont',
    czas_trwania_min: 142,
    ocena: 8.8,
    opis: 'Adaptacja opowiadania Stephena Kinga. Niesłusznie skazany na dożywocie bankier, stara się przetrwać w brutalnym, więziennym świecie.',
    aktorzy: [ 'Tim Robbins', 'Morgan Freeman' ],
    data_dodania: ISODate('2023-11-29T00:00:00.000Z')
  },
  {
    _id: ObjectId('65677283ce9ec974b9cd7495'),
    tytul: 'Dzień Świstaka',
    gatunek: 'Komedia romantyczna',
    rezyser: 'Harold Ramis',
    czas_trwania_min: 101,
    ocena: 7.2,
    opis: 'Phil, prezenter telewizyjnej prognozy pogody, przyjeżdża do małego miasteczka, by zrelacjonować Dzień Świstaka. Następnego ranka stwierdza, że wciąż jest ten sam dzień.',
    aktorzy: [
      'Bill Murray',
      'Andie MacDowell',
      'Chris Elliott',
      'Stephen Tobolowsky'
    ],
    data_dodania: ISODate('2023-11-29T00:00:00.000Z')
  },
  {
    _id: ObjectId('65677283ce9ec974b9cd7497'),
    tytul: 'Roundhay Garden Scene',
    gatunek: 'Dokumentalny',
    rezyser: 'Louis Aime Augustin Le Prince',
    czas_trwania_min: 0,
    ocena: 6.9,
    opis: "Członkowie rodziny reżysera Le Prince'a spacerują w ogrodzie.",
    aktorzy: [ 'Adolphe Le Prince', 'Josepth Whitley', 'Sarah Whitley' ],
    data_dodania: ISODate('2023-11-29T00:00:00.000Z')
  },
  {
    _id: ObjectId('65677283ce9ec974b9cd7498'),
    tytul: 'Ekvtime: Man of God',
    gatunek: 'Biograficzny',
    rezyser: 'Nikoloz Khomasuridze',
    czas_trwania_min: 140,
    ocena: 7,
    opis: "Po inwazji wojsk sowieckich na Gruzję w lutym 1921 roku gruziński rząd podejmuje decyzję o zebraniu narodowych skarbów i ukryciu ich we Francji. Zadanie ich ochrony powierza historykowi oraz archeologowi - Ekvtime'owi Takaishviliemu.",
    aktorzy: [
      'Rezo Chkhikvishvili',
      'Ana Tsereteli',
      'Gogi Turkiashvili',
      'Giorgi Megrelishvili'
    ],
    data_dodania: ISODate('2023-11-29T00:00:00.000Z')
  },
  {
    _id: ObjectId('65677283ce9ec974b9cd7499'),
    tytul: 'Zielona Mila',
    gatunek: 'Dramat',
    rezyser: 'Frank Darabont',
    czas_trwania_min: 189,
    ocena: 8.6,
    opis: 'Emerytowany strażnik więzienny opowiada przyjaciółce o niezwykłym mężczyźnie, którego skazano na śmierć za zabójstwo dwóch 9-letnich dziewczynek.',
    aktorzy: [
      'Tom Hanks',
      'David Morse',
      'Bonnie Hunt',
      'Michael Clarke Duncan',
      'James Cromwell'
    ],
    data_dodania: ISODate('2023-11-29T00:00:00.000Z')
  },
  {
    _id: ObjectId('65677283ce9ec974b9cd749a'),
    tytul: 'Chicken Curry Law',
    gatunek: 'Dramat',
    rezyser: 'Shekhar Sirrinn',
    czas_trwania_min: 101,
    ocena: 1.3,
    opis: 'Ambitna i niewinna dziewczyna pada ofiarą złych ludzi o potężnych politycznych wpływach, a także ogromnych pieniądzach.',
    aktorzy: [
      'Natalia Janoszek',
      'Ashutosh Rana',
      'Makrand Deshpande',
      'Nivedita Bhattacharya'
    ],
    data_dodania: ISODate('2023-11-29T00:00:00.000Z')
  },
  {
    _id: ObjectId('65677283ce9ec974b9cd749b'),
    tytul: 'Napoleon',
    gatunek: 'Biograficzny',
    rezyser: 'Ridley Scott',
    czas_trwania_min: 157,
    ocena: 5.9,
    opis: 'Napoleon Bonaparte pnie się po kolejnych szczeblach władzy. Towarzyszy mu przy tym ukochana Józefina.',
    aktorzy: [
      'Joaquin Phoenix',
      'Vanessa Kirby',
      'Tahar Rahim',
      'Rupert Everett',
      'Mark Bonnar'
    ],
    data_dodania: ISODate('2023-11-29T00:00:00.000Z')
  },
  {
    _id: ObjectId('657355835d2145210bd6219c'),
    tytul: 'Diablo. Wyścig o wszystko',
    gatunek: 'Akcja',
    rezyser: 'Michał Otłowski',
    czas_trwania_min: 94,
    ocena: 4.3,
    opis: 'Siostra Kuby zapada na ciężką chorobę. Chłopak, aby zdobyć pieniądze na jej leczenie, postanawia wziąć udział w nielegalnych wyścigach samochodowych.',
    aktorzy: [
      'Rafał Mohr',
      'Bogusław Linda',
      'Cezary Pazura',
      'Karolina Szymczak',
      'Joanna Opozda'
    ],
    data_dodania: ISODate('2023-12-08T17:42:27.322Z')
  }
])
db.klienci.insertMany([
  {
    _id: ObjectId('656f71ec80223fd74376d6d7'),
    nazwa_uzytkownika: 'J123',
    imie: 'Józef',
    nazwisko: 'Nowak',
    haslo: '$2b$10$WbKQEW2AkWnK9l7GbqEe/eWHtBBLLI8wMzGg1E69D9amDH7RAqn9O',
    adres: {
      ulica: 'Blada',
      nr_domu: '1C',
      nr_lokalu: '11',
      kod_pocztowy: '33-555',
      miejscowosc: 'Tarnów'
    },
    telefon: '934243182',
    data_rejestracji: ISODate('2023-12-05T18:54:36.526Z'),
    typ_konta: 'client'
  },
  {
    _id: ObjectId('6574a141078e1aeb283f43ff'),
    typ_konta: 'administrator',
    nazwa_uzytkownika: 'admin',
    imie: 'Admin',
    nazwisko: 'Istrator',
    haslo: '$2b$10$aQVpFjSTUmIpwT61DIlntOVejh3iYxrYhoX7FUrViH4.FXShQ0rL6',
    adres: {
      ulica: 'Prosta',
      nr_domu: '13',
      nr_lokalu: '37',
      kod_pocztowy: '44-000',
      miejscowosc: 'Katowice'
    },
    telefon: '999111555',
    data_rejestracji: ISODate('2023-12-09T17:17:53.286Z')
  },
  {
    _id: ObjectId('6574a269078e1aeb283f4400'),
    typ_konta: 'klient',
    nazwa_uzytkownika: 'Celina',
    imie: 'Celina',
    nazwisko: 'Jackowska',
    haslo: '$2b$10$RcWMl/D0qx/IjAN14JJige1UbIKzCsd84CDiezNsIKVuXfERE814.',
    adres: {
      ulica: 'Krótka',
      nr_domu: '1',
      nr_lokalu: '4',
      kod_pocztowy: '42-321',
      miejscowosc: 'Gliwice'
    },
    telefon: '543765321',
    data_rejestracji: ISODate('2023-12-09T17:22:49.773Z')
  },
  {
    _id: ObjectId('6574a29f078e1aeb283f4401'),
    typ_konta: 'klient',
    nazwa_uzytkownika: 'Zbyszek',
    imie: 'Zbigniew',
    nazwisko: 'Polański',
    haslo: '$2b$10$4vnQFQ1dEeI0NPG.o59eAOy44RJL3cvckj.OUe2.W/bFJTKMTZwA6',
    adres: {
      ulica: 'Stroma',
      nr_domu: '4F',
      nr_lokalu: '21',
      kod_pocztowy: '45-001',
      miejscowosc: 'Warszawa'
    },
    telefon: '945832154',
    data_rejestracji: ISODate('2023-12-09T17:23:43.861Z')
  },
  {
    _id: ObjectId('6574a2d1078e1aeb283f4402'),
    typ_konta: 'klient',
    nazwa_uzytkownika: 'Ada',
    imie: 'Adelajda',
    nazwisko: 'Iksińska',
    haslo: '$2b$10$YpbYmYHq4w.qSC0FQzFcn.RWSzlSpJWAcB68msQ6X1mHOIS6m.Xre',
    adres: {
      ulica: 'Krzywa',
      nr_domu: '23',
      nr_lokalu: '2',
      kod_pocztowy: '49-005',
      miejscowosc: 'Piotrowice'
    },
    telefon: '654321854',
    data_rejestracji: ISODate('2023-12-09T17:24:33.909Z')
  },
  {
    _id: ObjectId('6574a312078e1aeb283f4403'),
    typ_konta: 'klient',
    nazwa_uzytkownika: 'LuckyLucek',
    imie: 'Lucjan',
    nazwisko: 'Łukasiewicz',
    haslo: '$2b$10$V7gQPiAS0LX2a.ejQIZnzewKcoPW6sZtQOETy563gbDS6rXMvIVrm',
    adres: {
      ulica: 'Ciemna',
      nr_domu: '43',
      nr_lokalu: '1',
      kod_pocztowy: '44-200',
      miejscowosc: 'Rybnik'
    },
    telefon: '432765543',
    data_rejestracji: ISODate('2023-12-09T17:25:38.820Z')
  }
])
db.wypozyczenia.insertMany([
  {
    _id: ObjectId('65749ea9581256630d8bb149'),
    dane_klienta: {
      _id: ObjectId('657451055b9178fc6b075fcc'),
      imie: 'Mateusz',
      nazwisko: 'Nosel',
      adres: {
        ulica: 'Emila Drobnego',
        nr_domu: '1B',
        nr_lokalu: '3',
        kod_pocztowy: '44-253',
        miejscowosc: 'Rybnik'
      },
      telefon: '519770068'
    },
    film: { _id: '65677283ce9ec974b9cd7492', tytul: 'Chłopi' },
    data_wypozyczenia: ISODate('2023-12-09T17:06:49.798Z'),
    data_planowanego_zwrotu: ISODate('2023-12-11T17:06:49.798Z'),
    data_faktycznego_zwrotu: ISODate('2023-12-09T17:06:51.564Z')
  },
  {
    _id: ObjectId('65749eac581256630d8bb14a'),
    dane_klienta: {
      _id: ObjectId('657451055b9178fc6b075fcc'),
      imie: 'Mateusz',
      nazwisko: 'Nosel',
      adres: {
        ulica: 'Emila Drobnego',
        nr_domu: '1B',
        nr_lokalu: '3',
        kod_pocztowy: '44-253',
        miejscowosc: 'Rybnik'
      },
      telefon: '519770068'
    },
    film: { _id: '65677283ce9ec974b9cd7492', tytul: 'Chłopi' },
    data_wypozyczenia: ISODate('2023-12-09T17:06:52.774Z'),
    data_planowanego_zwrotu: ISODate('2023-12-11T17:06:52.774Z'),
    data_faktycznego_zwrotu: ISODate('2023-12-09T17:06:53.971Z')
  },
  {
    _id: ObjectId('65749eaf581256630d8bb14b'),
    dane_klienta: {
      _id: ObjectId('657451055b9178fc6b075fcc'),
      imie: 'Mateusz',
      nazwisko: 'Nosel',
      adres: {
        ulica: 'Emila Drobnego',
        nr_domu: '1B',
        nr_lokalu: '3',
        kod_pocztowy: '44-253',
        miejscowosc: 'Rybnik'
      },
      telefon: '519770068'
    },
    film: { _id: '65677283ce9ec974b9cd7492', tytul: 'Chłopi' },
    data_wypozyczenia: ISODate('2023-12-09T17:06:55.429Z'),
    data_planowanego_zwrotu: ISODate('2023-12-11T17:06:55.429Z'),
    data_faktycznego_zwrotu: ISODate('2023-12-09T17:06:56.699Z')
  },
  {
    _id: ObjectId('65749eb2581256630d8bb14c'),
    dane_klienta: {
      _id: ObjectId('657451055b9178fc6b075fcc'),
      imie: 'Mateusz',
      nazwisko: 'Nosel',
      adres: {
        ulica: 'Emila Drobnego',
        nr_domu: '1B',
        nr_lokalu: '3',
        kod_pocztowy: '44-253',
        miejscowosc: 'Rybnik'
      },
      telefon: '519770068'
    },
    film: { _id: '65677283ce9ec974b9cd7492', tytul: 'Chłopi' },
    data_wypozyczenia: ISODate('2023-12-09T17:06:58.013Z'),
    data_planowanego_zwrotu: ISODate('2023-12-11T17:06:58.013Z'),
    data_faktycznego_zwrotu: ISODate('2023-12-09T17:06:59.347Z')
  },
  {
    _id: ObjectId('65749f8d581256630d8bb14d'),
    dane_klienta: {
      _id: ObjectId('657451055b9178fc6b075fcc'),
      imie: 'Mateusz',
      nazwisko: 'Nosel',
      adres: {
        ulica: 'Emila Drobnego',
        nr_domu: '1B',
        nr_lokalu: '3',
        kod_pocztowy: '44-253',
        miejscowosc: 'Rybnik'
      },
      telefon: '519770068'
    },
    film: { _id: '65677283ce9ec974b9cd7492', tytul: 'Chłopi' },
    data_wypozyczenia: ISODate('2023-12-09T17:10:37.211Z'),
    data_planowanego_zwrotu: ISODate('2023-12-11T17:10:37.211Z'),
    data_faktycznego_zwrotu: ISODate('2023-12-09T17:13:22.968Z')
  },
  {
    _id: ObjectId('65749f9c581256630d8bb14e'),
    dane_klienta: {
      _id: ObjectId('657451055b9178fc6b075fcc'),
      imie: 'Mateusz',
      nazwisko: 'Nosel',
      adres: {
        ulica: 'Emila Drobnego',
        nr_domu: '1B',
        nr_lokalu: '3',
        kod_pocztowy: '44-253',
        miejscowosc: 'Rybnik'
      },
      telefon: '519770068'
    },
    film: {
      _id: '65677283ce9ec974b9cd7493',
      tytul: 'Czas krwawego księżyca'
    },
    data_wypozyczenia: ISODate('2023-12-09T17:10:52.668Z'),
    data_planowanego_zwrotu: ISODate('2023-12-11T17:10:52.668Z'),
    data_faktycznego_zwrotu: ISODate('2023-12-09T17:11:04.459Z')
  },
  {
    _id: ObjectId('65749f9e581256630d8bb14f'),
    dane_klienta: {
      _id: ObjectId('657451055b9178fc6b075fcc'),
      imie: 'Mateusz',
      nazwisko: 'Nosel',
      adres: {
        ulica: 'Emila Drobnego',
        nr_domu: '1B',
        nr_lokalu: '3',
        kod_pocztowy: '44-253',
        miejscowosc: 'Rybnik'
      },
      telefon: '519770068'
    },
    film: { _id: '65677283ce9ec974b9cd7494', tytul: 'Skazani na Shawshank' },
    data_wypozyczenia: ISODate('2023-12-09T17:10:54.884Z'),
    data_planowanego_zwrotu: ISODate('2023-12-11T17:10:54.884Z'),
    data_faktycznego_zwrotu: ISODate('2023-12-09T17:13:21.392Z')
  },
  {
    _id: ObjectId('65749faa581256630d8bb150'),
    dane_klienta: {
      _id: ObjectId('657451055b9178fc6b075fcc'),
      imie: 'Mateusz',
      nazwisko: 'Nosel',
      adres: {
        ulica: 'Emila Drobnego',
        nr_domu: '1B',
        nr_lokalu: '3',
        kod_pocztowy: '44-253',
        miejscowosc: 'Rybnik'
      },
      telefon: '519770068'
    },
    film: { _id: '65677283ce9ec974b9cd7495', tytul: 'Dzień Świstaka' },
    data_wypozyczenia: ISODate('2023-12-09T17:11:06.251Z'),
    data_planowanego_zwrotu: ISODate('2023-12-11T17:11:06.251Z'),
    data_faktycznego_zwrotu: ISODate('2023-12-09T17:11:53.896Z')
  },
  {
    _id: ObjectId('65749fdb581256630d8bb152'),
    dane_klienta: {
      _id: ObjectId('657451055b9178fc6b075fcc'),
      imie: 'Mateusz',
      nazwisko: 'Nosel',
      adres: {
        ulica: 'Emila Drobnego',
        nr_domu: '1B',
        nr_lokalu: '3',
        kod_pocztowy: '44-253',
        miejscowosc: 'Rybnik'
      },
      telefon: '519770068'
    },
    film: { _id: '65749fd0581256630d8bb151', tytul: 'Film' },
    data_wypozyczenia: ISODate('2023-12-09T17:11:55.955Z'),
    data_planowanego_zwrotu: ISODate('2023-12-11T17:11:55.955Z'),
    data_faktycznego_zwrotu: ISODate('2023-12-09T17:12:04.425Z')
  },
  {
    _id: ObjectId('6574a613078e1aeb283f4405'),
    dane_klienta: {
      _id: ObjectId('6574a608078e1aeb283f4404'),
      imie: 'Maria',
      nazwisko: 'Turek',
      adres: {
        ulica: 'Wyzwolenia',
        nr_domu: '15',
        nr_lokalu: '3',
        kod_pocztowy: '49-304',
        miejscowosc: 'Warszawa'
      },
      telefon: '548321543'
    },
    film: { _id: '65677283ce9ec974b9cd7494', tytul: 'Skazani na Shawshank' },
    data_wypozyczenia: ISODate('2023-12-09T17:38:27.656Z'),
    data_planowanego_zwrotu: ISODate('2023-12-11T17:38:27.656Z'),
    data_faktycznego_zwrotu: ISODate('2023-12-09T17:38:58.213Z')
  },
  {
    _id: ObjectId('6574a615078e1aeb283f4406'),
    dane_klienta: {
      _id: ObjectId('6574a608078e1aeb283f4404'),
      imie: 'Maria',
      nazwisko: 'Turek',
      adres: {
        ulica: 'Wyzwolenia',
        nr_domu: '15',
        nr_lokalu: '3',
        kod_pocztowy: '49-304',
        miejscowosc: 'Warszawa'
      },
      telefon: '548321543'
    },
    film: { _id: '65677283ce9ec974b9cd7497', tytul: 'Roundhay Garden Scene' },
    data_wypozyczenia: ISODate('2023-12-09T17:38:29.143Z'),
    data_planowanego_zwrotu: ISODate('2023-12-11T17:38:29.143Z'),
    data_faktycznego_zwrotu: ISODate('2023-12-09T17:38:59.406Z')
  },
  {
    _id: ObjectId('6574a616078e1aeb283f4407'),
    dane_klienta: {
      _id: ObjectId('6574a608078e1aeb283f4404'),
      imie: 'Maria',
      nazwisko: 'Turek',
      adres: {
        ulica: 'Wyzwolenia',
        nr_domu: '15',
        nr_lokalu: '3',
        kod_pocztowy: '49-304',
        miejscowosc: 'Warszawa'
      },
      telefon: '548321543'
    },
    film: { _id: '65677283ce9ec974b9cd7498', tytul: 'Ekvtime: Man of God' },
    data_wypozyczenia: ISODate('2023-12-09T17:38:30.142Z'),
    data_planowanego_zwrotu: ISODate('2023-12-11T17:38:30.142Z'),
    data_faktycznego_zwrotu: ISODate('2023-12-09T17:39:00.693Z')
  }
])