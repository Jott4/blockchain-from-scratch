const sha256 = require('js-sha256');

class Transaction {
  from: string | null;
  to: string;
  amount: number;

  constructor(from: string | null, to: string, amount: number) {
    this.amount = amount;
    this.from = from;
    this.to = to;
  }
}

// Um nó da blockchain
class Block {
  // Timestamp em que o bloco foi criado
  timestamp: string | number;
  // dados do bloco
  transactions: any;
  // hash do bloco
  hash: string;
  // hash do bloco anterior
  previousHash: string;
  // Numero aleatório para garantir que o POW seja dificil o suficiente pra demorar
  nonce: number;

  constructor( timestamp: string | number, transactions: any, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  // concatena o index, timestamp, data e previousHash, e encripta em sha256
 calculateHash() {
    return sha256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
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




// Um array de blocos
class Blockchain {
  chain: Block[];
  difficulty: number;
  pendingTransactions: Transaction[];
  miningReward: number
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    // Como o bloco genesis não tem um bloco anterior, o previousHash é "vazio"
    return new Block( '01/01/2018', 'Genesis Block', '0');
  }

  // retorna o último bloco da chain
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // adiciona um bloco à chain
  minePendingTransactions(miningRewardAddress: string) {
    const block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }


  createTransaction(transaction: Transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address: string) {
    let balance = 0;
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }

        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
  }
  return balance;
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

jott4Coin.createTransaction(new Transaction('address1', 'address2', 100));
jott4Coin.createTransaction(new Transaction('address1', 'address2', 100));

console.log('\n Starting the miner...');
jott4Coin.minePendingTransactions('joshua-address');

console.log('\nBalance of joshua is', jott4Coin.getBalanceOfAddress('joshua-address'));

console.log('\n Starting the miner again...');
jott4Coin.minePendingTransactions('joshua-address');

console.log('\nBalance of joshua is', jott4Coin.getBalanceOfAddress('joshua-address'));




