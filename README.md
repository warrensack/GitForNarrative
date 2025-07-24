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
