const { createGunzip } = require('zlib');
const { createOptimizationStream } = require('../../services/optimization');
const { getFilesInfo } = require('../../services/files');
const { deleteProduct, getProduct } = require('../../db');

const { transformCsvToJson, promisifiedPipeline } = require('../../services/utils');

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

    const csvToJson = transformCsvToJson();
    const optimization = createOptimizationStream();

    await promisifiedPipeline(inputStream, gunzip, csvToJson, optimization);
  } catch (err) {
    console.error(err.message);
    throw new Error('CSV pipeline failed');
  }
}

async function uploadCSVFile(request, response) {
  if (request.headers['content-type'] !== 'application/gzip') throw new Error('Wrong file!');
  try {
    await uploadCSV(request, response);
    response.status(202).end();
  } catch (err) {
    console.log('Failed to load CSV', err);
    throw new Error('Failed to load CSV');
  }
}

async function deleteProductFromDB(request, response) {
  try {
    const { id } = request.params;
    if (!id) throw new Error('Id required!');
    await deleteProduct(id);
    response.status(202).end();
  } catch (error) {
    console.log('ERROR: can`t delete product');
    throw error;
  }
}

async function getProductFromDB(request, response) {
  try {
    const { id } = request.params;
    if (!id) throw new Error('Id required!');
    const res = await getProduct(id);
    response.send(res);
  } catch (error) {
    console.log('ERROR: can`t delete product');
    throw error;
  }
}

module.exports = { uploadCSVFile, getFiles, deleteProductFromDB, getProductFromDB };
