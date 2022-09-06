const {
  TBinaryProtocol,
  TBufferedTransport,
  TFramedTransport,
} = require("thrift");

const SerializadorThrift = {
  serializar(thriftObj) {
    const buffer = Buffer.from(JSON.stringify(thriftObj));

    let transport = new TFramedTransport(buffer);
    let protocol = new TBinaryProtocol(transport);

    thriftObj.write(protocol);

    // copy array of array into byteArray
    let source = transport.outBuffers;
    var byteArrayLen = 0;

    for (var i = 0, len = source.length; i < len; i++)
      byteArrayLen += source[i].length;

    let byteArray = Buffer.alloc(byteArrayLen);

    for (var i = 0, len = source.length, pos = 0; i < len; i++) {
      let chunk = source[i];
      chunk.copy(byteArray, pos);
      pos += chunk.length;
    }

    return byteArray;
  },
};

module.exports = { SerializadorThrift };
