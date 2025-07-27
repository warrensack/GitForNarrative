**Metalinguistic Abstractions: From JavaScript to Narrative Formalisms**

Warren Sack <wsack@ucsc.edu>

*Abstract*: Contemporary AI systems, such as large-language models (LLMs), are not just large but sublimely large.  Based on big data, they are “black boxes” impossible for any person to read much less understand.  In other words, despite their name, LLMs are not models.  Moreover, already in 2008, the journalist Chris Anderson, citing AI scientist Peter Norvig, in a Wired magazine editorial titled “The End of Theory,” insisted that AI systems are not theories. This is a strange turn in the history of AI.  Readable code qua theory was the norm. What seems to never have occurred to AI co-founders, like Herbert Simon and Allen Newell, was that AI code would be completely unreadable. In 1972, they wrote, “a good theory of how humans create novels will create novels.”  Certainly the LLMs of today write much better prose than any symbolic-AI system that preceded them.  But they are neither models nor theories.  In contrast, for his 1976 dissertation, “The Metanovel: Writing Stories by Computer,” James Meehan produced a symbolic-AI story generator, *Tale-Spin*, that can be read as an operationalization of French structuralist (e.g., Claude Lévi-Strauss) and Russian formalist (e.g., Vladímir Propp) literary theory: the code itself is a theory of narrative.  *Spinner*, a critical reimplementation, is proposed to place *Tale-Spin* within a long lineage of narrative theory.  *Spinner* is structured around an aesthetics of “metalinguistic abstraction” (so called by Hal Abelson and Gerry Sussman): the design of new domain-specific programming languages.  Two were designed for narrative constructs: (1) llpl.js is a logic programming language (like Prolog) that can accommodate both deduction and production rules; (2) shop.js incorporates a hierarchical task-network planning algorithm and allows one to compose (a) operators, tasks with preconditions that cause additions and deletions to a database detailing the diegesis of the story; and, (b) methods that can specify sequences of operators.  JSON is employed as the syntax for both domain-specific languages.

What might a domain-specific language for narrative look like?

Some problems: Lyotard and Manovich, narrative versus database

On narrative formalisms: Propp, Lévi-Strauss, Eco

Propp: https://gointothestory.blcklst.com/vladimir-propps-31-narratemes-another-approach-to-story-structure-da756027ed13

Umbert Eco. 1979. "Narrative Structures in Fleming." In The Role 
        of the Reader: Explorations in the Semiotics of Texts.
        Bloomington, IN: Indiana University Press.

Eco's outline of James Bond narratives:

A M moves and gives a task to Bond.

B Villain moves and appears to Bond (perhaps in vicarious forms).

C Bond moves and gives a first check to Villain or Villain gives first
check to Bond.

D Woman moves and shows herself to Bond.

E Bond takes Woman (possesses her or begins her seduction).

F Villain captures Bond (with or without Woman, or at different
moments)

G Villain tortures Bond (with or without Woman).

H Bond beats Villain (kills him, or kills his representative or helps
at their killing).

I Bond, convalescing, enjoys Woman, whom he then loses.

https://codepen.io/wsack/pen/WNVNMXm

Talk-through

https://www2.ucsc.edu/softwarearts/

Spinner Code

https://github.com/warrensack/GitForNarrative

https://github.com/warrensack/GitForNarrative/blob/SpinnerInJavaScript/Spinner/spinner.js
