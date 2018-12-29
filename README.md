atomist parser gui
===========================

the objective is to display, interactively, the tree parsed from various code by Atomist's tree-parse library.

I have to learn some CSS to make it decent though

clone, then 'npm install' and 'npm run build' and 'npm run start' -- it should tell you what port to hit.

select a parser (Java or Markdown), enter some text to parse, and submit. see the tree. thats as far as it is so far.

want to:

- synchronize highlighting
- read a path expression, narrow the tree to only the matches
- write a path expression for a selected part.
