({
  access: 'public',
  type: 'post',
  method: async ({ name, size }) => {
    const readable = context.client.createStream(size);
    const writable = node.fs.createWriteStream(`./resources/${name}`);
    readable.pipe(writable);
  },
});
