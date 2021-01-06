exports.seed = function (knex) {
  return knex('colors')
    .del()
    .then(() => {
      return knex('colors').insert([
        { color: 'red' },
        { color: 'black' },
        { color: 'lime' },
        { color: 'navy' },
        { color: 'purple' },
      ]);
    });
};
