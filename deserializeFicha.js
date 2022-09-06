const { DadoTransporteThrift } = require("./models/dado_transporte_types");
const {
  FichaProcedimentoMasterThrift,
} = require("./models/ficha_procedimento/ficha_atendimento_procedimento_types");

const { DeserializadorThrift } = require("./services/DeserializadorThrift");

const fs = require("fs/promises");

const file = "./esus/b2691b20-63eb-479a-b46b-34f06b375449.esus";

async function main() {
  try {
    var thriftData = await fs.readFile(file);

    const dadoTransporteObj = DeserializadorThrift.deserializar(
      thriftData,
      DadoTransporteThrift
    );

    DeserializadorThrift.deserializar(
      dadoTransporteObj.dadoSerializado,
      FichaProcedimentoMasterThrift
    );
  } catch (err) {
    console.log(err);
  }
}

main();
