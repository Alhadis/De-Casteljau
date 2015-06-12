De Casteljau's Algorithm Demo
=============================

De Casteljau's algorithm is an influential formula with an important role in the field of computer-aided design (CAD/CAM). Named after its creator Paul de Casteljau while working at Citroën, the algorithm formed the basis of what was later popularised by Pierre Bézier as the Bézier curve (used extensively today in computer graphics systems and design software).

Although relatively slower compared to more direct formulae for drawing curves (such as Horner's method and finite differencing), the algorithm has proven to be the most robust and numerically-stable method for evaluating polynomials.


This demo
---------
I wrote a JavaScript implementation of De Casteljau's algorithm somewhere in the mists between late June/early July 2014. A job that was pitched to a client involved the animated drawing of curved letterforms over HTML5 video, which was impractical to implement using CSS animations. I sensed an opportunity to learn about something I always wished I understood better: how Bézier curves were calculated and drawn. Being dyscalculic, this was an ambitious undertaking, but after a week of stubborn focus I found myself with a useful, reusable implementation of De Casteljau's formula.

This demo was what eventuated from several nights of number-wrestling during lengthy commutes. The code is sloppy and over-the-top, but reflect the frustration of a dyscalculic coder pretty well. Uploading it strictly for archival reasons at this point, but I may choose to refine it properly later on.
