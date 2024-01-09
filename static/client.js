const transport = {};

let callId = 1;

transport.ws = (url) => (structure) => {
  const socket = new WebSocket(url);
  const api = {};
  const services = Object.keys(structure);
  for (const name of services) {
    api[name] = {};
    const service = structure[name];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[name][methodName] = (args) =>
        new Promise((resolve) => {
          const id = callId++;
          const method = name + '/' + methodName;
          const packet = { type: 'call', id, method, args };
          socket.send(JSON.stringify(packet));
          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            resolve(data);
          };
        });
    }
  }
  return new Promise((resolve) => {
    socket.addEventListener('open', () => resolve(api));
  });
};

transport.http = (url, style) => (structure) => {
  const api = {};
  const services = Object.keys(structure);
  for (const name of services) {
    api[name] = {};
    const service = structure[name];
    for (const [methodName, methodValue] of Object.entries(service)) {
      api[name][methodName] = (args) =>
        new Promise((resolve, reject) => {
          const method = name + '/' + methodName;
          let packet;
          let fetchUrl;
          let fetchMethod;
          if (style === 'rpc') {
            const id = callId++;
            packet = { type: 'call', id, method, args };
            fetchUrl = url + '/api';
            fetchMethod = 'POST';
          } else if (style === 'rest') {
            packet = args;
            const id = args.id || '';
            fetchUrl = url + '/api/' + method + id;
            fetchMethod = methodValue.toUpperCase();
          }
          fetch(fetchUrl, {
            method: fetchMethod,
            headers: { 'Content-Type': 'application/json' },
            body: fetchMethod !== 'GET' ? JSON.stringify(packet) : null,
          }).then((res) => {
            if (res.status === 200) resolve(res.json());
            else reject(new Error(`Status Code: ${res.status}`));
          });
        });
    }
  }
  return Promise.resolve(api);
};

const scaffold = (url, style) => {
  const protocol = url.startsWith('ws:') ? 'ws' : 'http';
  return transport[protocol](url, style);
};

(async () => {
  const api = await scaffold(
    'http://localhost:8001',
    'rest',
  )({
    auth: {
      signin: 'post',
      signout: 'post',
      restore: 'post',
    },
    messenger: {
      get: 'get',
    },
  });
  const data = await api.auth.signin({ login: 'alex', password: 'marcus' });
  setTimeout(async () => {
    await api.messenger.get({});
  }, 1000);
  setTimeout(async () => {
    await api.messenger.get({});
  }, 2000);
  setTimeout(async () => {
    await api.messenger.get({});
  }, 3000);
  setTimeout(async () => {
    await api.messenger.get({});
  }, 5000);
  setTimeout(async () => {
    const result = await api.messenger.get({});
    console.log(result);
  }, 6000);
  console.dir({ data });
})();
