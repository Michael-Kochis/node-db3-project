const schemes = require('./scheme-model')
/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = (req, res, next) => {
    const { id } = req.params;

    schemes.findById(id)
      .then((resp) => {
        req.scheme = resp;
        if (resp === undefined || resp === null || resp === []) {
          res.status(404).json({ 
            message: `scheme with scheme_id ${id} not found` 
          })
        } else {
          next();
        }
      })
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const scheme = req.body;
  const testThis = scheme.scheme_name;

  if (!testThis || typeof(testThis) !== "string" || testThis === "") {
    res.status(400).json(  {
      message: "invalid scheme_name"
    })
  } else {
    next();
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const step = req.body;
  const testThis = step.instructions;
  const failTest = false;

  if (NaN(step.step_number) || step.step_number < 1) {
    failTest = true;
  } else if (!testThis || typeof(testThis) !== "string" || testThis === "") {
    failTest = true; 
  }
  
  if (failTest) { 
    res.status(400).json({ message: "invalid step" })
  } else {
    next();
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
