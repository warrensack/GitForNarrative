/*
 * llpl
 * 
 * A Limited Logic Programming Language
 *
 * Warren Sack <wsack@ucsc.edu>
 * July 2025
 *
 * This is a logic programming interpreter.  
 * 
 * Sample usage in a webpage:
 *    <script type="text/javascript" src="../Utilities/utilities.js"></script>
 *    <script type="text/javascript" src="llpl.js"></script>
 *    <script type="text/javascript" src="sicpDB.js"></script>
 *    <script type="text/javascript">
 *        const utils = makeUtilities();
 *        const llpl = makeInterpreter(utils);
 *        llpl.initializeDatabase(sicpDB);
 *
 * Sample usage (for node.js where present directory contains the Logic 
 * and Utilities subdirectories):
 * 
 *    const makeUtilities = require('./Utilities/utilities.js');
 *    const sicpDB = require('./Logic/sicpDB.js');
 *    const makeInterpreter = require('./Logic/llpl.js');
 *    const utils = makeUtilities();
 *    const llpl = makeInterpreter(utils);
 *    llpl.initializeDatabase(sicpDB);
 *
 * This example assumes that sicpDB is a global variable in which an 
 * array of rules and assertions have been defined. 
 * This also assumes that the file utilities.js has been loaded into
 * the browser or node.js.  It contains a set of necessary utility functions.
 *
 * Here is an example query that can be run either from the node.js console or 
 * from the browser console once the code for the utilities and the interpreter 
 * have been loaded and the database has been initialized with the contents of sicpDB.js:
 *
 * llpl.query({"lives-near": {"person1": "?x", "person2": "?y"}});
 *
 */

