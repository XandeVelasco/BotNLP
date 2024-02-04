const fs = require('fs');
const pdf2json = require('pdf2json');

// Caminho para o arquivo PDF
const caminhoDoArquivoPDF = 'doc_fake_criminal.pdf';
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['pt'], forceNER: true });
// Adds the utterances and intents for the NLP
manager.addDocument('pt', 'assassinato', 'greetings.criminal');
manager.addDocument('pt', 'homicidio', 'greetings.criminal');
manager.addDocument('pt', 'roubo', 'greetings.criminal');
manager.addDocument('pt', 'direito adquirido', 'greetings.trabalhista');
manager.addDocument('pt', 'hora extra', 'greetings.trabalhista');
manager.addDocument('pt', 'banco de horas', 'greetings.trabalhista');
manager.addDocument('pt', 'pegou fogo', 'greetings.ambientalista');
manager.addDocument('pt', 'está queimando', 'greetings.ambientalista');
manager.addDocument('pt', 'derrubaram uma arvore ilegalmente', 'greetings.ambientalista');

// Train also the NLG
manager.addAnswer('pt', 'greetings.criminal', 'furto seguido de roubo!');
manager.addAnswer('pt', 'greetings.criminal', 'homem foi assassinado no jardim primavera!');
manager.addAnswer('pt', 'greetings.trabalhista', 'não recebi meus diretos após a demissão!');
manager.addAnswer('pt', 'greetings.trabalhista', 'estou exausto e não consigo tirar uma folga com meu banco de horas!');
manager.addAnswer('pt', 'greetings.ambientalista', 'o desmatamento criminoso está derrubando boa parte da fauna local!');
manager.addAnswer('pt', 'greetings.ambientalista', 'uma fabrica de carvão ilegal é responsavel pela queimada local!');

// Função para ler o arquivo PDF e retornar uma Promise com o conteúdo
function lerArquivoPDF(caminhoDoArquivo) {
    return new Promise((resolve, reject) => {
      const dataBuffer = fs.readFileSync(caminhoDoArquivo);
  
      const pdfParser = new pdf2json();
      
      // Registre os eventos de análise
      pdfParser.on('pdfParser_dataError', reject);
      pdfParser.on('pdfParser_dataReady', () => {
        // Extraia o texto do PDF
        const texto = pdfParser.getRawTextContent();
        console.log(toString(texto));
        resolve(texto);
      });
  
      // Parseie o buffer do PDF
      pdfParser.parseBuffer(dataBuffer);
    });
  }


// Chame a função para ler o PDF e armazenar o conteúdo em uma string
lerArquivoPDF(caminhoDoArquivoPDF)
    .then(async (conteudoDoPDF) => {
        console.log(conteudoDoPDF);
        const response = await manager.process('pt', conteudoDoPDF);
        console.log(response);
        // Agora 'conteudoDoPDF' contém o texto do PDF como uma string
    })
    .catch((erro) => {
        console.error('Erro ao ler o arquivo PDF:', erro);
    });


// Train and save the model.
(async () => {
    await manager.train();
    manager.save();
})();