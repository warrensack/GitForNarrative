# Spinner: A JavaScript Implementation of Tale-Spin
### Warren Sack <wsack@ucsc.edu> University of California, Santa Cruz

In 2006, Noah Wardrip-Fruin was working on his book *Expressive Processing: Digital Fictions, Computer Games, and Software Studies* (MIT Press, 2010).  One chapter of that book is devoted to Tale-Spin and so, as part of his research, Noah dug up my 1992 translation of Micro-Talespin and posted it to the Electronic Literature Organization (ELO) website. His post is a succinct introduction to the program that emphasizes its connection to the arts and humanities: 

“James Meehan’s Tale-Spin, created as part of his 1976 dissertation, *The Metanovel: Writing Stories by Computer*, was the first major project in the area of story generation. Like one of Calvino’s invisible cities, it creates an alternate landscape in which the inhabits live in a manner evocatively different from our own — with all actions the result of plans, the locations of items only learned by convincing someone to tell you, and no one feeling an emotion without knowing it. Like Aesop’s fables, Tale-Spin’s view of human nature was communicated through the interactions of iconic animals. But unlike the worlds of Calvino or Aesop, Meehan’s world wasn’t simply described — it was made to operate. In fact, its operation, rather than its description, was Meehan’s primary work. (The text describing the world was produced by a bare-bones language generation program, called Mumble, designed primarily to fit in the small amount of memory left on the Yale AI lab’s computer system when Tale-Spin was already running.)  … In 1981 a simplified version of Tale-Spin was published as part of the book *Inside Computer Understanding: Five Programs Plus Miniatures*. This version, Micro-Talespin, was then translated into Common Lisp (a programming language used in many artificial intelligence projects) by Warren Sack in 1992. It includes the settings for five default stories, simple text output from Micro-Mumble, and also the ability to interact with the simulated world. The ELO website now hosts Sack’s version, which requires that the computer running it have Common Lisp installed. GNU CLISP is an implementation of Common Lisp that works on Unix, MacOS, and Windows machines. To experience Micro-Talespin, start Common Lisp, load Micro-Talespin, and then, at the “?” prompt, type: (micro-talespin-demo *story1*). Next, try starting up with one of the other five stories.” (http://eliterature.org/showcase/meehan-and-sacks-micro-talespin)."
  
## From Common Lisp to JavaScript: From Micro-Talespin to Spinner

The Common Lisp Micro-Talespin code was useful for teaching until Common Lisp became a relatively unknown language.  In about 2010 I (Warren Sack) decided to translate it into JavaScript.  The resultant translation was more properly an re-encoding of the functionality of Tale-Spin rather than the more limited functionality of Micro-Talespin.  A number of aspects were "updated" making the JavaScript "translation" more of a "critical reimplmentation" (Sack and Davis, 1994) than a faithful, historically accurate reconstruction of James Meehan's original Tale-Spin.  The 2010 rendering was structured using *meta-linguistic abstract* so called by Abelson and Meehan in their book *The Structure and Interpretation of Computer Programs*.  Essentially the design principle implicit to meta-linguistic abstraction is to create a domain specific language in which the desired program can be articulated succinctly as possible.  For Spinner, two domain-specific languages were created: 
1. a logic programming language (llpl.js), akin to Prolog, that can be used to encode
   * assertions about the current state of the world,
   * deduction rules for backward chaining from assertions in the database to conclusions, and
   * production rules that add further consequences -- new assertions -- into the database when new assertations are added to the database; and,
2. a planning language (shop.js) for encoding planning actions (aka operations) and combinations of actions (aka methods) that describe possible courses of action that a character can follow given a specified task.
With these two domain-specific languages, one can write Spinner in about 2000 lines of code that define a set of assertations, deduction rules, production rules, planning actions, and planning methods: https://github.com/warrensack/GitForNarrative/blob/SpinnerInJavaScript/Spinner/spinner.js

Instead of inventing a new syntax for each of these languages, they are written in JSON.  The interpreters for both languages are written in JavaScript.  They both rely on a set of JavaScript functions defined in the file utilities.js.  My former graduate student, Fabiola Hanna (now a professor the New School, New York City) created a quick (25 minute) talk through of all of the code for Spinner that can be found here: https://www2.ucsc.edu/softwarearts/ Please watch Hanna's talk-though before delving into the code here.

There are some minor differences between the 2010 implementation and the code that is being shared here, in this GitHub repository; e.g., in JavaScript we now use *const* and *let* to declare variables rather than the JavaScript of 2010 when one used *var*; and, at the top of each file you will find a set of comments on how to employ the code in a webpage and, also, how to use it within the node.js interpreter.  All of the code shared here is written for node.js.  To use it in a webpage you will need to comment out the *module.exports = ...* declarations at the end of each file.

What follows is an introduction to the code.

## JSON 

The *lingua franca* of data structures exchanged between websites and programming languages is JSON, the JavaScript Object Notation (http://www.json.org/). While other languages, have a variety of syntactic constructs for defining data structures, today, most programming languages suppose JSON, even languages that are not JavaScript.  JSON objects have a very simple syntax.  The empty object is denoted like this: *{}*.  Objects can be filled by zero or more pairs. A pair is written like this: *“name”: “warren sack”*, or this *“name”: [“warren”,”sack”]*, or this *“name”: {“first”: “warren”, “last”: “sack”}*.  So, an object describing someone can look like this:
```JavaScript
{“name”: {“first”: “warren”, “last”: “sack”},
 “job”: “professor”,
 “former students”: [{“first”: “fabiola”, “last”: “hanna”}],
 “school”: “university of california”}
```
All of the data structures in Spinner are defined in JSON syntax.  However, there is one extra constraint on the Spinner data structures. We will call these data structures *terms* and they will be restricted to having one and only one pair in them.  However, as can be seen above (with the definition of the “name” pair) JSON objects can be nested, so there is no loss of expressivity.  To define the JSON structure above as a term, one would write it like this:
```JavaScript
{“person”: {“name”: {“first”: “warren”, “last”: “sack”},
            “job”: “professor”,
            “former students”: [{“first”: “fabiola”, “last”: “hanna”}],
            “school”: “university of california”}}
```
In addition to this constraint on JSON sytax, there is also one extension to that syntax: *unification variables*.  A unification variable is written as a string prefixed with a question mark, like this: *“?what”*.  Variables can appear on the right hand side of any pair (but not on the left hand side).  

## Unification

Given two terms, each of which may include zero or more unification variables, the function *unifyPattern*s (in the file utilities.js), will try to match the predicates together.  *unifyPatterns* takes three arguments: two terms and a list of variable bindings.  Let us set the bindings to the empty object, to start with.  Type the following into the JavaScript Console after you have loaded the system (as described at the top of the spinner.js file). Note that the *“>”* is the prompt from the JavaScript interpreter, not something you type in:
```JavaScript
> var bindings = {};
```
Now, try this:
```JavaScript
> utils.unifyPatterns({"is": {"performer": "?name", "role": "?part"}},
                      {"is": {"performer": "joe", "role": "bear"}},
                      bindings);
```
The response from the JavaScript interpreter should be true.  Now try typing this:
```JavaScript
> utils.pp(bindings);
```
You should then see this:
```JavaScript
{
   "?name":  "joe",
   "?part":  "bear"
}
```
In other words, after unification, the variable *“?name”* has been bound to the value *“joe”* and the variable *“?part”* has been bound to the value *“bear”*. Both terms can contain variables and so be patterns.  So, switching the position of the two terms, yields the same result, as does this, where there is a variable in the first term and a variable in the second term, rather than no variables in the first and two in the second. 
```JavaScript
> utils.unifyPatterns({"is": {"performer": "joe", "role": "?part"}},
                      {"is": {"performer": "?name", "role": "bear"}},
                      bindings);
```
Here is something to watch out for: if two terms have the same left hand side (e.g., in the examples above, that is “is”), then they will unify even if one term does not have all of the pairs of the other term. Thus, this returns true:
```JavaScript
> utils.unifyPatterns({"is": {"role": "?part"}},{"is": {"performer": "?name"}},bindings);
```
This can be the source of difficult bugs if one mistakenly writes something in JSON that is not a term because two unlike JSON objects (that are not terms) can unify.  So, this returns true:
```JavaScript
> utils.unifyPatterns({"a": "1", "b": "2"},
                      {"x": "3", "y": "4"},
                      bindings);
```
Two terms will not unify if they have a matching pair where the right hand side of the pair does not match.  Thus, this will return false:
```JavaScript
> utils.unifyPatterns({"is": {"performer": "joe", "role": "?part"}},
                      {"is": {"performer": "irving", "role": "bear"}},
                      bindings);
```

## Database

As is the case for Tale-Spin, facts about the world are recorded as statements in a database.  To create a new instance of the database system, first create a copy of the utilities:
```JavaScript
> utils = makeUtilities();
```
Then use this command
```JavaScript
> ds = makeInterpreter(utils);
```
And, initialize the database contents to contain nothing:
```JavaScript
> ds.initializeDatabase([]);
```
The variable ds contains a database interpreter with a number of commands the three most important of which are assert, retract, and query. These commands are all defined in the llpl.js file.  To record “Josephine is a bear” one could type this to the JavaScript prompt:
```JavaScript
> ds.assert({"is": {"performer": "josephine", "role": "bear"}});
```
Now, the database can be queried to see who is a bear:
```JavaScript
> ds.query({"is": {"performer": "?who", "role": "bear"}});
```
And, the response indicates there is only one bear in the database, Josephine:
```JavaScript
{"is": {"performer": "josephine", "role": "bear"}}
```
A term can be removed from the database with the retract command; e.g.,
```JavaScript
> ds.retract({"is": {"performer": "josephine", "role": "bear"}});
```
The Spinner database is not a relational database of rows and columns, but rather a store of JSON statements.  In other words, it is a *document-oriented database* also called a *NoSQL database*.

## Production Rules

It is frequently the case that one term implies many others.  For example, when we assert a character is a bear, we might also want to assert that that character has fur, teeth and claws.  To do so in the Spinner database, one can write a *production rule*.  At the top of the production rules is term to be matched.  If a new assertion matches the top of the rule, then the other terms listed in the rule (the consequents) are also asserted into the database.
```JavaScript
{"-->": {"is": {"performer": "?bear", "role": "bear"},
         "consequents": [{"possesses": {"owner": "?bear", "possession": "fur"}},
                         {"possesses": {"owner": "?bear", "possession": "claws"}},
                         {"possesses": {"owner": "?bear", "possession": "teeth"}}]}}
```
One production rule can trigger another.  So, for example, we might have one rule that states that if someone is a bear, they are also a mammal.  And, then a second rule that states that if someone is a mammal, they are also warm blooded.  If such was the case, asserting that Josephine is a bear would result in the additional assertions that she is a mammal and that she is warm blooded. 

## Deduction Rules

One might state that Josephine is at the cave using a term like this:
```JavaScript
{"positioned": {"theme": "Josephine", "goal": "cave"}}
```
And, that Josephine is carrying a fish could be expressed like this:
```JavaScript
{"carries": {"agent": "Josephine", "theme": "fish"}}
```
But, then where is the fish?  You and I know that, since Josphine is carrying it, the fish is wherever Josephine is.  One could devise a means to update the position of everything a character is carrying every time a character moves, or one could write a deduction rule so that the position of a carried item could be deduced when needed.  Here is a deduction rule to do that.  It states that if a character is carrying something, then that something is positioned at the same place as the character.
```JavaScript
{"<--": {"positioned": {"theme": "?x", "goal": "?place"},
	 "and": [{"carries": {"agent": "?character", "theme": "?x"}},
                 {"positioned": {"theme": "?character", "goal": "?place"}}]}}
```
Deduction rules start with an arrow that points to the left (<--) while production rules start with an arrow pointing to the right (-->).  Production rules cause a set of assertions to be added to the database (the consequents of the rule).  Deduction rules do not assert anything into the database.  They simply determine if a term can be deduced from the terms that are already in the database.  The conclusion of a deduction rule is listed first.  The body of the rule is listed second following the *“and”*.  The body of the rule is simply a list of queries into the database (i.e., a conjunctive query).  If all of the queries in the body of the rule return successfully, then the conclusion of the rule is said to be *true*.  Note that the body of the rule can call other deduction rules.

Also, deduction rules can have multiple definitions, thus providing alternative ways of deducing a term.  For example, in addition to the rule above, one might also state that if someone is a bear, then it can be assumed that they are in the cave:
```JavaScript
{"<--": {"positioned": {"theme": "?x", "goal": "cave"},
	 "and": [{"is": {"performer": "?x", "role": "bear"}}]}}
```
The addition of such a rule may allow us to deduce that Josphine is in several different places.  This may be useful if we are trying to generate possible places to look for her.  Or, it may be problematic if no characters are suppose to be in two places at once.  It all depends upon what the other rules look like; i.e., the other rules that employ these rules.

In computer science terms, the Spinner deduction rules are implemented using a form of Horn clause resolution (Robinson, 1965) and so the Spinner database rules are essentially the same thing as the Prolog logic programming language, a programming language invented in the 1970s (Colmerauer and Roussel, 1993).

Consequently, five of the eight key criteria for Tale-Spin-like story generators can be encapsulated in a programming language interpreter that is essentially an implementation of a logic programming language, like Prolog.  It allows one to 
1. assert statements into a database;
2. retract statements from a database;
3. query a database;
4. compose deduction rules; and,
5. compose production rules.

## Planning

What remains of our list of criteria for a domain specific language for story generators are these: the means to 

6. define actions (more commonly called *operators* in the planning literature);
7. define methods; and,
8. define alternatives (i.e., disjuncts of actions or methods).
     
These actions and methods are the core of what Meehan saw as the core of his project: to implement a new theory of planning (Meehan, 1976, p. 39).  Furthermore, Meehan saw planning in Tale-Spin as a cognitive simulation, a step-by-step copy of how people go about the task of creating a story.  This claim – that Tale-Spin is a cognitive simulation – was taken seriously when it was made in the 1970s.  Today, this claim would be a tough sell in the journal of *Cognitive Science* (a journal which Roger Schank co-founded).

However, the Abelson’s and Sussman’s path of *meta-linguistic abstraction* provides us with a different possibility.  The question posed is not this: What does a cognitive simulation of storytelling look like?  Instead, the question to be asked is this: In what sort of a programming language can processes (specifically, methods and actions) be written so that Tale-Spin-like stories can be computed?  Meehan’s answer to this question, and the answer still persistent in the literature of narrative intelligence is this: a planning language is the right choice in which to write a story generator.  Although, today, of course, one might say that we only need LLMs and nothing more.

Following Meehan and then two other students of Roger Schank: Natalie Dehn (see Dehn, 1981) and Michael Lebowitz, a few years later (see Lebowitz, 1987) an extensive literature has grown around the idea that stories are best represented as plans where plans are sequences of actions that have an expected outcome (see, for example, Young, 1999; Riedl and Young, 2004).  

The history of this literature was quickly sketched in a 2011 paper: “With the development of new media, such as Interactive Storytelling (IS) and computer games, a major new application area for AI planning is emerging. In this area, planning technology is used to generate narratives for entertainment systems that feature 3D interactive presentation of the narrative using animations. This approach has its roots in the adoption of planning as a technology for virtual agents which was later transferred to reasoning about virtual actors (Geib, 1994). It was ﬁrst proposed for IS in (Young, 2000) and since then it has emerged as the core technology for IS prototype systems (Cavazza, et al., 2007; Riedl and Young, 2010). In addition, planning has been used in recent computer games, including FEAR and KILLZONE, for controlling the behaviour of non-player characters” (Porteous et al., 2011).

Cavazza and Pizzi have also written a concise introduction to narratology for artificial intelligence researchers (Cavazza and Pizzi, 2006).  So, why is this seen as a natural fit from a technologist’s point of view?  I.e., the fit between planning and narratives?  Recall the short definition of narrative by the narratologist Gerald Prince (one of Nick Montfort's advisors in graduate school): “…the recounting of at least two … events … neither of which logically presupposes or entails the other” (Prince, 2003, p. X).  And, what causes an event?  Some action is usually the cause of an event.  Thus, plans, seen as sequences of actions, if recounted in the past tense, might be considered to be a good representation of story plots, which are sequences of events.

In the literature of AI and cognitive science, plans were seen as a cognitive construct at least by the time of the publication of the book *Plans and the structure of behavio*r in 1960 (Miller, Galanter and Pribram, 1960).  They were seen as analogous to, or even equivalent to computer programs (that encode sequences of actions).  The earliest planning algorithms were implemented in the late 1950s and run as computer programs to solve logic puzzles, prove mathematical theorems, and play games, like chess (see Newell, Shaw and Simon, 1959). For a detailed history of planning, see chapter 8 of Phil Agre’s book *Computation and Human Experience* (Agre, 1997).  In the literature of AI planning (cf., Ghallab, Nau and Traverso, 2004) plans are sometimes posited as cognitive constructs, but, more frequently, they are seen simply as a technology.

If one chooses the latter point of view, it is possible to think of planning systems as a genre of programming languages.  This allows one to reconsider Tale-Spin, not as a cognitive simulation, but as a partial implementation of a programming language evaluator, a planner.

Actions – or as they are more commonly described in the literature, *operators* – in planning systems are commonly represented using what is called a STRIPS notation (Fikes and Nilsson, 1971).  Actions, in this notation, have
1. a set of preconditions that must be true before the action can take place;
2. a set of additions that are terms asserted into the database after the action has taken place; and,
3. a set of deletions that are terms retracted from the database after the action has taken place.

In JSON, one can write an action like this:
```JavaScript
{"action": {"description": "fly from one place to another",
	    "task": {"flies": {"self_mover": "?self_mover", "source": "?source", "goal": "?goal"}},
	    "preconditions": [{"capability": {"entity": "?self_mover",
					      "event": {"flies": {"self_mover": "?self_mover",
								  "source": "?source",
								  "goal": "?goal"}}}}],
	     "additions": [{"positioned": {"theme": "?self_mover", "goal": "?goal"}},
			   {"believes": {"cognizer": "?self_mover", 
					 "topic": {"positioned": {"theme": "?self_mover", "goal": "?goal"}}}}],
	      "deletions": [{"positioned": {"theme": "?self_mover", "goal": "?source"}},
			    {"believes": {"cognizer": "?self_mover", 
					 "topic": {"positioned": {"theme": "?self_mover", "goal": "?source"}}}}]}}
```
This is an action that describes flying.  To fly a character must be capable of flying.  This precondition is asserted in the production rule associated with the term declaring a character to be a bird and, for instance, is not associated with the production rule executed when a character is declared to be a bear.  When a character flies from a source to a goal, two deletions are retracted from the database: (1) that the character is at the source and (2) that the character thinks it is at the source.  And, two additions are made to the database: (1) that the character is at the goal and (2) that the character thinks it is at the goal.  This action definition, along with many others, is defined in the file spinner.js. 

Actions can be organized into sequences.  Such an organization is called a *method* and is akin to a function definition in most conventional programming languages.  Methods are a means of abstraction and composition in the planner used for Spinner.  Here is a definition of a method for threatening a character in order to acquire something the character possesses.
```JavaScript
{"method": {"description": "acquisition of something by threatening",
	    "task": {"dcont": {"character": "?character", "desire": "?desire"}},
	    "preconditions": [{"ownerIsKnown": {"cognizer": "?character", "owner":"?owner", "object": "?desire"}},
                                               {"dominates": {"agent": "?character", "patient": "?owner"}},
                                               {"carries": {"agent": "?owner", "theme": "?desire"}},
                                               {"is": {"performer": "?character", "role": "bully"}}],
	     "subtasks": {"ordered": [{"dprox": {"character": "?character", "objective": "?owner", "place": "?place"}},
				      {"tells": {"speaker": "?character", "addressee": "?owner", 
						 "message": {"desires": {"experiencer": "?character",
							     "theme": {"carries": {"agent": "?character", 
										   "theme": "?desire"}}}}}},
				      {"threatens": {"speaker": "?character", "addressee": "?owner",
						     "message": "?message"}},
				      {"surrenders": {"donor": "?owner", "theme": "?desire",
						      "recipient": "?character"}}]}}}
```
Note that both actions and methods have *“task”* slots.  These are the declaration of a function name (functor) and the arguments for the task that will be achieved if the action or method can be executed.  In this case, this is a *“dcont”* method, shorthand in the Schank and Abelson notation for “delta control,” a method for acquiring control of something.  Methods also have a preconditions slot.  Just as it is possible to list a number of deduction rules with the same name and arguments, it is possible to list a number of actions and methods with the same task description as alternative ways to get something done.  So, for example, dcont includes declarations for robbing, stealing, being given an object from a friend, bargaining, trading: essentially the repetoire originally implemented in Tale-Spin.

In this definition of the dcont method, the owner of the desired object needs to be known: *ownerIsKnown* is a reference to a deduction rule that evaluates a set of conditions.  Each of these conditions could be separately listed in the preconditions slot, but a deduction rule provide a means to abstract and compose sets of preconditions.  Also, for this version of dcont to be applicable, the character applying the method needs to dominate the owner of the object; the character also needs to be a bully; and, the owner needs to be carrying the desired object.  If those preconditions are met, then a sequence of subtasks is attempted.  

Each subtask can be fulfilled by either an action or another method.  Subtasks are either ordered, in which case they need to be explored in the order listed, or unordered, in which case they can be explored in any permutation.  Here the subtasks are first a *dprox* (delta proximity, the transportation of the character to the location of the owner which could be fulfilled by, for instance, flying (as declared above), walking, running, etc.); then a telling in which the character informs the owner of his/her desire to have what the owner possess; then the character threatens to do something bad to the owner (this can be fulfilled in various ways; various threats are generated; e.g., threatening to kill the owner, threatening to rob something else from the owner; etc.); then, the surrender of the object by the owner to the character.

Given an initial state (described as a set of terms), a set of rules, actions and methods, and a list of tasks, the planner produces a sequence of actions that accomplishes the tasks.  The mechanism that accomplishes the sequencing, the planner, is essentially an evaluator for the action and method language described above.  There are a myriad of planner types today (see Ghallab, Nau and Traverso, 2004).  One type that has proven practical for animating autonomous characters in computer games (see Kelly, Botea and Koenig, 2007) and for generating character discourse (see Strong and Mateas, 2008) has been Hierarchical Task Network (HTN) Planning, a technology that was developed for purposes other than games, dialog and narrative, recently, at the University of Maryland (see Nau et al, 2003).  The HTN planner for Spinner can be found in the file shop.js.

The HTN planner is implemented as a search through a state space where each state is represented as a database of assertions about the diegesis, the story world (e.g., Josephine is a bear and is currently in the cave).  Each time an action is executed the additions and deletions of the action change the database and thus form a new state to follow the preceding state.  One can understand this branching space of world states as sets of “possible worlds” as discussed in philosophy and literature (cf., Ryan, 1991).  The planner searches the state space by applying combinations of methods and actions until either all of the tasks have been fulfilled or no such state can be reached.  The general definition of search is implemented in the file utilities.js (see the function *makeSearch*).  The specifics of the planner’s search are implemented in the file shop.js (see the functions plan, initialize, refinePlan, and the variable planSearch).  This way of recasting a problem solving program as a search through an abstract state space is a well-known technique in AI (Nilsson, 1971).

The methods and actions language described above addresses the three remaining criteria for a language for story generators; namely, the means to

6. define actions;
7. define methods; and,
8. define alternatives (i.e., disjuncts of actions or methods).  

## Semantics

One of the oddities of the many interesting programs that were written by Roger Schank’s students in the 1970s and 1980s at the Yale Artificial Intelligence Project was their usage of Schank’s eleven Conceptual Dependency (CD) “primitive acts.” It was considered reasonable, at the time, to imagine that any verb in any language could be decomposed into one of eleven *primitives* (e.g., *ptrans*, physical transfer, would suffice for walking, running, flying, riding, jumping, shipping, racing, etc.).  This was odd because, at the time, there were many other linguists and philosophers working on the topic of semantics and so Schank’s CDs were hardly the only possibility in sight (see, for example, Lyons, 1977a and 1977b).  Today, working outside of the context of the Yale AI Lab of the 1970s and 1980s, it is worthwhile to consider some of those alternatives.  

In particular, the work of Charles Fillmore, a linguist who has been developing since the 1960s what he now calls “frame semantics” (Fillmore, 1968; and, Ruppenhofer et al., 2010).  If Schank was a minimalist, trying to shoehorn the semantics of all verbs into eleven primitive acts, Fillmore is a maximalist, coding the specifics of each verb into a “frame” that includes specific roles for each.  In syntax, when studying verbs, one distinguishes the “subject” and “object” roles.  In frame semantics, one identifies more specific, semantically meaningful, roles (called “frame elements”) for each verb.  Thus, the verb “to fly” has the roles “?self_mover”, “?source” and “?goal” that could occur in a sentence of this form: ?self_mover flew from ?source to ?goal; e.g., “The monarch butterfly flew from Canada to California.”  Related verbs employ similar or the same roles.  Thus, “to walk” and “to run” also employ the roles used in the definition of “to fly.”  Fillmore’s detailed analysis now covers much of the English language (currently 10,000 lexical units) and is available online at this URL: http://framenet.icsi.berkeley.edu/.

One can download all of the verb frames from Fillmore’s website in XML format.  However, it is not difficult to translate XML into JSON.  In principle, this could be done automatically and systematically.  What appears in Spinner (specifically in the spinner.js and initial.js files) are some abbreviated JSON forms for Fillmore’s frames translated unsystematically by hand.  If one were to expand the Spinner system it would worthwhile translating all of Fillmore’s database into Spinner JSON terms.  In this manner, it is possible to rewrite Tale-Spin, and many of the other Schankian AI programs, without using Schank’s primitive acts as a basis for natural language semantics.

## Institutions

According to the Nobel prize winning economist Douglass North, “Institutions are the rules of the game in a society …  They are a guide to human interaction, so that when we wish to greet friends on the street, drive an automobile, buy oranges, borrow money, form a business, bury our dead, or whatever, we know … how to perform these tasks.” (North, 1990, pp. 3, 4, and 6).  Institutions can be formal (e.g., the U.S. Constitution) or informal (e.g., how to tell a story to a child).  Formal and/or computational models of institutions are also a burgeoning area of interest in a number of fields outside of the social sciences including the philosophy of language (e.g., Searle, 2010); multi-agent systems (e.g., Jennings, 1993); artificial intelligence as applied to legal reasoning (e.g., Fornara et al., 2008); and, web services (e.g., Singh and Huhns, 2005). What was not clear when Meehan was writing Tale-Spin was that the large bulk of it is an attempt to codify simple social institutions like how to get from place to place, how to bargain, beg, buy, or steal.  What is clear now is that to recode Tale-Spin, one can borrow from many other areas of research where institutions have been a focus. 

For example, there is an emerging consensus across these various fields that institutions can be modeled as recurrent sets of commitments made by participants through speech acts (cf., Hewitt, 2007; Winograd and Flores, 1986).  In a sense, the actions and methods of Spinner encode a form of deontic logic (a logic of obligation, permission, and prohibition) that is implemented by adding and deleting commitments between characters to and from the database.  Thus, for example, methods like barter (see the spinner.js file) require that characters promise that a future event will occur (specifically the exchange of goods) before that event happens.  The promise action adds a commitment into the database that is resolved when the event (the exchange of goods) takes place.  The implementation of the promise action in Spinner is comparable to the  analysis of the philosopher John Searle gives in his 1969 book *Speech Acts* (Searle, 1969, p. X). That event is then implemented with an action that deletes the commitments from the database (see the definition of the gives action).  Many other speech acts have been formalized in this manner (e.g., Searle and Vanderveken. 1985; Vanderveken, 1990) and the philosophy of action has been extended to include the using of AI planning actions and methods (Bratman, Israel and Pollock , 1988).

In his critique of Sheldon Klein’s story generator, Meehan states that the purpose of Tale-Spin is an examination of various forms of causality (physical, logical, social, psychological).  Institutional analysis in the social sciences, as it has developed since at least the early twentieth century (cf., Durkheim, 1982) provides a framework for exploring these various aspects of the everyday social world.  Tapping some of the insights from this past century of social science work would improve upon the planning methods and actions used in Tale-Spin.

## Mumbler

To render the database statements of Tale-Spin into English, Meehan threw together the Mumble program.  I have followed suit with the mumbler program, although it would be possible to do a better job.  One way to do this better would be, again, to more systematically employ Fillmore’s FrameNet database.  The FrameNet database includes thousands of sample sentences listed under the verb frames they illustrate and annotated with the semantic roles.  For example, the frame for self_motion verbs (run, walk, fly, etc.) includes the sample sentence “A dog ran up” with “dog” annotated with the “?self_mover” role and “up” annotated as the “?goal” (see the definition of the the action for the verb “to fly” given above). 
These example sentences could be translated into many possible templates for rendering  the frames into English. Or, this might  be a good place to use an LLM to rewrite the output of Spinner in a more fluent form.

For mumbler, I have simply thrown together a number of templates on my own, with no reference to the lexicographical research literature.  The code discussed in this section can be found in the file mumbler.js.  Here is one example, for the verb “to carry”:
```JavaScript
{"carries": 
    {"agent": "?agent", "theme": "?theme",
     "past": {"list": ["?agent","carried the","?theme"]},
     "present": {"list": ["?agent","carries the","?theme"]},
     "infinitive": {"list": ["?agent","to carry the","?theme"]},
     "interrogative": {"list": ["will","?agent","carry the","?theme"]}}}
```
The first two lines of the template are used to match the Spinner term about a character carrying some object.  For instance, the first line would match this term:
```JavaScript
{"carries": {"agent":  "joe", "theme":  "honey"}}
```
The following four lines of a text template express the statement in different tenses.  The mumbler program, given a tense and a statement, will render the statement into English in the appropriate tense.  The above in the past tense would be rendered as “joe carried the honey.”  If a role is not instantiated (i.e., it is still a variable), then it is render as “something.”  It would make more sense to do a little more computation and render it as “someone” or “somewhere” or “something” depending on the context, but, again, that was neither Meehan’s focus nor the focus of this translation. 

Very sophisticated work has been done on rendering the *syuzhet* from the *fabula* in more contemporary research such as Nick Montfort’s Curveship system: “Curveship can tell events out of order, using flashback and other techniques, and can tell the story from the standpoint of particular characters and their perceptions and understandings” (see Montfort, 2011).  Obviously, there is an enormous distance between mumbler and Curveship.

In Spinner, statements can be nested one into another.  Some of the Mumbler text templates reflect this possibility.  For example, the first few lines of the template for “to inform” look like this:
```JavaScript
{"informs": 
    {"informer": "?informer", "addressee": "?addressee", "message": "?message",
     "past": {"list": ["?informer","informed","?addressee","that",
		       {"past": {"assertion": "?message"}}]}}}
```
Note that the template includes a reference to another template: the {“past”: {“assertion”: “?message”}} statement directs Mumbler to render that part of “to inform” in the past tense.  Thus, to render this into English
```JavaScript
{"informs": {"informer":  "joe", "addressee":  "irving",
	     "message": {"desires": {"experiencer": "joe", "theme": {"carries": {"agent": "joe",
										 "theme": "honey"}}}}}}  
```
The “informs” template is called and the message (which begins with “desires”) is then rendered using the template for the verb “to desire” which, in term, needs to call the template for “carries” to finally output this: “joe informed irving that joe desired joe to carry the honey.”  Neither pronouns nor capitalization are supported by mumbler.

A text template of this sort exists for task mentioned in a method or action, every deduction rule, and every functor used in a term that does or might occur in the Spinner database.  It is extensible.  **After adding a new verb or a new method to Spinner, one should also write a new text template for Mumbler so that the output can be rendered in English**.

In addition to text templates, mumbler contains a simple transcoding system defined in a number of deduction rules.  The search states generated by the planner are rewritten as Spinner database terms and the deduction rules of Mumbler select portions of these search states to output in English.  The top-level rule is *{“narrate”: {“tense”: “?tense”}}*.  It calls two other rules.  The rule *narrateInitialState* gathers all of the assertions in the initial state and then outputs “once upon a time…” and then each assertion as an English sentence.  The rule *narratePathToSuccess* gathers together the sequence of states that led to the successful plan (and the tasks that transformed one state into another).  For each state in the path to a successful plan (excluding the initial state), the rule finds the task that was solved in that state (via a method or action) and records the task along with any database additions made at that point.  It output the task and the terms representing the additions into English.

Mumbler is used in one other way in the Spinner program.  If the user wants what was called in micro-Talespin an “interactive” version of a story, the Mumbler program is used to pose questions to the user.  In micro-Talespin an “interactive” story called the function *find-out* if, during plan generation, a query returned false for statements about a character’s state (specifically, their state of hunger or thirst) and for statements concerning social relations between characters (e.g., “Does Joe like Irving?”).  Tale-Spin’s “interactive” mode is similar and, in my opinion, does not constitute an interesting form of interaction. 

To duplicate this “interactivity” in Spinner, the user can replace the function *conjoin* (defined in the file llpl.js) with a different version of conjoin (defined in the file qa.js) which asks the user if a query is true or false after it has been found that the statement is not currently in the database.  If the user answers “yes” the statement is true, the statement is asserted into the database and the planner continues its work.  If the user responds to the qa.conjoin question with “no,” then the statement is recorded as having been negated and the planner continues it work. See the function *interactiveConjoin* defined in the file qa.js for details. The mumbler program is used in render the statements in question into the interrogative before they are printed out in English for the user to respond to.



