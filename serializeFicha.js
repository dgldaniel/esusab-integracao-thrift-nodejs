const { uuid } = require("uuidv4");
const fs = require("fs");

const {
  FichaProcedimentoMasterThrift,
  FichaProcedimentoChildThrift,
} = require("./models/ficha_procedimento/ficha_atendimento_procedimento_types");

const {
  VersaoThrift,
  DadoInstalacaoThrift,
  DadoTransporteThrift,
} = require("./models/dado_transporte_types");

const { UnicaLotacaoHeaderThrift } = require("./models/common_types");

const { SerializadorThrift } = require("./services/SerializadorThrift");

const EXTENSAO_EXPORT = ".esus";
const TIPO_DADO_SERIALIZADO_FICHA_PROCEDIMENTO = 7;

function getDadoTransporte(ficha) {
  dadoTransporteThrift = new DadoTransporteThrift();

  dadoTransporteThrift.uuidDadoSerializado = ficha.uuidFicha;
  dadoTransporteThrift.cnesDadoSerializado = ficha.headerTransport.cnes;
  dadoTransporteThrift.codIbge = ficha.headerTransport.codigoIbgeMunicipio;
  dadoTransporteThrift.ineDadoSerializado = ficha.headerTransport.ine;

  originadora = new DadoInstalacaoThrift();

  originadora.contraChave = "123456";
  originadora.uuidInstalacao = "UUIDUNICO111";
  originadora.cpfOuCnpj = "11111111111";
  originadora.nomeOuRazaoSocial = "Nome ou Razao Social Originadora";
  originadora.fone = "999999999";
  originadora.email = "a@b.com";

  dadoTransporteThrift.originadora = originadora;

  remetente = new DadoInstalacaoThrift();

  remetente.contraChave = "789010";
  remetente.uuidInstalacao = "UUIDUNICO222";
  remetente.cpfOuCnpj = "11111111111";
  remetente.nomeOuRazaoSocial = "Nome ou Razao Social Remetente";
  remetente.fone = "98888888";
  remetente.email = "b@a.com";

  dadoTransporteThrift.remetente = originadora;

  dadoTransporteThrift.numLote = 01;

  return dadoTransporteThrift;
}

function getHeader() {
  headerThrift = new UnicaLotacaoHeaderThrift();

  headerThrift.profissionalCNS = "898001160660761";
  headerThrift.cboCodigo_2002 = "223212";
  headerThrift.cnes = "7381123";
  headerThrift.ine = "0000406465";
  headerThrift.dataAtendimento = Date.now();
  headerThrift.codigoIbgeMunicipio = "4205407";

  return headerThrift;
}

function getProcedimentosSia() {
  siaList = [];

  siaList.push("ABEX010"); // MAMOGRAFIA BILATERAL;
  siaList.push("ABEX007"); // HDL;
  siaList.push("ABEX009"); // LDL;

  return siaList;
}

function getProcedimentos() {
  procedimentosList = [];

  procedimentosList.push("ABPG019"); // SUTURA SIMPLES;
  procedimentosList.push("ABEX004"); // ELETROCARDIOGRAMA;

  return procedimentosList;
}

function getAtendimentos() {
  listaProcedimentosAtendimento = [];

  for (numeroAtendimentos = 0; numeroAtendimentos < 2; numeroAtendimentos++) {
    atendimentoProcedimentoThrift = new FichaProcedimentoChildThrift();

    atendimentoProcedimentoThrift.numProntuario = "43143";
    atendimentoProcedimentoThrift.dtNascimento = Date.now();
    atendimentoProcedimentoThrift.sexo = 1;
    atendimentoProcedimentoThrift.localAtendimento = 1;
    atendimentoProcedimentoThrift.turno = 1;
    atendimentoProcedimentoThrift.procedimentos = getProcedimentosSia();
    atendimentoProcedimentoThrift.procedimentos = getProcedimentos();
    atendimentoProcedimentoThrift.cpfCidadao = "80487483391";

    listaProcedimentosAtendimento.push(atendimentoProcedimentoThrift);
  }

  return listaProcedimentosAtendimento;
}

function getFicha() {
  thriftProcedimentos = new FichaProcedimentoMasterThrift();

  thriftProcedimentos.uuidFicha = uuid();
  thriftProcedimentos.tpCdsOrigem = 3;
  thriftProcedimentos.headerTransport = getHeader();
  thriftProcedimentos.atendProcedimentos = getAtendimentos();
  thriftProcedimentos.numTotalAfericaoPa = 1;
  thriftProcedimentos.numTotalGlicemiaCapilar = 1;
  thriftProcedimentos.numTotalAfericaoTemperatura = 1;
  thriftProcedimentos.numTotalMedicaoAltura = 1;
  thriftProcedimentos.numTotalCurativoSimples = 1;
  thriftProcedimentos.numTotalMedicaoPeso = 1;
  thriftProcedimentos.numTotalColetaMaterialParaExameLaboratorial = null;

  return thriftProcedimentos;
}

function main() {
  // Passo 1: Popular a ficha
  thriftFichaProcedimento = getFicha();

  // Passo 2: Popular o DadoTransporte usando os dados da ficha e do software que está enviando.
  dadoTransporteThrift = getDadoTransporte(thriftFichaProcedimento);

  // Passo 3: Serializar a ficha utilizando o TBinaryProtocol da biblioteca thrift.
  fichaSerializada = SerializadorThrift.serializar(thriftFichaProcedimento);

  // Passo 4: Adicionar a ficha serializada e seu tipo no DadoTransporte.
  dadoTransporteThrift.tipoDadoSerializado =
    TIPO_DADO_SERIALIZADO_FICHA_PROCEDIMENTO;

  dadoTransporteThrift.dadoSerializado = fichaSerializada;

  // Não esquecer de informar a versão da ficha a ser exportada (não é a versão do e-SUS AB)
  versaoThrift = new VersaoThrift();

  versaoThrift.major = 3;
  versaoThrift.minor = 2;
  versaoThrift.revision = 3;

  dadoTransporteThrift.versao = versaoThrift;

  dadoTransporteSerializado =
    SerializadorThrift.serializar(dadoTransporteThrift);

  fs.writeFile(
    `esus/${dadoTransporteThrift.uuidDadoSerializado}${EXTENSAO_EXPORT}`,
    dadoTransporteSerializado,
    (err) => {
      console.error(err);
    }
  );
}

main();
