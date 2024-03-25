const transport = {};

let callId = 1;

transport.ws = (url) => (structure) => {
  const socket = new WebSocket(url);
  const api = {};
  const services = Object.keys(structure);
  for (const name of services) {
    api[name] = {};
    const service = structure[name];
    for (const [methodName, methodType] of Object.entries(service)) {
      api[name][methodName] = (args) =>
        new Promise((resolve) => {
          const id = callId++;
          const method = name + '/' + methodName;
          const packet = { type: methodType, id, method, args };
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
            headers: {
              'Content-Type': 'application/json',
              credentials: 'include',
            },
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
    'ws://localhost:8001',
    'rpc',
  )({
    auth: {
      signin: 'call',
      signout: 'post',
      restore: 'post',
    },
    messenger: {
      get: 'call',
      uploadPhoto: 'stream',
      downloadPhoto: 'stream',
    },
  });
  // const data = await api.auth.signin({ login: 'alex', password: 'marcus' });
  const formInput = document.getElementById('fileInput');
  formInput.onchange = async () => {
    const files = Array.from(formInput.files);
    for (const file of files) {
      const streamId = await api.messenger
        .uploadPhoto({
          name: file.name,
          size: file.size,
        })
        .then((res) => res.streamId);
      const reader = file.stream().getReader();
      let chunk;
      while (!(chunk = await reader.read()).done) {
        console.log(chunk.value);
        await api.messenger.uploadPhoto({
          streamId,
          chunk: Array.from(chunk.value),
          name: file.name,
          size: chunk.size,
        });
      }
    }
  };

  await api.messenger.downloadPhoto({ name: 'dragon.png' });
})();
