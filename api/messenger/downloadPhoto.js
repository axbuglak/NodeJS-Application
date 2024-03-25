({
  access: 'public',
  method: async ({ name }) => {
    const readable = node.fs.createReadStream(`resources/${name}`);
    const writable = context.client.createStream();
    readable.pipe(writable);
  },
});
