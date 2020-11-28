const fs = require('fs');
const { createGunzip } = require('zlib');
const uuid = require('uuid');
const { optimization } = require('../../services/optimization');

const { transformCsvToJson, promisifiedPipeline, getFilesInfo } = require('../../services/utils');

async function getFiles(response) {
  try {
    const files = await getFilesInfo('./upload');
    const optimizedFiles = await getFilesInfo('./upload/optimized');

    response.send({ optimized: optimizedFiles, upload: files });
  } catch (e) {
    throw new Error('Can`t get files');
  }
}

async function uploadCSV(inputStream) {
  try {
    const gunzip = createGunzip();

    const id = uuid.v4();
    const filepath = `./upload/${id}.json`;
    const outputStream = fs.createWriteStream(filepath);
    const csvToJson = transformCsvToJson();

    await promisifiedPipeline(inputStream, gunzip, csvToJson, outputStream);
  } catch (err) {
    throw new Error('CSV pipeline failed');
  }
}

async function optimizeFile(response, query) {
  const { filename } = query;
  const filepath = './upload';

  optimization(`${filepath}/${filename}`, (e, uniqueProduct) => {
    if (e) {
      console.log('ERROR: ', e.message);
      return;
    }
    const productsOptimized = Object.values(uniqueProduct);
    const writableStream = fs.createWriteStream(`./upload/optimized/${filename}`);
    writableStream.write(JSON.stringify(productsOptimized));
    const totalQuantity = productsOptimized.reduce((acc, red) => acc + red.quantity, 0);
    console.log('Total quantity equal ', totalQuantity);
  });
  response.status(202).end();
}

module.exports = { optimizeFile, uploadCSV, getFiles };
