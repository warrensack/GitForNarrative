/*
 * shop
 * 
 * A Simple Hierarchical Ordered Planner
 *
 * Warren Sack <wsack@ucsc.edu>
 * July 2025
 *
 * This is a hierarchical task network (HTN) planner that implements
 * the basic SHOP2 algorithm developed by Dana Nau et al. at the 
 * University of Maryland, College Park.  See Nau et al., "SHOP2:
 * An HTN Planning System," Journal of Artificial Intelligence 
 * Research 20 (2003) 379-404: 
 * https://jair.org/index.php/jair/article/view/10362
 *
 * Sample usage in a webpage:
   <script type="text/javascript" src="./Utilities/utilities.js"></script>
   <script type="text/javascript" src="./Logic/llpl.js"></script>
   <script type="text/javascript" src="./Planner/shop.js"></script>
   <script type="text/javascript" src="./Planner/unstackAll.js"></script>
   <script type="text/javascript">

      let utils = makeUtilities();
      let llpl = makeInterpreter(utils);
      let blocks = makeBlocksWorld(utils);
      let p2 = makePlanner(blocks.world,llpl,utils,llpl.conjoin);
      let plan2 = p2.plan();
      console.log(p2.ppPlan(plan2));

 * Sample usages in node.js:
 * 
     let makeUtilities = require('./Utilities/utilities.js');
     let makeInterpreter = require('./Logic/llpl.js');
     let makePlanner = require('./Planner/shop.js');
     let utils = makeUtilities();
     let llpl = makeInterpreter(utils);
  
     //// basic example
     // Consult the file basicExample.js for a description of 
     // actions, methods, assertions, and rules corresponding
     // to the basic example included in a download of Nau et al.'s
     //SHOP2 code.
     let basicExample = require('./Planner/basicExample.js');
     let p1 = makePlanner(basicExample,llpl,utils,llpl.conjoin);
     let plan1 = p1.plan();
  
     //// complicated block stacking example
     // Consult the file unstackAll.js for a description of
     // actions, methods, assertions, and rules corresponding
     // to the example described in the Nau et al. publication.
     let makeBlocksWorld = require('./Planner/unstackAll.js');
     let blocks = makeBlocksWorld(utils);
     let p2 = makePlanner(blocks.world,llpl,utils,llpl.conjoin);
     let plan2 = p2.plan();

     // console.log(p1.ppPlan(plan1));
     // console.log(p2.ppPlan(plan2));
 *
 * This is the algorithm, as described by Nau et al.:
 *
 * procedure SHOP(s,T,D)
 *    P = the empty plan
 *    T0 = {member(t,T) : no other task in T is constrained to precede t}
 *    loop
 *       if ( T == {} ) then return P
 *       nondeterministically choose any t such that member(t,T0)
 *       if t is a primitive task then
 *          A = {(a,theta) : a is a ground instance of an operator in D, 
 *                           theta is a substitution that unifies {head(a), t}, and 
 *			                     s satisfies a's preconditions}
 *          if ( A == {} ) then return failure
 *          nondeterministically choose a pair (a, theta) such that member((a, theta),A)
 *          modify s by deleting deletions(a) and adding additions(a)
 *          append a to P
 *          modify T by removing t and applying theta
 *          T0 = {member(t,T) : no other task in T is constrained to precede t}
 *       else
 *          M = {(m, theta) : m is an instance of a method in D, 
 *                            theta unifies {head(m), t},
 *                            s satisfies m's preconditions, and 
 *			                      m and theta are as general as possible}
 *          if ( M == {} ) then return failure
 *          nondeterministically choose a pair (m, theta) such that member((m, theta),M)
 *          modify T by 
 *            removing t, 
 *            adding subtasks(m), 
 *            constraining each subtask to precede the tasks that t preceded, and 
 *            applying theta
 *          if ( subtasks(m) != {} ) then
 *            T0 = {member(t,subtasks(m)) : no other task in T is constrained to precede t}
 *          else
 *            T0 = {member(t,T) : no other task in T is constrained to precede t}
 *     repeat
 *  end SHOP
 *
 */

