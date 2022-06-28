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
  // Numero aleatório para garantir que o POW seja dificil o suficiente pra demorar
  nonce: number;

  constructor(index: number, timestamp: string, data: any, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  // concatena o index, timestamp, data e previousHash, e encripta em sha256
 calculateHash() {
    return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
 }

/*
POW - Proof of Work
- POW é usado para garantir que o bloco não sofra "DDOS"
- O objetvo do POW é encontrar um hash que comece com zeros
- O POW é um processo iterativo, ou seja, a dificuldade vai aumentando a medida que o processo é executado
*/
mineBlock(difficulty: number) {
  while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    this.nonce++;
    this.hash = this.calculateHash();
  }
  console.log(`Block mined: ${this.hash}`);
}


}





class Blockchain {
  chain: Block[];
  difficulty: number;
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 5;
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
    newBlock.mineBlock(this.difficulty);

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
console.log('Mining block 1...');
jott4Coin.addBlock(new Block(1, '10/07/2018', { amount: 4 }));
// Adiciona outro nova bloco à blockchain
console.log('Mining block 2...');
jott4Coin.addBlock(new Block(2, '11/07/2018', { amount: 10 }));

