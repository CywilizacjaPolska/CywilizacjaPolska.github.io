const { GameDig } = require('gamedig');
const fs = require('fs');

async function checkServers() {
  const servers = {
    valheim: { type: 'valheim', host: '51.83.239.219', port: 28700 },
    conan: { type: 'conanexiles', host: '146.59.1.3', port: 20810 },
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