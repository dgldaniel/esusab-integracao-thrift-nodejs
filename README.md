<img src="https://atencaobasica.saude.rs.gov.br/upload/recortes/201907/26091445_13110_GD.png" alt="Logotipo do e-sus" />


# Exemplo Nodejs

Este exemplo é um projeto em Nodejs que demonstra como criar um arquivo .esus com fichas serializadas para importação no e-SUS AB.

## Passo 1

Faça o clone desse projeto

### Passo 2

Instale o [Nodejs](https://nodejs.org/en/)

### Passo 3

Instale o [Yarn](https://yarnpkg.com/getting-started/install)

### Passo 4

Abra o Terminal na pasta onde clonou o projeto e digite: 

```bash
yarn
```

### Passo 5

O exemplo no arquivo "serializeFicha.js" é sobre a Ficha de Procedimentos, para serializar, digite:

```bash
node serializeFicha.js
```

Veja o novo arquivo ".esus" salvo na pasta "esus"

### Passo 6

Para deserializar uma ficha qualquer na pasta "esus", digite o comando abaixo e veja no console do terminal

```bash
node deserializeFicha.js
```
