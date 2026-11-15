const { GameDig } = require('gamedig');
const fs = require('fs');

async function checkServers() {
  const servers = {
    valheim: { type: 'valheim', host: '51.83.239.219', port: 28700 },
    conan: { type: 'conanexiles', host: '146.59.1.3', port: 20800 },
    enshrouded: { type: 'enshrouded', host: '51.83.239.219', port: 28710 }
  };

  const statusData = {};

  for (const [key, config] of Object.entries(servers)) {
    try {
      console.log(`Sprawdzanie serwera ${key} (${config.host}:${config.port})...`);
      const state = await GameDig.query({
        type: config.type,
        host: config.host,
        port: config.port,
        maxAttempts: 3,
        socketTimeout: 5000
      });
      
      console.log(`Sukces dla ${key}! Gracze: ${state.players.length}/${state.maxplayers}`);
      statusData[key] = {
        online: true,
        players: `${state.players.length}/${state.maxplayers}`
      };
    } catch (error) {
      console.log(`Błąd dla serwera ${key}:`, error.message);
      statusData[key] = {
        online: false,
        players: "0/0"
      };
    }
  }

  fs.writeFileSync('status.json', JSON.stringify(statusData, null, 2));
  console.log('Plik status.json został pomyślnie zaktualizowany!');
}

checkServers();
```[cite: 12]

---

### Jak odczytać wynik błędu na GitHubie?

1. Po zaktualizowaniu i zapisaniu pliku `update-status.js` na GitHubie, przejdź do zakładki **Actions**.
2. Kliknij w najnowsze zadanie **Aktualizacja statusu serwerów**.
3. Kliknij na job o nazwie **update-status**, a następnie rozwiń krok **Uruchomienie skryptu sprawdzającego serwery**.
4. Zobaczysz dokładne komunikaty z konsoli. Najczęstsze przyczyny błędów to:
   * **`UDP Watchdog Timeout` / `Connection timed out`**: Oznacza to, że GameDig wysłał zapytanie, ale serwer nie odpowiedział. Najczęściej winny jest **port** (w wielu hostingach port gry różni się od portu query / Steam A2S, albo wymaga podania portu o 1 lub kilka oczek wyższego/niższego) lub zapora sieciowa (firewall) hostingu blokująca zewnętrzne zapytania UDP.
   * **`Unknown game type`**: Oznacza, że biblioteka `gamedig` w użytej wersji nie rozpoznaje danego typu (np. `enshrouded` może wymagać innego identyfikatora w zależności od wersji paczki `gamedig`).

Sprawdź, jaki komunikat o błędzie pojawi się w logach GitHub Actions po tej zmianie – to wskaże nam, czy musimy skorygować porty, czy typy serwerów w skrypcie!