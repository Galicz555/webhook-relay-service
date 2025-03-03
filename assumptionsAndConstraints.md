# Feltételezések és Korlátok

    - Feltételezem, hogy a beérkező webhook adat nem túl komplex és JSON formátumú.
    - A belső szolgáltatások hibaszázaléka fix 30%, késleltetés is fix 30% valószínűséggel.
    - A 6 órás időkeret miatt nem valószínű, hogy komoly adatbázist vagy queue rendszert (pl. Redis, RabbitMQ) integrálok, de a gyakorlatban az üzenetsor (message queue) a robusztus megoldás.
    - Skálázhatóság: Ha 1000 req/s fölé is mehetnénk, a horizontal scaling (k8s, load balancer, stb.) kerülhet szóba, de a feladat jelenlegi kontextusában elég egyszerűbb megoldás.
    - Webhhokok terhelésmintázata sok tényezőtől függhet de általánosságban a folyamatos, egyenletes terhelés a jellemző. Az API-hoz LOAD tesztet implementálok, és ha van idő akkor SPIKE(Webhook-oknál gyakran előfordul, hogy a küldő szolgáltatás retry mechanizmust használ: ha nem kap sikeres választ, újra és újra próbálkozik. Egy hirtelen hálózati gond vagy 500-as hiba után akár nagy számú újrapróbálkozás is érkezhet egyszerre.), SOAK és végül STRESS tesztelés 2x-3x fokozaton
    - Feltételezem továbbá hogy nem különösebb védelmet kialakítanom (DOS, injections)
    - Feltételezem hogy a beérkező adat rendben van és nem kell a tartalmával foglalkoznom, de ha az időbe belefér implementálok beérkező adat ellenőrzést

# Lehetséges Kihívások

    - Hálózati instabilitás: A mock szolgáltatások szándékosan bizonytalan válaszokat adnak. A webhook service-nek ezt kezelnie kell, hogy ne akadjon ki teljesen (pl. retry logika).
    - Magas terhelés: 1000 req/s nem elhanyagolható. Gondoskodni kell, hogy az alkalmazás aszinkron módon dolgozza fel a kéréseket, és ne blokkoljon.
    - Időzítés és késleltetés: A 30 mp-es random delay is fennakadásokat okozhat. A Node.js event loop blokkolódása elkerülendő (lehetőleg ne sleep-et használjunk szinkron módon, hanem aszinkron timeoutot).
