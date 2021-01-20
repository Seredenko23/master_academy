const axios = require('axios');
const { apiKey } = require('../config');

async function getCitiesIds(addresses) {
  const fromAddress = axios.post(
    'http://testapi.novaposhta.ua/v2.0/json/Address/searchSettlements/',
    {
      apiKey,
      modelName: 'Address',
      calledMethod: 'searchSettlements',
      methodProperties: {
        CityName: addresses.from,
        Limit: 1,
      },
    },
  );

  const toAddress = axios.post(
    'http://testapi.novaposhta.ua/v2.0/json/Address/searchSettlements/',
    {
      apiKey,
      modelName: 'Address',
      calledMethod: 'searchSettlements',
      methodProperties: {
        CityName: addresses.to,
        Limit: 1,
      },
    },
  );

  const data = await Promise.all([fromAddress, toAddress]);

  const ids = data.map((city) => city.data.data[0].Addresses[0].Ref);

  return ids;
}

async function calculateDeliveryPrice(params) {
  const { data } = await axios({
    method: 'post',
    url: 'http://testapi.novaposhta.ua/v2.0/en/getDocumentPrice/json/',
    data: {
      apiKey,
      modelName: 'InternetDocument',
      calledMethod: 'getDocumentPrice',
      methodProperties: {
        CitySender: params.from,
        CityRecipient: params.to,
        Weight: params.totalWeight,
        ServiceType: 'DoorsDoors',
        Cost: params.totalPrice,
        CargoType: 'Cargo',
        SeatsAmount: '10',
      },
    },
  });

  return data.data[0].Cost;
}

module.exports = { getCitiesIds, calculateDeliveryPrice };
