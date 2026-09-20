# HED3505-EVALUATION-ANALYSIS-LAB-09B
## Bottom Next-Lab Navigation

Date: 20 September 2026
Status: IMPLEMENTED

## Purpose
Reduce mobile scrolling friction by allowing learners to continue directly from the end of the current LAB to the next LAB.

## Implemented flow
LAB 1 → LAB 2
LAB 2 → LAB 3
LAB 3 → LAB 4
LAB 4 → LAB 5
LAB 5 → Congratulations

## Interaction rules
- bottom navigation appears at the end of every LAB
- previous-LAB button is secondary
- next-LAB button is primary
- target LAB scrolls to its top automatically
- if the current LAB is incomplete, the system gives a soft recommendation before allowing learners to continue
- progression is not hard-locked
- LAB 5 only opens Congratulations when all five LAB completion checks pass

## Mobile rule
Navigation buttons stack vertically on small screens.

## Boundary
No grading logic, backend, or new data collection introduced.