function makePlanner(spec, llpl, utils, conjoin=llpl.conjoin) {


  ////
  //// Syntax
  ////


  //
  // isAction(obj): boolean
  //
  function isAction(obj) {
    return (utils.isAssertionOfType(obj, 'action'));
  }

  //
  // isMethod(obj): boolean
  //
  function isMethod(obj) {
    return (utils.isAssertionOfType(obj, 'method'));
  }

  //
  // isTasks(obj): boolean
  //
  function isTasks(obj) {
    return (utils.isAssertionOfType(obj, 'tasks'));
  }

  //
  // isOrderedClause(obj): boolean
  //
  function isOrderedClause(obj) {
    return (utils.isClauseTypeWithArgsList(obj, 'ordered'));
  }

  //
  // isUnorderedClause(obj): boolean
  //
  function isUnorderedClause(obj) {
    return (utils.isClauseTypeWithArgsList(obj, 'unordered'));
  }

  //
  // orderedSubtasks(obj): array
  //
  function orderedSubtasks(obj) {
    return (utils.argsList(obj));
  }

  //
  // unorderedSubtasks(obj): array
  //
  function unorderedSubtasks(obj) {
    return (utils.argsList(obj));
  }

  //
  // ppMethod(method): string
  //
  function ppMethod(method) {
    return (method["id"] + ": " + method["description"] + "\n" + utils.pp(method["form"]));
  }

  //
  // ppAction(action): string
  //
  function ppAction(action) {
    return (ppMethod(action));
  }

  //
  // ppTask(action): string
  //
  function ppTask(task) {
    return (utils.pp(task));
  }

  //
  // listAndOrderTasks(state,boolean): array
  //
  function listAndOrderTasks(state, deleteIDs) {
    let sortedTasks = linearizeTaskOrder(state);
    let task;
    let tasks = [];
    for (let i = 0; i < sortedTasks.length; i++) {
      task = utils.instantiate(utils.copyIt(sortedTasks[i]),
        state["bindings"]);
      // The IDs need to be removed to make them into assertions.
      if (deleteIDs) { task = deleteIDSlots(task); }
      tasks.push(task);
    }
    return (tasks);
  }

  //
  // deleteIDSlots(assertion): assertion
  //
  function deleteIDSlots(assertion) {
    let assertionHead;
    if (utils.typeOf(assertion) == "object") {
      delete assertion["id"];
      // Any methods that contain subtasks defined, in the method, as
      // a bare variable will have an internal subtask id; these also 
      // need to be removed.
      assertionHead = utils.keys(assertion)[0];
      for (let slot in assertion[assertionHead]) {
        deleteIDSlots(assertion[assertionHead][slot]);
      }
    }
    return (assertion);
  }

  //
  // ppPlan(plan): string
  //
  function ppPlan(plan) {
    if (utils.isEmpty(plan)) { return ("No"); }
    let tasks = listAndOrderTasks(plan, true);
    let result = "\nTASKS\n";
    for (let i = 0; i < tasks.length; i++) {
      result += ppTask(tasks[i]);
    }
    return (result);
  }

  //
  // statesToAssertions(); array
  //
  // Rewrite the search states of the planner into a list of assertions
  // that can be queried in a database.
  //
  function statesToAssertions() {
    let preconditions, additions, deletions, sansIDs;
    let states = planSearch.searchStates;
    let assertions = [];
    let state;
    for (let sid in states) {
      state = utils.copyIt(states[sid]);
      // coerce integer and boolean values to strings
      state["id"] = state["id"] + "";
      if (state["success"]) { state["success"] = "true"; }
      else { state["success"] = "false"; }
      if (state["predecessor"] !== undefined) {
        state["predecessor"] = state["predecessor"] + "";
      }
      let successors = [];
      if (state["successors"] !== undefined) {
        for (let i = 0; i < state["successors"].length; i++) {
          successors.push(state["successors"][i] + "");
        }
      }
      state["successors"] = utils.listToAssertion(successors);
      state["tasks"] = utils.listToAssertion(listAndOrderTasks(state, true));
      state["taskIDs"] = utils.listToAssertion(state["taskIDs"]);
      state["agenda"] = utils.listToAssertion(state["agenda"]);
      state["assertions"] = [];
      for (let aid in state["state"]["assertions"]) {
        state["assertions"] = state["assertions"].concat(state["state"]["assertions"][aid]);
      }
      state["assertions"] = utils.listToAssertion(state["assertions"]);
      // make sure there are no task IDs in the tasks, preconditions, additions, or deletions
      // of the current method or action
      if (state["currentActionOrMethod"] !== undefined) {
        if (state["currentActionOrMethod"]["action"] !== undefined) {
          state["currentActionOrMethod"]["action"]["task"]
            = deleteIDSlots(state["currentActionOrMethod"]["action"]["task"]);
          preconditions = state["currentActionOrMethod"]["action"]["preconditions"];
          sansIDs = [];
          for (let i = 0; i < preconditions.length; i++) {
            sansIDs.push(deleteIDSlots(preconditions[i]));
          }
          state["currentActionOrMethod"]["action"]["preconditions"] = utils.listToAssertion(sansIDs);
          additions = state["currentActionOrMethod"]["action"]["additions"];
          sansIDs = [];
          for (let i = 0; i < additions.length; i++) {
            sansIDs.push(deleteIDSlots(additions[i]));
          }
          state["currentActionOrMethod"]["action"]["additions"] = utils.listToAssertion(sansIDs);
          deletions = state["currentActionOrMethod"]["action"]["deletions"];
          sansIDs = [];
          for (let i = 0; i < deletions.length; i++) {
            sansIDs.push(deleteIDSlots(deletions[i]));
          }
          state["currentActionOrMethod"]["action"]["deletions"] = utils.listToAssertion(sansIDs);
        }
        else {
          state["currentActionOrMethod"]["method"]["task"]
            = deleteIDSlots(state["currentActionOrMethod"]["method"]["task"]);
          preconditions = state["currentActionOrMethod"]["method"]["preconditions"];
          sansIDs = [];
          for (let i = 0; i < preconditions.length; i++) {
            sansIDs.push(deleteIDSlots(preconditions[i]));
          }
          state["currentActionOrMethod"]["method"]["preconditions"] = utils.listToAssertion(sansIDs);
          //
          // The subtasks are either "ordered": or "unordered": assertions and not arrays.
          // If this part of the state is to be inspectable, then the possibly nested
          // "ordered": and "unordered": expressions will need to be parsed (as, for example,
          // the function addOrderings does).  If this turns out to be important to do, it
          // may be more practical to simply keep (rather than is now the case, discard) the
          // state["orderings"] information.
          //
          //state["currentActionOrMethod"]["method"]["subtasks"] = 
          //  utils.listToAssertion(state["currentActionOrMethod"]["method"]["subtasks"]);	
        }
      }
      delete state["state"];
      delete state["bindings"];
      delete state["orderings"];
      assertions.push({ "state": state });
    }
    return (assertions);
  }


  ////
  //// Database
  ////


  //// Ordering Constraints

  //
  // addOrderingConstraint(before,after,orderings): side effects orderings
  //   add before < after to orderings
  //
  function addOrderingConstraint(before, after, orderings) {
    //    console.log("addOrderingConstraint( " + before["id"] + ", " + after["id"] + " )");
    // Make sure the subobjects, within the orderings object, have
    // been initialized before trying to extend them.
    if (orderings["precedes"] == undefined) {
      orderings["precedes"] = {};
    }
    if (orderings["precedes"][before["id"]] == undefined) {
      orderings["precedes"][before["id"]] = {};
    }
    if (orderings["follows"] == undefined) {
      orderings["follows"] = {};
    }
    if (orderings["follows"][after["id"]] == undefined) {
      orderings["follows"][after["id"]] = {};
    }
    // Update the transitive closure of the relations first.
    // The before task will precede any task that the after task already precedes.
    if (orderings["precedes"][after["id"]] !== undefined) {
      for (let precedingID in orderings["precedes"][after["id"]]) {
        orderings["precedes"][before["id"]][precedingID] = true;
      }
    }
    // The after task will follow any task that the before task already follows.
    if (orderings["follows"][before["id"]] != undefined) {
      for (let followingID in orderings["follows"][before["id"]]) {
        orderings["follows"][after["id"]][followingID] = true;
      }
    }
    // Now add the basic assertions: before precedes after; and, after follows before.
    orderings["precedes"][before["id"]][after["id"]] = true;
    orderings["follows"][after["id"]][before["id"]] = true;
    return (orderings);
  }

  //
  // precedes(task1,task2,orderings): boolean
  //
  function precedes(task1, task2, orderings) {
    // Make sure the subobjects, within the orderings object, have
    // been initialized before trying to consult them.
    if ((orderings["precedes"] !== undefined)
      && (orderings["precedes"][task1["id"]] !== undefined)
      && (orderings["precedes"][task1["id"]][task2["id"]] !== undefined)
      && orderings["precedes"][task1["id"]][task2["id"]]) {
      return (true);
    }
    else { return (false); }
  }

  //
  // follows(task1,task2,orderings): boolean
  //
  function follows(task1, task2, orderings) {
    // Make sure the subobjects, within the orderings object, have
    // been initialized before trying to consult them.
    if ((orderings["follows"] !== undefined)
      && (orderings["follows"][task1["id"]] !== undefined)
      && (orderings["follows"][task1["id"]][task2["id"]] !== undefined)
      && orderings["follows"][task1["id"]][task2["id"]]) {
      return (true);
    }
    else { return (false); }
  }

  //
  // removeTaskFromOrderings(task,orderings): side effects orderings
  //
  // Remove all mention of task from the orderings.
  //
  function removeTaskFromOrderings(task, orderings) {
    let id;
    if ((orderings["follows"] !== undefined)
      && (orderings["follows"][task["id"]] !== undefined)) {
      for (id in orderings["follows"][task["id"]]) {
        // Make sure the ordering exists before trying to delete it.
        if ((orderings["precedes"] !== undefined)
          && (orderings["precedes"][id] !== undefined)
          && (orderings["precedes"][id][task["id"]] !== undefined)) {
          delete orderings["precedes"][id][task["id"]];
        }
      }
      delete orderings["follows"][task["id"]];
    }
    if ((orderings["precedes"] !== undefined)
      && (orderings["precedes"][task["id"]] !== undefined)) {
      for (id in orderings["precedes"][task["id"]]) {
        // Make sure the ordering exists before trying to delete it.
        if ((orderings["follows"] !== undefined)
          && (orderings["follows"][id] !== undefined)
          && (orderings["follows"][id][task["id"]] !== undefined)) {
          delete orderings["follows"][id][task["id"]];
        }
      }
      delete orderings["precedes"][task["id"]];
    }
  }

  //
  // replaceTaskInOrderings(task,newTasks,orderings): side effects orderings
  //
  // For each of the newTasks, for each of the precedes and follows relations
  // that mention task, replace the mention of task with the newTask.  Also,
  // remove all mention of task from the orderings.
  //
  function replaceTaskInOrderings(task, newTasks, orderings) {
    let i, id;
    let followsRelations = {};
    if ((orderings["follows"] !== undefined)
      && (orderings["follows"][task["id"]] !== undefined)) {
      followsRelations = orderings["follows"][task["id"]];
    }
    let precedesRelations = {};
    if ((orderings["precedes"] !== undefined)
      && (orderings["precedes"][task["id"]] !== undefined)) {
      precedesRelations = orderings["precedes"][task["id"]];
    }
    removeTaskFromOrderings(task, orderings);
    for (i = 0; i < newTasks.length; i++) {
      for (id in followsRelations) {
        addOrderingConstraint(taskInstances[id], newTasks[i], orderings);
      }
      for (id in precedesRelations) {
        addOrderingConstraint(newTasks[i], taskInstances[id], orderings);
      }
    }
  }

  //
  // addOrderings(subtasks,context,orderings): side effects orderings
  //
  function addOrderings(subtasks, context, orderings) {
    let firstIDs, secondIDs, i, j;
    if (utils.typeOf(subtasks) == 'array') {
      if (utils.isEmpty(subtasks)) { return (true); }
      if (subtasks.length == 1) {
        return (addOrderings(subtasks[0], context, orderings));
      }
      if (subtasks.length > 1) {
        if (context == 'ordered') {
          firstIDs = getTaskIDs(subtasks[0]);
          secondIDs = getTaskIDs(subtasks[1]);
          for (i = 0; i < firstIDs.length; i++) {
            for (j = 0; j < secondIDs.length; j++) {
              addOrderingConstraint(taskInstances[firstIDs[i]],
                taskInstances[secondIDs[j]],
                orderings);
            }
          }
        }
        let orderingsSucceeded = addOrderings(subtasks[0], context, orderings);
        if (orderingsSucceeded) {
          return (addOrderings(subtasks.slice(1), context, orderings));
        }
        else { return (false); }
      }
    }
    if (isOrderedClause(subtasks)) {
      return (addOrderings(orderedSubtasks(subtasks), 'ordered', orderings));
    }
    if (isUnorderedClause(subtasks)) {
      return (addOrderings(unorderedSubtasks(subtasks), 'unordered', orderings));
    }
    if (utils.typeOf(subtasks) == 'object') {
      return (true);
    }
    console.log("Error: Unrecognized format used for subtasks " + utils.pp(subtasks));
    return (false);
  }

  //
  // addTaskNetwork(network,plan): boolean & side effects plan "orderings", "taskIDs" and "agenda"
  //
  // Given a plan's orderings and a task network (either declared in the "subtasks" 
  // attribute of a method; or, in the tasks statement of a planning problem) add the 
  // subtasks to the plan's list of taskIDs and translate all "ordered" 
  // and "unordered" declarations on the tasks into the format necessary for the plan's 
  // "orderings" attribute.  
  // If the parameter task is not empty, for each newTask, for each ordering relation on task,
  // create a copy of the ordering relation that replaces task with newTask; finally, delete
  // all mention of task from the orderings and the plan's taskIDs.
  // Return true if the network's orderings parse; and, false, otherwise.
  //
  function addTaskNetwork(task, network, plan) {
    let newTasks = [];
    let newTaskIDs = addSubtasks(network);
    plan["agenda"] = newTaskIDs.concat(plan["agenda"]);
    plan["taskIDs"] = newTaskIDs.concat(plan["taskIDs"]);
    if (!utils.isEmpty(task)) {
      //      console.log("newTaskIDs == " + utils.pp(newTaskIDs));
      for (let i = 0; i < newTaskIDs.length; i++) {
        newTasks.push(taskInstances[newTaskIDs[i]]);
      }
      replaceTaskInOrderings(task, newTasks, plan["orderings"]);
      plan["taskIDs"] = utils.removeElement(task["id"], plan["taskIDs"]);
    }
    if (addOrderings(network, '', plan["orderings"])) { return (true); }
    else { return (false); }
  }


  //// Actions and Methods

  //
  // actionAndMethodLibrary: object
  //
  // An indexed set of uninstantiated actions and methods
  //
  let actionAndMethodLibrary = {};

  //
  // indexActionOrMethod(am): side effects actionAndMethodLibrary
  //
  // Actions and methods are indexed under the predicate name of
  // the task they perform.
  //
  function indexActionOrMethod(am) {
    let providerType;
    if (isAction(am)) { providerType = "action"; }
    else { providerType = "method"; }
    let pred = utils.predicateName(am[providerType]["task"]);
    if (actionAndMethodLibrary[pred] == undefined) {
      actionAndMethodLibrary[pred] = [am];
    }
    else { actionAndMethodLibrary[pred].push(am); }
  }

  //
  // fetchActionsAndMethods(task): array
  //
  function fetchActionsAndMethods(task) {
    let pred = utils.predicateName(task);
    if (actionAndMethodLibrary[pred] !== undefined) { return (actionAndMethodLibrary[pred]); }
    else { return ([]); }
  }

  //
  // findProviders(task,plan): array of 3-tuples
  //   wherein each 3-tuple contains: (1) an instantiated task, (2) an
  //     instantiated action or method, and (3) an extend set of bindings
  //
  // Look for actions or methods that have a task attribute that unifies with
  // the sought task.
  //
  function findProviders(task, plan) {
    let results = [];
    let provider = {};
    let i, j, id, freshBindings, providerType;
    let possibleProviders = [];
    // Gather possible providers from the library of actions and methods.
    let possibleNewProviders = fetchActionsAndMethods(task);
    // Rename the variables in the possible providers
    for (i = 0; i < possibleNewProviders.length; i++) {
      possibleProviders.push(utils.renameVariables(utils.copyIt(possibleNewProviders[i])));
    }
    for (i = 0; i < possibleProviders.length; i++) {
      if (isAction(possibleProviders[i])) { providerType = "action"; }
      else { providerType = "method"; }
      freshBindings = utils.copyIt(plan["bindings"]);
      // If the task unifies with the task attribute of the possibleProvider...
      if (utils.unifyPatterns(task, possibleProviders[i][providerType]["task"], freshBindings)) {
        // ...then push another 3-tuple on the results:
        // {task,actionOrMethod,freshBindings)
        provider = {};
        provider["task"] = utils.instantiate(utils.copyIt(task), freshBindings);
        provider["actionOrMethod"] = possibleProviders[i];
        provider["bindings"] = freshBindings;
        results.push(provider);
      }
    }
    return (results);
  }

  //// Tasks

  //
  // taskInstances: object
  //
  // Set of all action instances indexed by their IDs.
  //
  let taskInstances = {};

  //
  // currentInstanceID: integer
  //
  let currentInstanceID = 0;

  //
  // makeNewInstanceID(): string and side effects currentInstanceID
  //
  // Used to generate a unique ID for each task instance in the search space
  // of potential partial plans.
  //
  function makeNewInstanceID() {
    currentInstanceID += 1;
    return ("taskInstance_" + currentInstanceID);
  }

  //
  // storeTaskInstance(task): side effect taskInstances
  //
  function storeTaskInstance(task) {
    if (task["id"] == undefined) {
      task["id"] = makeNewInstanceID();
    }
    taskInstances[task["id"]] = task;
    return (task["id"]);
  }

  //// Methods

  //
  // addSubtasks(subtasks): list of subtasks
  //
  // Destructures a method's subtasks declaration into a simple list.
  //
  function addSubtasks(subtasks) {
    //  console.log(utils.pp(subtasks));
    let newIDs = [];
    if (utils.typeOf(subtasks) == 'array') {
      for (let i = 0; i < subtasks.length; i++) {
        newIDs = newIDs.concat(addSubtasks(subtasks[i]));
      }
      return (newIDs);
    }
    if (isOrderedClause(subtasks)) {
      newIDs = addSubtasks(orderedSubtasks(subtasks));
      return (newIDs);
    }
    if (isUnorderedClause(subtasks)) {
      newIDs = addSubtasks(unorderedSubtasks(subtasks));
      return (newIDs);
    }
    if (utils.typeOf(subtasks) == 'object') {
      newIDs.push(storeTaskInstance(subtasks));
      return (newIDs);
    }
    console.log("Error: Unrecognized format used for subtasks " + utils.pp(subtasks));
    return (newIDs);
  }

  //
  // getTaskIDs(subtasks): list of ids
  //
  // Given a methods's subtasks (with "id" attributes), return a list of
  // all of the ids.
  //
  function getTaskIDs(subtasks) {
    let taskIDs = [];
    if (utils.typeOf(subtasks) == 'array') {
      for (let i = 0; i < subtasks.length; i++) {
        taskIDs = taskIDs.concat(getTaskIDs(subtasks[i]));
      }
      return (taskIDs);
    }
    if (isOrderedClause(subtasks)) {
      taskIDs = getTaskIDs(orderedSubtasks(subtasks));
      return (taskIDs);
    }
    if (isUnorderedClause(subtasks)) {
      taskIDs = getTaskIDs(unorderedSubtasks(subtasks));
      return (taskIDs);
    }
    if (utils.typeOf(subtasks) == 'object') {
      taskIDs.push(subtasks["id"]);
      return (taskIDs);
    }
    console.log("Error: Unrecognized format used for subtasks " + utils.pp(subtasks));
    return (taskIDs);
  }


  ////
  //// Algorithm
  ////


  //
  // initialPlan: initial plan created by the function initialize
  //
  let initialPlan = {};

  //
  // makeSortingFunctionForPlan
  //
  // Given a plan with a set of ordering relations (precedes and follows
  // assertions between the tasks), return a function that can 
  // be used to sort the tasks.
  //
  function makeSortingFunctionForPlan(plan) {
    let orderings = utils.copyIt(plan["orderings"]);
    let sorter = function (a, b) {
      let result = 0;
      if (precedes(a, b, orderings)
        || follows(b, a, orderings)) {
        result = -1;
      }
      if (precedes(b, a, orderings)
        || follows(a, b, orderings)) {
        result = 1;
      }
      return (result);
    }
    return (sorter);
  }

  //
  // partitionTasksByOrderings(plan): object 
  //   where keys are integers and values are lists of tasks
  //
  // Partition the tasks into sets where each one of a given
  // set either precedes or follows all the other actions or tasks in the
  // set.  
  //
  function partitionTasksByOrderings(taskIDs, plan) {
    let i, j;
    let partitions = {};
    for (i = 0; i < taskIDs.length; i++) {
      partitions[i] = [];
      partitions[i].push(taskInstances[taskIDs[i]]);
    }
    let changed = true;
    while (changed) {
      changed = false;
      for (i in partitions) {
        for (j in partitions) {
          if ((i != j)
            && !utils.isEmpty(partitions[i])
            && !utils.isEmpty(partitions[j])
            && (follows(partitions[i][0], partitions[j][0], plan["orderings"])
              || precedes(partitions[i][0], partitions[j][0], plan["orderings"]))) {
            partitions[i] = partitions[i].concat(partitions[j]);
            partitions[j] = [];
            changed = true;
          }
        }
      }
    }
    return (partitions);
  }

  //
  // nextTasks(plan): list
  //
  // A possible next task is one that has no preceding, unexecuted tasks.
  //
  function nextTasks(taskIDs, plan) {
    let nts = [];
    let partition, sortedTasks, programCounter;
    let byOrderings = makeSortingFunctionForPlan(plan);
    let partitionedTasks = partitionTasksByOrderings(taskIDs, plan);
    for (let partition in partitionedTasks) {
      if (partitionedTasks[partition].length > 0) {
        sortedTasks = utils.quickSort(partitionedTasks[partition], byOrderings);
        nts.push(sortedTasks[0]);
      }
    }
    return (nts);
  }

  //
  // linearizeTaskOrder(plan): array
  //
  function linearizeTaskOrder(plan) {
    let taskIDs = plan["taskIDs"];
    let nts, i;
    let tasks = [];
    while (taskIDs.length > 0) {
      nts = nextTasks(taskIDs, plan);
      for (i = 0; i < nts.length; i++) {
        taskIDs = utils.removeElement(nts[i]["id"], taskIDs);
        tasks.push(nts[i]);
      }
    }
    return (tasks);
  }

  //
  // planSearch is a search tree wrapped in an object
  // with several methods (e.g., search is a method)
  //
  let planSearch = utils.makeSearch();

  //
  //
  // initialize(a): side effects initialPlan
  //
  //
  function initialize(a) {
    let plan = {};
    plan["id"] = "initial";
    plan["orderings"] = {};
    plan["bindings"] = {};
    plan["agenda"] = [];
    plan["taskIDs"] = [];
    let i, isIndexed, cleanNetwork;
    let rulesAndAssertions = [];
    for (i = 0; i < a.length; i++) {
      isIndexed = false;
      if ((isAction(a[i]) || isMethod(a[i])) && !isIndexed) {
        indexActionOrMethod(a[i]);
        isIndexed = true;
      }
      if (isTasks(a[i]) && !isIndexed) {
        cleanNetwork = utils.renameVariables(utils.copyIt(a[i]["tasks"]));
        if (!addTaskNetwork({}, cleanNetwork, plan)) {
          console.log("Error: Problem statement tasks could not be parsed.");
        }
        isIndexed = true;
      }
      if (utils.isAssertion(a[i]) && !isIndexed) {
        rulesAndAssertions.push(a[i]);
      }
    }
    llpl.initializeDatabase(rulesAndAssertions);
    plan["state"] = llpl.database;
    initialPlan = plan;
    return (plan);
  }

  //
  // refinePlan(plan): array of successor plans
  //
  function refinePlan(plan) {
    //    alert("current plan: " + ppPlan(plan));
    //    utils.ppToConsole(plan["currentTask"]);
    let i, j, k, l, nextPlan, providers, freshBindings, providerType, bindingsArray, freshProvider;
    let possibleSuccessors = [];
    let possibleNextTasks = nextTasks(plan["agenda"], plan);
    for (i = 0; i < possibleNextTasks.length; i++) {
      providers = findProviders(possibleNextTasks[i], plan);
      for (j = 0; j < providers.length; j++) {
        if (isAction(providers[j]["actionOrMethod"])) { providerType = "action"; }
        else { providerType = "method"; }
        // utils.ppToConsole(providers[j]["actionOrMethod"]);
        freshBindings = providers[j]["bindings"];
        bindingsArray = conjoin(utils.copyIt(providers[j]["actionOrMethod"][providerType]["preconditions"]),
          [freshBindings]);
        for (k = 0; k < bindingsArray.length; k++) {
          nextPlan = utils.copyIt(plan);
          nextPlan["bindings"] = bindingsArray[k];
          nextPlan["currentTask"] = utils.instantiate(utils.copyIt(providers[j]["task"]), nextPlan["bindings"]);
          nextPlan["agenda"] = utils.removeElement(nextPlan["currentTask"]["id"], nextPlan["agenda"]);
          freshProvider = utils.instantiate(utils.copyIt(providers[j]["actionOrMethod"]),
                                            nextPlan["bindings"]);
          nextPlan["currentActionOrMethod"] = freshProvider;
          llpl.database["assertions"] = nextPlan["state"]["assertions"];
          // Case if provider is an action / "primitive task":
          if (providerType == "action") {
            for (l = 0; l < freshProvider["action"]["deletions"].length; l++) {
              llpl.retractAssertion(freshProvider["action"]["deletions"][l]);
            }
            for (l = 0; l < freshProvider["action"]["additions"].length; l++) {
              llpl.indexAssertion(freshProvider["action"]["additions"][l]);
            }
            nextPlan["state"]["assertions"] = llpl.database["assertions"];
            possibleSuccessors.push(nextPlan);
          }
          // Case if provider is a method:
          else {
            if (addTaskNetwork(nextPlan["currentTask"], freshProvider["method"]["subtasks"], nextPlan)) {
              possibleSuccessors.push(nextPlan);
            }
            else {
              utils.ppToConsole("Subtask network of method did not parse: "
                                + utils.pp(freshProvider["method"]));
            }
          }
        }
      }
    }
    return (possibleSuccessors);
  }

  //
  // planIsASuccess(plan): boolean
  //
  function planIsASuccess(plan) {
    if (utils.isEmpty(plan["agenda"])) { return (true); }
    else { return (false); }
  }

  //
  // quitToInspect(plan): boolean
  //
  //
  // Debugging function: use this instead of planIsASuccess to inspect
  // partially finished plans.
  //
  function quitToInspect(plan) {
    if (planIsASuccess(plan) || (plan["depth"] == 16)) { return (true) }
    else { return (false); }
  }

  //
  // scorePlan(plan): integer
  //
  // Use the scoring function that will expand the search tree
  // in a depth-first manner.  
  //
  function scorePlan(plan) {
    return (planSearch.depthFirstScorer(plan));
  }

  //
  // plan(): successful plan or {}
  //
  function plan() {
    let result = {};
    if (utils.isEmpty(initialPlan)) {
      initialize(spec);
      planSearch.makeNewSearchState(initialPlan);
    }
    result = planSearch.search(scorePlan, refinePlan, planIsASuccess);
    //    result = planSearch.search(scorePlan,refinePlan,quitToInspect);
    if (!utils.isEmpty(result)) { result["success"] = true; }
    return (result);
  }

  return ({
    taskInstances: taskInstances,
    linearizeTaskOrder: linearizeTaskOrder,
    plan: plan,
    planSearch: planSearch,
    listAndOrderTasks: listAndOrderTasks,
    statesToAssertions: statesToAssertions,
    ppPlan: ppPlan
  });

} // end of makePlanner

module.exports = makePlanner;



