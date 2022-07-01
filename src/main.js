console.time();
const {Blockchain, Transacao} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const minhaChave = ec.keyFromPrivate('c3f75451086ad150153dcb6eeb1fa9e7eaadd46d3d2abb7562b93251a62d7068')
const meuEndereco = minhaChave.getPublic('hex');


let jott4Coin = new Blockchain();

const tx1 = new Transacao(meuEndereco, 'chave publica vem aqui', 10);
tx1.assinaTransacao(minhaChave);
jott4Coin.adicionaTransacao(tx1);

console.log('\n Comecando a minerar...');
jott4Coin.mineraTransacoesPendentes(meuEndereco);

jott4Coin.rede[1].transacoes[0].valor = 1;

console.log('\nSaldo do jott4 é:', jott4Coin.getSaldo(meuEndereco));


console.log('A chain é válida?', jott4Coin.verificaValidadeDaChain());

console.timeEnd()