/*
 * qa
 * 
 * An interactive version of conjoin (used in deduction rules) that 
 * queries the user if a statement cannor be proved with the current 
 * database.  The user can answer yes or no to either assert the unproven 
 * statement or assert its negation.
 *
 * Warren Sack <wsack@ucsc.edu>
 * July 2025
 *
 */

function makeQA(llplv1, llplv2, utils) {

  //
  // previouslyAsked(previous,pattern,bindings): boolean
  //
  function previouslyAsked(previous, pattern, bindings) {
    for (let i = 0; i < previous.length; i++) {
      let freshBindings = utils.copyIt(bindings);
      if (utils.unifyPatterns(previous[i], pattern, freshBindings)) {
        return (true);
      }
    }
    return (false);
  }

  let haveBeenPreviouslyAsserted = [];

  //
  // previouslyAsserted(pattern,bindings): boolean
  //
  function previouslyAsserted(pattern, bindings) {
    return (previouslyAsked(haveBeenPreviouslyAsserted, pattern, bindings));
  }

  let haveBeenPreviouslyNegated = [];

  //
  // previouslyNegated(pattern,bindings): boolean
  //
  function previouslyNegated(pattern, bindings) {
    return (previouslyAsked(haveBeenPreviouslyNegated, pattern, bindings));
  }

  //
  // queryUser(a,bindings)
  //
  function queryUser(a, bindings) {
    let bs, statement, response;
    let not = false;
    let tense = "interrogative";
    if (utils.isNegation(a)) {
      not = true;
      a = utils.negation(a);
      tense = "present";
    }
    bs = [{}];
    bs = llplv2.qeval({
      "assertionToStatement": {
        "input": a,
        "output": "?listOfLists",
        "tense": tense
      }
    },
      bs);
    if ((bs[0] == undefined) || (bs[0]["?listOfLists"] == undefined)) {
      console.log("Cannot translate this:" + utils.pp(a) + "----------");
    }
    bs = llplv2.qeval({
      "flatten": {
        "input": "?listOfLists",
        "result": "?statement"
      }
    },
      bs);
    statement = utils.instantiate("?statement", bs[0]);
    statement = utils.assertionToList(statement);
    statement = statement.join(" ") + "? [y/n]";
    if (not) { statement = "It is not the case that " + statement; }
    response = prompt(statement, "yes");
    if ((response == "yes") || (response == "y")
      || (response == "YES") || (response == "Y") || (response == "Yes")) {
      response = "yes";
    }
    return ("response");
  }

  //
  // interactiveConjoin(conjunctsArray,bindingsArray): array
  //
  function interactiveConjoin(conjunctsArray, bindingsArray) {
    let newBindingsArray, freshBindings, a, originalA, response;
    if (utils.isEmpty(conjunctsArray)) { return (bindingsArray); }
    newBindingsArray = llplv1.qeval(conjunctsArray[0], bindingsArray);
    if (utils.isEmpty(newBindingsArray)) {
      newBindingsArray = [];
      for (let i = 0; i < bindingsArray.length; i++) {
        a = utils.instantiate(utils.copyIt(conjunctsArray[0]), bindingsArray[i]);
        originalA = utils.copyIt(a);
        if (previouslyAsserted(originalA, bindingsArray[i])
          && !previouslyNegated(originalA, bindingsArray[i])) {
          newBindingsArray.push(bindingsArray[i]);
        }
        if (!previouslyAsserted(originalA, bindingsArray[i])
          && !previouslyNegated(originalA, bindingsArray[i])) {
          response = queryUser(a, utils.copyIt(bindingsArray[i]));
          if (response == "yes") {
            llplv1.indexAssertion(originalA);
            newBindingsArray.push(bindingsArray[i]);
            haveBeenPreviouslyAsserted.push(originalA);
          }
          else {
            haveBeenPreviouslyNegated.push(originalA);
          }
        }
      }
    }
    conjunctsArray.shift();
    return (interactiveConjoin(conjunctsArray, newBindingsArray));
  }

  return ({ conjoin: interactiveConjoin });
}

module.exports = makeQA;