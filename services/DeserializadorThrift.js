const { TBinaryProtocol, TFramedTransport } = require("thrift");

const DeserializadorThrift = {
  deserializar(byteArray, ThriftClass) {
    const tTransport = new TFramedTransport(byteArray);
    const tProtocol = new TBinaryProtocol(tTransport);

    const obj = new ThriftClass();

    obj.read(tProtocol);

    console.log("obj", obj);

    return obj;
  },
};

module.exports = { DeserializadorThrift };
