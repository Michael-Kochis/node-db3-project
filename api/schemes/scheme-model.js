const db = require('../../data/db-config')

async function find() { // EXERCISE A
  /*
      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;
.
  */
  let returnThis = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id')
    .count('st.step_id', {as: 'number_of_steps'})
    .select('sc.*');
  let steps = await db('steps');
  
  return returnThis;
}

async function findById(scheme_id) { // EXERCISE B
  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

      {
        "scheme_id": 1,
        "scheme_name": "World Domination",
        "steps": [
          {
            "step_id": 2,
            "step_number": 1,
            "instructions": "solve prime number theory"
          },
          {
            "step_id": 1,
            "step_number": 2,
            "instructions": "crack cyber security"
          },
          // etc
        ]
      }

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */
  let returnScheme = await db('schemes')
      .where({ scheme_id });
  let steps = findSteps(scheme_id);
  if (!steps || typeof(steps !== "array" || steps.length <= 0)) {
    steps = [];
  }
  returnScheme.steps = steps;

  return returnScheme;
}

async function findSteps(scheme_id) { // EXERCISE C
  return await db('steps')
      .where( { scheme_id })
      .orderBy('step_number', 'asc');
}

async function add(scheme) { // EXERCISE D
  let id = await db('schemes')
    .insert(scheme);

  return findById(id);
}

async function addStep(scheme_id, step) { // EXERCISE E
  step.scheme_id = scheme_id;

  db('steps')
    .insert(step)
    .then(() => {
      return findSteps(scheme_id);
    }).catch((err) => {
      throw err;
    });

}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