function makeInterpreter(utils) {


  ////
  //// Syntax
  ////


  //
  // isDRule(obj): boolean
  //
  function isDRule(obj) {
    return (utils.isAssertionOfType(obj, '<--'));
  }

  //
  // druleConclusion(obj): object
  //
  function druleConclusion(obj) {
    let definition = utils.values(obj)[0];
    let newObj = {};
    for (let key in definition) {
      if ((key !== 'or') && (key !== 'and') && (key !== 'not')) {
        newObj[key] = definition[key];
      }
    }
    return (newObj);
  }

  //
  // druleBody(obj): object
  //
  function druleBody(obj) {
    let definition = utils.values(obj)[0];
    let newObj = {};
    for (key in definition) {
      if ((key === 'or') || (key === 'and') || (key === 'not')) {
        newObj[key] = definition[key];
      }
    }
    return (newObj);
  }

  //
  // isPRule(obj): boolean
  //
  function isPRule(obj) {
    return (utils.isAssertionOfType(obj, '-->'));
  }

  //
  // pruleAntecendent(obj): object
  //
  function pruleAntecedent(obj) {
    let definition = utils.values(obj)[0];
    let newObj = {};
    for (let key in definition) {
      if (key !== 'consequents') {
        newObj[key] = definition[key];
      }
    }
    return (newObj);
  }

  //
  // pruleConsequents(obj): object
  //
  function pruleConsequents(obj) {
    return (obj["-->"]["consequents"]);
  }

  //
  // isEval(obj): boolean
  //
  function isEval(obj) {
    return (utils.isAssertionOfType(obj, 'eval'));
  }

  //
  // isStringQuery(obj): boolean
  //
  function isStringQuery(obj) {
    return (utils.isClauseTypeWithArgsList(obj, 'string'));
  }

  //
  // isVarQuery(obj): boolean
  //
  function isVarQuery(obj) {
    return (utils.isClauseTypeWithArgsList(obj, 'var'));
  }

  //
  // isArgQuery(obj): boolean
  //
  function isArgQuery(obj) {
    return (utils.isClauseTypeWithArgsList(obj, 'arg'));
  }

  //
  // isFunctorQuery(obj): boolean
  //
  function isFunctorQuery(obj) {
    return (utils.isClauseTypeWithArgsList(obj, 'functor'));
  }

  //
  // isUnivQuery(obj): boolean
  //
  function isUnivQuery(obj) {
    return (utils.isClauseTypeWithArgsList(obj, 'univ'));
  }

  //
  // isCall(obj): boolean
  //
  function isCall(obj) {
    return (utils.isClauseTypeWithArgsList(obj, 'call'));
  }

  //
  // isMap(obj): boolean
  //
  function isMap(obj) {
    return (utils.isClauseTypeWithArgsList(obj, 'map'));
  }

  //
  // isPrint(obj): boolean
  //
  function isPrint(obj) {
    return (utils.isClauseTypeWithArgsList(obj, 'print'));
  }

  //
  // isBreak(obj): boolean
  //
  function isBreak(obj) {
    return (utils.isClauseTypeWithArgsList(obj, 'break'));
  }

  //
  // isList(obj): boolean
  //
  function isList(obj) {
    return (utils.isClauseTypeWithArgsList(obj, 'list'));
  }

  //
  // macroExpand(e): typeOf(e)
  // 
  // Only one macro has been implemented: syntax for lists in JSON:
  //
  // {"list": ["1","2"]} 
  // ==> {"cons": {"first": "1", 
  //               "rest": {"cons": {"first": "2", 
  //                                 "rest": "nil"}}}}
  //
  function macroExpand(e) {
    let typeOfE = utils.typeOf(e);
    if ((e === null)
      || (e === undefined)
      || (typeOfE === 'boolean')
      || (typeOfE === 'number')
      || (typeOfE === 'string')) {
      return (e);
    }
    if (typeOfE === 'array') {
      return (macroExpandArray(e));
    }
    if (typeOfE === 'object') {
      if (utils.isClauseTypeWithArgsList(e, 'list')) {
        return (macroExpandListObject(e));
      }
      else { return (macroExpandObject(e)); }
    }
    else { utils.ppToConsole("macroExpand: Unknown element: " + e); }
  }

  //
  // macroExpandObject(obj): object
  //
  function macroExpandObject(obj) {
    let newObj = {};
    for (let key in obj) {
      newObj[key] = macroExpand(obj[key]);
    }
    return (newObj);
  }

  //
  // macroExpandArray(a): array
  //
  function macroExpandArray(a) {
    let newArray = [];
    for (let i = 0; i < a.length; i++) {
      newArray.push(macroExpand(a[i]));
    }
    return (newArray);
  }

  //
  // macroExpandListObject(obj): object
  //
  function macroExpandListObject(obj) {
    return (macroExpandListElements(obj["list"]));
  }

  // 
  // macroExpandListElements(a): object
  //
  function macroExpandListElements(a) {
    if (a.length == 0) { return ("nil"); }
    let typeOfA0 = utils.typeOf(a[0]);
    if ((a[0] === null)
      || (a[0] === undefined)
      || (typeOfA0 === 'boolean')
      || (typeOfA0 === 'number')
      || (typeOfA0 === 'string')) {
      return ({
        "cons": {
          "first": a.shift(),
          "rest": macroExpandListElements(a)
        }
      });
    }
    if (typeOfA0 === 'array') {
      return ({
        "cons": {
          "first": macroExpandArray(a.shift()),
          "rest": macroExpandListElements(a)
        }
      });
    }
    if (typeOfA0 === 'object') {
      if (utils.isClauseTypeWithArgsList(a[0], 'list')) {
        return ({
          "cons": {
            "first": macroExpandListObject(a.shift()),
            "rest": macroExpandListElements(a)
          }
        });
      }
      else {
        return ({
          "cons": {
            "first": macroExpandObject(a.shift()),
            "rest": macroExpandListElements(a)
          }
        });
      }
    }
    else { utils.ppToConsole("macroExpandListElements: Unknown element: " + a[0]); }
  }


  ////
  ////
  //// Database
  ////


  // This is a global variable that contains, after initializeDatabase
  // has been run, a indexed database of rules and assertions.
  let database = {};

  //
  // initializeDatabase(a): side effects the database of assertions and rules
  //
  // Given a array of rules and assertions, creates a new object of indexed
  // rules and assertions.
  //
  function initializeDatabase(rsAndAs) {
    let i;
    database["drules"] = {};
    database["prules"] = {};
    database["assertions"] = {};
    let assertionsList = [];
    let isLoaded = false;
    for (i = 0; i < rsAndAs.length; i++) {
      isLoaded = false;
      rsAndAs[i] = macroExpand(rsAndAs[i]);
      if (isDRule(rsAndAs[i]) && !isLoaded) {
        indexDRule(rsAndAs[i]);
        isLoaded = true;
      }
      if (isPRule(rsAndAs[i]) && !isLoaded) {
        indexPRule(rsAndAs[i]);
        isLoaded = true;
      }
      if (utils.isAssertion(rsAndAs[i]) && !isLoaded) {
        assertionsList.push(rsAndAs[i]);
        isLoaded = true;
      }
      if (!isLoaded) {
        utils.ppToConsole("Unrecognized form in database: " + rsAndAs[i]);
      }
    }
    for (i = 0; i < assertionsList.length; i++) {
      indexAssertion(assertionsList[i]);
    }
    return (database);
  }

  //
  // indexAssertion(p): side effects database["assertions"]
  //
  function indexAssertion(p) {
    // Some assertions have variables in them. Rename them
    // before indexing to insure no accidental variable name 
    // clashes occur in executing code.
    p = utils.renameVariables(p);
    let bindingsArray = findAssertions(p, {});
    // If nothing like this already exists in the database, 
    // then add it to the database and run the prules.
    if (utils.isEmpty(bindingsArray)) {
      let pred = utils.predicateName(p);
      if (database["assertions"][pred] !== undefined) {
        database["assertions"][pred].push(p);
      }
      else { database["assertions"][pred] = [p]; }
      applyPRules(p);
    }
  }

  //
  // retractAssertion(p): side effects database["assertions"]
  // 
  // Note that assertions containing variables will not be
  // retracted.  When an assertion is retracted, all consequents
  // of that assertion are also retracted by running reversePRules.
  //
  function retractAssertion(p) {
    let pred = utils.predicateName(p);
    if (database["assertions"][pred] !== undefined) {
      let numberOfAssertions = database["assertions"][pred].length;
      let result = [];
      for (let i = 0; i < database["assertions"][pred].length; i++) {
        if (!utils.equal(p, database["assertions"][pred][i])) {
          result.push(database["assertions"][pred][i]);
        }
      }
      database["assertions"][pred] = result;
      if (numberOfAssertions > result.length) {
        reversePRules(p);
      }
    }
  }

  //
  // fetchAssertions(queryPattern): array
  //
  function fetchAssertions(queryPattern) {
    let pred = utils.predicateName(queryPattern);
    if (database["assertions"][pred] !== undefined) { return (database["assertions"][pred]); }
    return ([]);
  }

  //
  // findAssertions(pattern,bindings): array
  //
  function findAssertions(pattern, bindings) {
    let a = fetchAssertions(pattern);
    let bindingsArray = [];
    let freshBindings;
    for (let i = 0; i < a.length; i++) {
      freshBindings = utils.copyIt(bindings);
      if (utils.unifyPatterns(a[i], pattern, freshBindings)) {
        bindingsArray.push(freshBindings);
      }
    }
    return (bindingsArray);
  }

  //
  // indexDRule(r): side effects database["drules"]
  //
  function indexDRule(r) {
    let pred = utils.predicateName(druleConclusion(r));
    if (database["drules"][pred] !== undefined) { database["drules"][pred].push(r); }
    else { database["drules"][pred] = [r]; }
  }

  //
  // fetchDRules(queryPattern): array
  //
  function fetchDRules(queryPattern) {
    let pred = utils.predicateName(queryPattern);
    if (database["drules"][pred] !== undefined) { return (database["drules"][pred]); }
    else { return ([]); }
  }

  //
  // indexPRule(r): side effects database["prules"]
  //
  function indexPRule(r) {
    let pred = utils.predicateName(pruleAntecedent(r));
    if (database["prules"][pred] !== undefined) { database["prules"][pred].push(r); }
    else { database["prules"][pred] = [r]; }
  }

  //
  // fetchPRules(queryPattern): array
  //
  function fetchPRules(queryPattern) {
    let pred = utils.predicateName(queryPattern);
    if (database["prules"][pred] !== undefined) { return (database["prules"][pred]); }
    else { return ([]); }
  }


  ////
  //// Evaluation
  ////


  //
  // applyPRule(prule,pattern): array
  //
  function applyPRule(prule, pattern) {
    let cleanPRule = utils.renameVariables(utils.copyIt(prule));
    let antecedent = pruleAntecedent(cleanPRule);
    let bindings = {};
    if (utils.unifyPatterns(pattern, antecedent, bindings)) {
      let consequents = utils.instantiate(utils.copyIt(pruleConsequents(cleanPRule)),
        bindings);
      for (let i = 0; i < consequents.length; i++) {
        indexAssertion(consequents[i]);
      }
    }
  }

  //
  // applyPRules(pattern): array
  //
  function applyPRules(pattern) {
    let prules = fetchPRules(pattern);
    for (let i = 0; i < prules.length; i++) {
      applyPRule(prules[i], pattern);
    }
  }

  //
  // reversePRule(prule,pattern): side effects database["assertions"]
  //
  function reversePRule(prule, pattern) {
    let cleanPRule = utils.renameVariables(utils.copyIt(prule));
    let antecedent = pruleAntecedent(cleanPRule);
    let bindings = {};
    if (utils.unifyPatterns(pattern, antecedent, bindings)) {
      let consequents = utils.instantiate(utils.copyIt(pruleConsequents(cleanPRule)),
        bindings);
      for (let i = 0; i < consequents.length; i++) {
        retractAssertion(consequents[i]);
      }
    }
  }

  //
  // reversePRules(pattern): side effects database["assertions"]
  //
  function reversePRules(pattern) {
    let prules = fetchPRules(pattern);
    for (let i = 0; i < prules.length; i++) {
      reversePRule(prules[i], pattern);
    }
  }

  //
  // applyDRule(drule,queryPattern,bindings): array
  //
  function applyDRule(drule, queryPattern, bindings) {
    let cleanDRule = utils.renameVariables(utils.copyIt(drule));
    let conclusion = druleConclusion(cleanDRule);
    if (utils.unifyPatterns(queryPattern, conclusion, bindings)) {
      return (qeval(druleBody(cleanDRule), [bindings]));
    }
    else { return ([]); }
  }

  //
  // applyDRules(pattern,bindings): array
  //
  function applyDRules(pattern, bindings) {
    let drules = fetchDRules(pattern);
    let bindingsArray = [];
    let freshBindings, nextBindingsArray;
    for (let i = 0; i < drules.length; i++) {
      freshBindings = utils.copyIt(bindings);
      nextBindingsArray = applyDRule(drules[i], pattern, freshBindings);
      for (let j = 0; j < nextBindingsArray.length; j++) {
        bindingsArray.push(nextBindingsArray[j]);
      }
    }
    return (bindingsArray);
  }

  //
  // simpleQuery(queryPattern,bindingsArray): array
  //
  function simpleQuery(queryPattern, bindingsArray) {
    if (utils.isEmpty(queryPattern)) { return (bindingsArray); }
    let combinedBindingsArray = [];
    let newBindingsArrayFromAssertions, newBindingsArrayFromDRules, i, j;
    for (i = 0; i < bindingsArray.length; i++) {
      newBindingsArrayFromAssertions = findAssertions(queryPattern, bindingsArray[i]);
      for (j = 0; j < newBindingsArrayFromAssertions.length; j++) {
        combinedBindingsArray.push(newBindingsArrayFromAssertions[j]);
      }
      newBindingsArrayFromDRules = applyDRules(queryPattern, bindingsArray[i]);
      for (j = 0; j < newBindingsArrayFromDRules.length; j++) {
        combinedBindingsArray.push(newBindingsArrayFromDRules[j]);
      }
    }
    return (combinedBindingsArray);
  }

  //
  // conjoin(conjunctsArray,bindingsArray): array
  //
  function conjoin(conjunctsArray, bindingsArray) {
    if (utils.isEmpty(conjunctsArray)) { return (bindingsArray); }
    let newBindingsArray = qeval(conjunctsArray[0], bindingsArray);
    conjunctsArray.shift();
    return (conjoin(conjunctsArray, newBindingsArray));
  }

  //
  // disjoin(disjunctsArray,bindingsArray): array
  //
  function disjoin(disjunctsArray, bindingsArray) {
    if (utils.isEmpty(disjunctsArray)) { return (bindingsArray); }
    let combinedBindingsArray = [];
    let newBindingsArray, freshBindingsArray;
    for (let i = 0; i < disjunctsArray.length; i++) {
      freshBindingsArray = utils.copyIt(bindingsArray);
      newBindingsArray = qeval(disjunctsArray[i], freshBindingsArray);
      for (let j = 0; j < newBindingsArray.length; j++) {
        combinedBindingsArray.push(newBindingsArray[j]);
      }
    }
    return (combinedBindingsArray);
  }

  //
  // negate(nQueryPattern,bindingsArray): array
  //
  function negate(nQueryPattern, bindingsArray) {
    let query = utils.negation(nQueryPattern);
    let resultantBindingsArray = [];
    let result;
    for (let i = 0; i < bindingsArray.length; i++) {
      result = qeval(query, [bindingsArray[i]]);
      if (utils.isEmpty(result)) {
        resultantBindingsArray.push(bindingsArray[i]);
      }
    }
    return (resultantBindingsArray);
  }

  //
  // eeval(toEvaluate,bindingsArray): bindings array
  //
  // Handle evaluation of assignment statements, boolean comparisons,
  // and arithmetic statements.  
  //
  function eeval(toEvaluate, bindingsArray) {
    expression = toEvaluate["eval"];
    let operator, iexpression, bindings;
    let legalOperators = utils.arrayToSet(["=", "==", "!=", ">", ">=", "<", "<=", "+", "-", "/", "*"]);
    let resultantBindingsArray = [];
    for (let op in expression) { operator = op; }
    if (!utils.elementOf(operator, legalOperators)) {
      utils.ppToConsole("Error: unrecognized operator in statement or expression: "
        + utils.pp(operator));
      return ([]);
    }
    for (let i = 0; i < bindingsArray.length; i++) {
      bindings = utils.copyIt(bindingsArray[i]);
      iexpression = utils.instantiate(utils.copyIt(expression), bindings);
      if (op == "=") {
        resultantBindingsArray.push(evalAssignment(iexpression, bindings));
      }
      else {
        if (evalExpression(iexpression, bindings) !== false) {
          resultantBindingsArray.push(bindings);
        }
      }
    }
    return (resultantBindingsArray);
  }

  // 
  // evalAssignment(expression,bindings): bindings
  //
  function evalAssignment(expression, bindings) {
    let argsList = expression["="];
    let lhs = argsList[0];
    let rhs = argsList[1];
    rhs = evalExpression(rhs, bindings);
    bindings[lhs] = rhs.toString();
    return (bindings);
  }

  //
  // evalExpression(expression,bindings): number or boolean value
  //
  function evalExpression(expression, bindings) {
    let iexpression = utils.instantiate(utils.copyIt(expression), bindings);
    if (utils.typeOf(iexpression) !== 'object') {
      if ((iexpression === true) || (iexpression === "true")) { return (true); }
      if ((iexpression === false) || (iexpression === "false")) { return (false); }
      if (!isNaN(iexpression)) { return (parseFloat(iexpression)); }
      else {
        utils.ppToConsole("Error: expression should be a number, true, or false: "
          + utils.pp(iexpression));
        return (iexpression);
      }
    }
    else {
      let operator, i;
      for (let op in iexpression) { operator = op; }
      let argValues = [];
      for (i = 0; i < iexpression[operator].length; i++) {
        argValues.push(evalExpression(iexpression[operator][i], bindings));
      }
      if (argValues.length != 2) {
        utils.ppToConsole("Error: only two arguments are allowed in expressions: "
          + utils.pp(iexpression));
      }
      return (eval(argValues[0] + " " + operator + " " + argValues[1]));
    }
  }

  //
  // printQuery(query,bindingsArray): output message to console
  //
  function printQuery(query, bindingsArray) {
    let q, list;
    for (let i = 0; i < bindingsArray.length; i++) {
      q = utils.instantiate(utils.copyIt(query), bindingsArray[i]);
      if ((q["print"][0] === 'list') && (q["print"][1] !== undefined)) {
        list = utils.assertionToList(q["print"][1]);
        utils.ppToConsole(list.join(" "));
      }
      else { utils.ppToConsole(q["print"]); }
    }
    return (bindingsArray);
  }

  //
  // stringQuery(query,bindingsArray): return true if
  // its first argument is bound to a string
  //
  function stringQuery(query, bindingsArray) {
    let q;
    let resultantBindingsArray = [];
    for (let i = 0; i < bindingsArray.length; i++) {
      q = utils.instantiate(utils.copyIt(query), bindingsArray[i]);
      if ((utils.typeOf(q["string"][0]) === 'string') && !utils.isVariable(q["string"][0])) {
        resultantBindingsArray.push(bindingsArray[i]);
      }
    }
    return (resultantBindingsArray);
  }


  //
  // varQuery(query,bindingsArray): return true if
  // its first argument is a unification variable
  //
  function varQuery(query, bindingsArray) {
    let q;
    let resultantBindingsArray = [];
    for (let i = 0; i < bindingsArray.length; i++) {
      q = utils.instantiate(utils.copyIt(query), bindingsArray[i]);
      if ((utils.typeOf(q["var"][0]) === 'string') && utils.isVariable(q["var"][0])) {
        resultantBindingsArray.push(bindingsArray[i]);
      }
    }
    return (resultantBindingsArray);
  }

  //
  // callQuery(query,bindingsArray): execute the query as a goal
  //
  function callQuery(query, bindingsArray) {
    let q, newBindingsArray;
    let freshBindingsArray = utils.copyIt(bindingsArray);
    let resultantBindingsArray = [];
    for (let i = 0; i < freshBindingsArray.length; i++) {
      q = utils.instantiate(utils.copyIt(query), freshBindingsArray[i]);
      newBindingsArray = qeval(q["call"][0], [freshBindingsArray[i]]);
      if (!utils.isEmpty(newBindingsArray)) {
        resultantBindingsArray = resultantBindingsArray.concat(newBindingsArray);
      }
    }
    return (resultantBindingsArray);
  }

  //
  // argQuery(query,bindingsArray)
  //
  // Example:
  // {"arg": ["arg2",{"term": {"arg1": "?arg1", "arg2": "?arg2"}},"?argVar"]}
  // ==> "?argVar" is bound to "?arg2"
  //
  function argQuery(query, inputBindingsArray) {
    let q, argName, term, termHead, termArgNames, output, newBindings;
    let bindingsArray = utils.copyIt(inputBindingsArray);
    let resultantBindingsArray = [];
    if (query["arg"].length == 3) {
      for (let i = 0; i < bindingsArray.length; i++) {
        q = utils.instantiate(utils.copyIt(query), bindingsArray[i]);
        argName = q["arg"][0];
        term = q["arg"][1];
        output = q["arg"][2];
        if (utils.isAssertion(term)) {
          termHead = utils.keys(term)[0];
          termArgNames = utils.keys(utils.values(term)[0]);
          // Case 1: argName is a variable
          if (utils.isVariable(argName)) {
            for (let j = 0; j < termArgNames.length; j++) {
              newBindings = utils.copyIt(bindingsArray[i]);
              if (utils.unifyPatterns(argName, termArgNames[j], newBindings)
                && utils.unifyPatterns(output, term[termHead][termArgNames[j]], newBindings)) {
                resultantBindingsArray.push(newBindings);
              }
            }
          }
          // Case 2: argName is not a variable
          else {
            if ((term[termHead][argName] !== undefined)
              && utils.unifyPatterns(output, term[termHead][argName], bindingsArray[i])) {
              resultantBindingsArray.push(bindingsArray[i]);
            }
          }
        }
      }
    }
    return (resultantBindingsArray);
  }

  //
  // univQuery(query,bindingsArray)
  // 
  //
  // Convert a term into a list or vice versa.
  //
  // Examples:
  // If the first element of the arguments array to "univ" is instantiated,
  // and the second is not:
  // {"univ": [{"term": {"arg1": "?arg1", "arg2": "?arg2"}},"?termAsList"]}
  // ==> {"cons": {"first": {"arg1": "?arg1"}, 
  //               "rest": {"cons": {"first": "term", 
  //                                 "rest": {"cons": {"first": {"arg2": "?arg2"}, 
  //                                                   "rest": "nil"}}}}
  //
  // If the second element of the arguments array to "univ" is instantiated,
  // and the first is not:
  // {"univ": ["?term", {"cons": {"first": {"arg1": "?arg1"}, 
  //                              "rest": {"cons": {"first": "term", 
  //                                                "rest": {"cons": {"first": {"arg2": "?arg2"}, 
  //                                                                  "rest": "nil"}}}}
  // ==> {"term": {"arg1": "?arg1", "arg2": "?arg2"}}
  //
  function univQuery(query, inputBindingsArray) {
    let q, term, termHead, termArgNames, termArgsList, termVar;
    let argPair, list, listAsAssertion;
    let bindingsArray = utils.copyIt(inputBindingsArray);
    let resultantBindingsArray = [];
    if (query["univ"].length == 2) {
      for (let i = 0; i < bindingsArray.length; i++) {
        q = utils.instantiate(utils.copyIt(query), bindingsArray[i]);
        term = q["univ"][0];
        list = q["univ"][1];
        // Case 1: term is an assertion and the list is a variable
        if (utils.isAssertion(term) && utils.isVariable(list)) {
          termHead = utils.keys(term)[0];
          termArgNames = utils.keys(utils.values(term)[0]);
          termArgsList = [];
          for (let j = 0; j < termArgNames.length; j++) {
            argPair = {};
            argPair[termArgNames[j]] = term[termHead][termArgNames[j]];
            termArgsList.push(argPair);
          }
          listAsAssertion = { "cons": { "first": termHead, "rest": utils.listToAssertion(termArgsList) } };
          if (utils.unifyPatterns(list, listAsAssertion, bindingsArray[i])) {
            resultantBindingsArray.push(bindingsArray[i]);
          }
        }
        // Case 2: term is a variable and the list is an assertion
        if (utils.isAssertion(list) && utils.isVariable(term)) {
          list = utils.assertionToList(q["univ"][1]);
          termHead = list[0];
          termArgsList = list.slice(1, list.length);
          termVar = term;
          term = {};
          term[termHead] = {};
          for (let j = 0; j < termArgsList.length; j++) {
            term[termHead][utils.keys(termArgsList[j])[0]] = utils.values(termArgsList[j])[0];
          }
          if (utils.unifyPatterns(termVar, term, bindingsArray[i])) {
            resultantBindingsArray.push(bindingsArray[i]);
          }
        }
      }
    }
    return (resultantBindingsArray);
  }

  //
  // functorQuery(query,bindingsArray) 
  //
  // Example:
  // {"functor": [{"term": {"arg1": "?arg1", "arg2": "?arg2"}},"?f"]}
  // ==> "?f" is bound to "term"
  //
  function functorQuery(query, inputBindingsArray) {
    let q, term, termHead, output;
    let bindingsArray = utils.copyIt(inputBindingsArray);
    let resultantBindingsArray = [];
    if (query["functor"].length == 2) {
      for (let i = 0; i < bindingsArray.length; i++) {
        q = utils.instantiate(utils.copyIt(query), bindingsArray[i]);
        term = q["functor"][0];
        output = q["functor"][1];
        if (utils.isAssertion(term)) {
          termHead = utils.keys(term)[0];
          if ((utils.typeOf(output) === "string")
            && (output == termHead)) {
            resultantBindingsArray.push(bindingsArray[i]);
          }
          else {
            if (utils.isVariable(output)) {
              bindingsArray[i][output] = termHead;
              resultantBindingsArray.push(bindingsArray[i]);
            }
          }
        }
      }
    }
    return (resultantBindingsArray);
  }

  //
  // breakQuery(query,bindingsArray): output message to an alert box
  //
  function breakQuery(query, bindingsArray) {
    let q;
    for (let i = 0; i < bindingsArray.length; i++) {
      q = utils.instantiate(utils.copyIt(query), bindingsArray[i]);
      alert(utils.pp(q["break"]));
      let response = prompt("continue?", "yes");
      if (response == "no") { throw ("exit"); }
    }
    return (bindingsArray);
  };

  //
  // mapQuery(query,bindingsArray)
  //
  // where query = {"map": [{"callback": {"input": "?input", "output": "?output"}},
  //                        inputList, 
  //                        outputVariable]}
  //
  // The callback is applied to each element of the input list, the resultant list 
  // is bound to the outputVariable.  The callback should yield one and only one
  // result when it is applied to an element of the inputList.  If it returns 
  // more than one result, only the first result is used.  Also, the callback must
  // be a deduction rule.  Neither assertions nor production rules are consulted in
  // the execution of a map.
  //
  // Example: Accept a list of integers and square each of them using this rule:
  /*
   {"<--": {"sqr": {"input": "?input", "output": "?output"},
            "and": [{"eval": {"=": ["?output", {"*": ["?input", "?input"]}]}}]}}

   {"map": [{"sqr": {"input": "?input", "output": "?output"}}, // callback
            {"list": ["1","2","3"]},                           // input list
            "?outputList"]}                                    // output variable
  */
  //
  function mapQuery(query, bindingsArray) {
    let q, callback, callbackHead, inputList, resultVariable, outputList;
    let newBindingsArray;
    let freshBindingsArray = utils.copyIt(bindingsArray);
    let resultantBindingsArray = [];
    if (query["map"].length == 3) {
      for (let i = 0; i < freshBindingsArray.length; i++) {
        q = utils.instantiate(utils.copyIt(query), freshBindingsArray[i]);
        callback = q["map"][0];
        inputList = q["map"][1];
        resultVariable = q["map"][2];
        if (utils.isAssertion(callback)
          && utils.isAssertion(inputList)
          && utils.isVariable(resultVariable)) {
          callbackHead = utils.keys(callback)[0];
          inputList = utils.assertionToList(inputList);
          outputList = [];
          for (let j = 0; j < inputList.length; j++) {
            // add binding for callback input variable = inputList[j] to freshBindingsArray[i]
            freshBindingsArray[i][callback[callbackHead]["input"]] = inputList[j];
            // The callback is applied to inputList[j] and the
            // first result found is added to outputList[j].  If no
            // result found, then an "error" is assigned to outputList[j];
            newBindingsArray = applyDRules(callback, freshBindingsArray[i]);
            // If no result found, record it as an "error".
            if (utils.isEmpty(newBindingsArray)
              || (newBindingsArray[0][callback[callbackHead]["output"]] === undefined)) {
              outputList[j] = "error";
            }
            // If one or more results found, record the first one found.
            else {
              outputList[j] = utils.instantiate(callback[callbackHead]["output"], newBindingsArray[0]);
            }
          }
          freshBindingsArray[i][resultVariable] = utils.listToAssertion(outputList);
          resultantBindingsArray.push(freshBindingsArray[i]);
        }
      }
    }
    return (resultantBindingsArray);
  }

  //
  // qeval(query,bindingsArray): array
  //
  function qeval(query, bindingsArray) {
    if (utils.isConjunction(query)) {
      return (conjoin(utils.conjuncts(query), bindingsArray));
    }
    if (utils.isDisjunction(query)) {
      return (disjoin(utils.disjuncts(query), bindingsArray));
    }
    if (utils.isNegation(query)) {
      return (negate(query, bindingsArray));
    }
    if (isEval(query)) {
      return (eeval(query, bindingsArray));
    }
    if (isCall(query)) {
      return (callQuery(query, bindingsArray));
    }
    if (isMap(query)) {
      return (mapQuery(query, bindingsArray));
    }
    if (isStringQuery(query)) {
      return (stringQuery(query, bindingsArray));
    }
    if (isVarQuery(query)) {
      return (varQuery(query, bindingsArray));
    }
    if (isArgQuery(query)) {
      return (argQuery(query, bindingsArray));
    }
    if (isFunctorQuery(query)) {
      return (functorQuery(query, bindingsArray));
    }
    if (isUnivQuery(query)) {
      return (univQuery(query, bindingsArray));
    }
    if (isPrint(query)) {
      return (printQuery(query, bindingsArray));
    }
    if (isBreak(query)) {
      return (breakQuery(query, bindingsArray));
    }
    return (simpleQuery(query, bindingsArray));
  }

  //
  // query(q): outputs to console
  //
  function query(q) {
    let cleanQuery, instance;
    let results = [];
    q = macroExpand(q);
    let bindingsArray = qeval(q, [{}]);
    if (utils.isEmpty(bindingsArray)) { utils.ppToConsole("No"); }
    else {
      for (let i = 0; i < bindingsArray.length; i++) {
        cleanQuery = utils.copyIt(q);
        instance = utils.instantiate(cleanQuery, bindingsArray[i]);
        utils.ppToConsole('(' + i + ')');
        utils.ppToConsole(instance);
        results.push(instance);
        //	utils.ppToConsole(bindingsArray[i]);
      }
    }
    return (results);
  }


  //
  // Return the methods for interacting with the
  // database and the rules.
  //


  return ({
    database: database,
    initializeDatabase: initializeDatabase,
    indexAssertion: indexAssertion,
    assert: indexAssertion,
    retractAssertion: retractAssertion,
    retract: retractAssertion,
    findAssertions: findAssertions,
    fetchAssertions: fetchAssertions,
    conjoin: conjoin,
    qeval: qeval,
    query: query
  });


} // End of makeInterpreter

module.exports = makeInterpreter;