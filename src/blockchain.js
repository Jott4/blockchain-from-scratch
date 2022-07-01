const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transacao{
    constructor(enderecoDe, enderecoPara, valor){
        this.enderecoDe = enderecoDe;
        this.enderecoPara = enderecoPara;
        this.valor = valor;
    }

    calculaHash() {
        return SHA256(this.enderecoDe + this.enderecoPara + this.valor).toString();
    }

    assinaTransacao(chave) {
      if(chave.getPublic('hex') !== this.enderecoDe) {
        throw new Error('A chave não é válida para assinar a transação.');
      }
      
      const hasTx = this.calculaHash();
      const assinatura = chave.sign(hasTx, 'base64');
      this.assinatura = assinatura;

    }

    ehValida() {
       if(this.enderecoDe === null) return true;

       if(!this.assinatura || this.assinatura.length === 0) {
         throw new Error('A transação não possui assinatura.');
       }

       const publicKey = ec.keyFromPublic(this.enderecoDe, 'hex');
       return publicKey.verify(this.calculaHash(), this.assinatura);

    }

}

class Bloco {
    constructor(timestamp, transacoes, hashAnterior = '') {
        this.hashAnterior = hashAnterior;
        this.timestamp = timestamp;
        this.transacoes = transacoes;
        this.nonce = 0;
        this.hash = this.calculaHash();
        
    }

    calculaHash() {
        return SHA256(this.hashAnterior + this.timestamp + JSON.stringify(this.transacoes) + this.nonce).toString();
    }

    mineraBloco(dificuldade) {
        while (this.hash.substring(0, dificuldade) !== Array(dificuldade + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculaHash();
        }

        console.log("BLOCO MINERADO: " + this.hash);
    }

    temTransacoesValidas() {
        for (const tx of this.transacoes) {
            if (!tx.ehValida()) {
                return false;
            }
        }
        return true;
    }
}


class Blockchain{
    constructor() {
        this.rede = [this.criaBlocoInicial()];
        this.dificuldade = 1;
        this.transacoesPendentes = [];
        this.recompensaDeMineracao = 100;
    }

    criaBlocoInicial() {
        return new Bloco(Date.parse("2017-01-01"), [], "0");
    }

    getUltimoBloco() {
        return this.rede[this.rede.length - 1];
    }

    mineraTransacoesPendentes(enderecoRecompensado){
        const transacaoRecompensa = new Transacao(null, enderecoRecompensado, this.recompensaDeMineracao);
        this.transacoesPendentes.push(transacaoRecompensa);
        
        let bloco = new Bloco(Date.now(), this.transacoesPendentes, this.getUltimoBloco().hash);
        bloco.mineraBloco(this.dificuldade);

        console.log('Bloco minerado!');
        this.rede.push(bloco);

        this.transacoesPendentes = [];
    }

    adicionaTransacao(transacao){

        if(!transacao.enderecoDe || !transacao.enderecoPara){
            throw new Error('Transação inválida');
        }

        if(!transacao.ehValida()) {
            throw new Error('Transação inválida');
        }

        this.transacoesPendentes.push(transacao);
    }

    getSaldo(endereco){
        let saldo = 0;

        for(const bloco of this.rede){
            for(const transacao of bloco.transacoes){
                if(transacao.enderecoDe === endereco){
                    saldo -= transacao.valor;
                }

                if(transacao.enderecoPara === endereco){
                    saldo += transacao.valor;
                }
            }
        }

        return saldo;
    }

    verificaValidadeDaChain() {
        for (let i = 1; i < this.rede.length; i++){
            const blocoAtual = this.rede[i];
            const blocoAnterior = this.rede[i - 1];

            if(!blocoAtual.temTransacoesValidas()){
                return false
            }

            if (blocoAtual.hash !== blocoAtual.calculaHash()) {
                return false;
            }

            if (blocoAtual.hashAnterior !== blocoAnterior.calculaHash()) {
                return false;
            }
        }

        return true;
    }

}

module.exports.Blockchain = Blockchain
module.exports.Transacao = Transacao
