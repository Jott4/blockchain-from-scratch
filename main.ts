const sha256 = require('js-sha256');


class Block {
  // indicie do bloco
  index: number;
  // Timestamp em que o bloco foi criado
  timestamp: string;
  // dados do bloco
  data: any;
  // hash do bloco
  hash: string;
  // hash do bloco anterior
  previousHash: string;

  constructor(index: number, timestamp: string, data: any, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();

  }

 calculateHash() {
  // concatena o index, timestamp, data e previousHash, e encripta em sha256
    return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
 }

}


class Blockchain {
  chain: Block[] = [this.createGenesisBlock()];

  constructor() {

  }

  createGenesisBlock() {
    // Como o bloco genesis não tem um bloco anterior, o previousHash é "vazio"
    return new Block(0, '01/01/2018', 'Genesis Block', '0');
  }

  // retorna o último bloco da chain
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // adiciona um bloco à chain
  addBlock(newBlock: Block) {
    // Pega o último bloco da chain
    newBlock.previousHash = this.getLatestBlock().hash;
    // Calcula o hash do bloco
    newBlock.hash = newBlock.calculateHash();
    // Adiciona o bloco à chain
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

}
// Cria uma nova blockchain
let jott4Coin = new Blockchain();
// Adiciona uma nova transação à blockchain
jott4Coin.addBlock(new Block(1, '10/07/2018', { amount: 4 }));
// Adiciona outro nova bloco à blockchain
jott4Coin.addBlock(new Block(2, '11/07/2018', { amount: 10 }));

console.log(JSON.stringify(jott4Coin, null, 4));
// Tenta alterar um bloco da blockchain
jott4Coin.chain[1].data = { amount: 100 };
jott4Coin.chain[1].hash = jott4Coin.chain[1].calculateHash();

console.log('Is blockchain valid? ' + jott4Coin.isChainValid());
