import type { Problem } from "./problems";

export const EXTRA_PROBLEMS: Problem[] = [
  // ─── Conditional Probability ─────────────────────────────────────────────
  {
    id: "airplane-boarding",
    title: "Airplane Boarding (100 Passengers)",
    category: "Conditional Probability",
    difficulty: "Medium",
    companies: ["Jane Street", "Two Sigma", "Citadel"],
    tags: ["Classic", "Conditional Probability", "Induction"],
    source: "Green Book §3.1",
    statement:
      "100 passengers board a plane with assigned seats. The first passenger lost their ticket and picks a random seat. Each subsequent passenger takes their own seat if available, or picks a random empty seat otherwise. What is the probability that the last passenger gets their own seat?",
    hints: [
      "Focus on passenger 100's seat vs passenger 1's seat.",
      "At each step, only passenger 1's seat or passenger 100's seat matters.",
      "By symmetry, these two outcomes are equally likely.",
    ],
    answer: "P(\\text{last gets own seat}) = \\frac{1}{2}",
    solutionExplanation:
      "By induction: at every step, the outcome is determined by whether passenger 1's seat or passenger 100's seat gets taken first. By symmetry, these are equally likely. So regardless of n (≥2), the last passenger gets their seat with probability exactly 1/2.",
    simulationType: "airplane-boarding",
    params: {
      passengers: { label: "Number of Passengers", min: 10, max: 500, step: 10, default: 100 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 20000 },
    },
  },
  {
    id: "russian-roulette",
    title: "Russian Roulette — Reload or Spin?",
    category: "Conditional Probability",
    difficulty: "Medium",
    companies: ["Jane Street", "D.E. Shaw"],
    tags: ["Conditional Probability", "Strategy"],
    source: "Green Book §3.1",
    statement:
      "A revolver has 6 chambers. Two bullets are placed in consecutive chambers. You survive the first pull. Should you spin again (random) or just pull the trigger again (next chamber)? Which strategy minimizes your P(death)?",
    hints: [
      "After surviving, only 4 of 5 remaining consecutive arrangements are safe. What does spinning give?",
      "P(death | pull again) = P(bullet in next chamber | survived first).",
      "P(death | spin) = 2/6 = 1/3, independent of history.",
    ],
    answer: "\\text{Pull again: } P(\\text{death}) = \\frac{1}{4} \\quad \\text{Spin: } P(\\text{death}) = \\frac{2}{6} = \\frac{1}{3}",
    solutionExplanation:
      "After surviving, the bullet was not in the first fired chamber. With consecutive bullets, P(next chamber has bullet | survived) = 1/4 (1 bad out of 4 remaining non-bullet-start positions). Spinning gives P(death) = 2/6 = 1/3. Since 1/4 < 1/3, you should pull again without spinning.",
    simulationType: "russian-roulette",
    params: {
      trials: { label: "Simulations", min: 1000, max: 100000, step: 1000, default: 50000 },
    },
  },
  {
    id: "three-prisoners",
    title: "Three Prisoners Problem",
    category: "Conditional Probability",
    difficulty: "Hard",
    companies: ["Two Sigma", "Optiver"],
    tags: ["Bayes", "Conditional Probability", "Paradox"],
    source: "Green Book §3.1",
    statement:
      "Three prisoners A, B, C — one will be pardoned. A asks the guard to name one of B or C who will NOT be pardoned (guard names B). Does A's probability of being pardoned change from 1/3?",
    hints: [
      "This is similar to Monty Hall but with a subtlety about the guard's strategy.",
      "If A is pardoned: guard picks B or C with equal probability.",
      "If C is pardoned: guard must name B (can't name A). Apply Bayes.",
    ],
    answer: "P(A\\text{ pardoned}| \\text{guard names B}) = \\frac{1}{3}, \\quad P(C) = \\frac{2}{3}",
    solutionExplanation:
      "Using Bayes: P(guard says B | A pardoned) = 1/2, P(guard says B | B pardoned) = 0, P(guard says B | C pardoned) = 1. P(A|guard says B) = (1/2·1/3) / (1/2·1/3 + 0·1/3 + 1·1/3) = (1/6)/(1/2) = 1/3. A's probability stays at 1/3; C's probability jumps to 2/3. Same logic as Monty Hall.",
    simulationType: "three-prisoners",
    params: {
      trials: { label: "Simulations", min: 1000, max: 100000, step: 1000, default: 50000 },
    },
  },
  {
    id: "sock-drawer",
    title: "Matching Socks in the Dark",
    category: "Combinatorics",
    difficulty: "Easy",
    tags: ["Combinatorics", "Pigeonhole"],
    source: "Green Book §3.2",
    statement:
      "A drawer contains 10 red socks, 10 blue socks, and 10 green socks. You grab socks in the dark. How many socks must you pull to guarantee a matching pair? How many to guarantee a matching pair of red?",
    hints: [
      "Use the Pigeonhole Principle.",
      "To guarantee any matching pair: consider worst case — you pick one of each color.",
      "To guarantee a red pair: worst case picks all non-red first.",
    ],
    answer: "\\text{Any match: 4 socks} \\quad \\text{Red pair: 22 socks}",
    solutionExplanation:
      "For any matching pair: 3 colors → worst case is 1 red, 1 blue, 1 green (3 socks). The 4th sock must match one. Answer: 4. For a guaranteed red pair: worst case is all 10 blue + all 10 green + 1 red = 21 socks, then 22nd must be red. Answer: 22.",
    simulationType: "sock-drawer",
    params: {
      colorsCount: { label: "Colors", min: 2, max: 10, step: 1, default: 3 },
      socksPerColor: { label: "Socks per Color", min: 5, max: 30, step: 5, default: 10 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "poker-full-house",
    title: "Poker: Probability of a Full House",
    category: "Combinatorics",
    difficulty: "Medium",
    tags: ["Combinatorics", "Cards", "Poker"],
    source: "Green Book §3.2",
    statement:
      "What is the probability of being dealt a full house (three of a kind + a pair) in a standard 5-card poker hand from a 52-card deck?",
    hints: [
      "Count favorable hands: choose rank for 3-of-a-kind (13 ways), then 3 suits of 4; choose rank for pair (12 ways), then 2 of 4 suits.",
      "Total 5-card hands = C(52,5).",
      "Compute C(13,1)·C(4,3)·C(12,1)·C(4,2).",
    ],
    answer: "P = \\frac{\\binom{13}{1}\\binom{4}{3}\\binom{12}{1}\\binom{4}{2}}{\\binom{52}{5}} = \\frac{3744}{2598960} \\approx 0.144\\%",
    solutionExplanation:
      "Favorable: 13 ways for triple rank × C(4,3)=4 suit combos × 12 remaining ranks for pair × C(4,2)=6 suit combos = 13×4×12×6 = 3744. Total hands = C(52,5) = 2,598,960. P = 3744/2598960 ≈ 0.00144 ≈ 0.144%.",
    simulationType: "poker-hand",
    params: {
      handType: { label: "Hand Type (0=full house, 1=flush, 2=straight)", min: 0, max: 2, step: 1, default: 0 },
      trials: { label: "Simulations", min: 10000, max: 500000, step: 10000, default: 100000 },
    },
  },
  {
    id: "hat-check",
    title: "Hat Check (Derangements)",
    category: "Combinatorics",
    difficulty: "Medium",
    companies: ["Jane Street", "IMC", "Optiver"],
    tags: ["Derangement", "Combinatorics", "Inclusion-Exclusion"],
    source: "Green Book §3.2",
    statement:
      "n people check their hats. The hats are returned randomly. What is the probability that no person gets their own hat back (a derangement)? What does this converge to as n → ∞?",
    hints: [
      "Use inclusion-exclusion: P(no fixed points) = Σ(-1)^k / k! for k=0 to n.",
      "D_n / n! = 1 - 1/1! + 1/2! - 1/3! + ... + (-1)^n/n!",
      "As n→∞ this converges to e^{-1} ≈ 36.79%.",
    ],
    answer: "P(\\text{derangement}) = \\sum_{k=0}^{n} \\frac{(-1)^k}{k!} \\to e^{-1} \\approx 36.79\\%",
    solutionExplanation:
      "By inclusion-exclusion: D_n = n! · Σ_{k=0}^{n} (-1)^k/k!. For n=5: D_5=44, P=44/120≈36.7%. Converges remarkably fast to 1/e ≈ 0.3679 even for small n. This is the derangement formula and appears in many matching problems.",
    simulationType: "derangement",
    params: {
      people: { label: "Number of People (n)", min: 2, max: 20, step: 1, default: 5 },
      trials: { label: "Simulations", min: 1000, max: 100000, step: 1000, default: 20000 },
    },
  },
  {
    id: "matching-problem",
    title: "Expected Matches in Random Permutation",
    category: "Expected Value",
    difficulty: "Easy",
    companies: ["Jane Street", "Two Sigma", "Akuna Capital"],
    tags: ["Expected Value", "Linearity", "Indicator Variables"],
    source: "Green Book §3.3",
    statement:
      "Shuffle a deck of 52 cards alongside a second deck (also shuffled). Flip through both simultaneously. What is the expected number of positions where both decks show the same card?",
    hints: [
      "Use linearity of expectation with indicator variables.",
      "Let X_i = 1 if card i matches at position i. E[X_i] = 1/52.",
      "E[total matches] = 52 × (1/52) = 1.",
    ],
    answer: "E[\\text{matches}] = 1 \\quad \\text{(for any n)}",
    solutionExplanation:
      "For each of n positions, by symmetry P(match at position i) = 1/n. By linearity of expectation, E[total] = n × (1/n) = 1. This holds for any n! The expected number of fixed points in a random permutation is always exactly 1.",
    simulationType: "expected-matches",
    params: {
      deckSize: { label: "Deck Size (n)", min: 5, max: 52, step: 1, default: 52 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "coin-sequence",
    title: "Expected Flips for HH vs HT",
    category: "Expected Value",
    difficulty: "Medium",
    companies: ["Jane Street", "Citadel", "IMC"],
    tags: ["Expected Value", "Stopping Time", "Martingale"],
    source: "Green Book §3.3",
    statement:
      "How many fair coin flips do you expect until you first see HH (two heads in a row)? How about HT? Why do they differ despite both having P=1/4 for each pair?",
    hints: [
      "For HT: set up states — Start, H, HT(done). E[HT]=4.",
      "For HH: set up states — Start, H, HH(done). Reaching H then getting T resets to state H, not Start.",
      "HH requires more flips because a T after H resets progress more severely.",
    ],
    answer: "E[\\text{first HT}] = 4 \\qquad E[\\text{first HH}] = 6",
    solutionExplanation:
      "For HT: Let a=E[flips from start], b=E[flips from having H]. a = 1 + (1/2)b + (1/2)a? No — a=1+(1/2)b+(1/2)a gives a=2+b. b=1+(1/2)·0+(1/2)·b? HT done on T after H. b=1+(1/2)·0+(1/2)·a → b=1+a/2. Solving: a=4, b=3. For HH: a=1+(1/2)b+(1/2)a → a=2+b; b=1+(1/2)·0+(1/2)·b → b=2; a=6.",
    simulationType: "coin-sequence",
    params: {
      target: { label: "Target (0=HH, 1=HT, 2=TTT)", min: 0, max: 2, step: 1, default: 0 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 20000 },
    },
  },
  {
    id: "geometric-series-expected",
    title: "St. Petersburg Paradox",
    category: "Expected Value",
    difficulty: "Hard",
    tags: ["Expected Value", "Paradox", "Infinite Series"],
    source: "Green Book §3.3",
    statement:
      "A casino game: flip a fair coin repeatedly until Tails. If Tails appears on flip n, you win $2^n. How much would you pay to play? The expected value is infinite — but how much would a rational person pay?",
    hints: [
      "E[payout] = Σ P(tails on flip n) × 2^n = Σ (1/2)^n × 2^n = Σ 1 = ∞.",
      "The paradox: finite people assign diminishing marginal utility to wealth.",
      "With log utility U(x)=log₂(x), E[utility] = Σ (1/2)^n · n = 2.",
    ],
    answer: "E[\\text{payout}] = \\infty \\qquad \\text{Utility-based value} \\approx \\$2 \\text{ (log utility)}",
    solutionExplanation:
      "P(first tails at flip n) = (1/2)^n. E = Σ_{n=1}^∞ (1/2)^n · 2^n = Σ 1 = ∞. Yet no rational person pays $1000 to play. Resolution: Bernoulli (1738) proposed log utility. With U(x)=log₂(x), E[U] = Σ (1/2)^n · n = 2, so a risk-neutral log-utility player pays 2² = $4.",
    simulationType: "st-petersburg",
    params: {
      maxFlips: { label: "Max Flips Cap", min: 10, max: 40, step: 1, default: 20 },
      trials: { label: "Simulations", min: 1000, max: 100000, step: 1000, default: 50000 },
    },
  },
  {
    id: "noodle-loop",
    title: "Noodle Loop Problem",
    category: "Expected Value",
    difficulty: "Medium",
    tags: ["Expected Value", "Induction", "Loops"],
    source: "Green Book §3.4",
    statement:
      "You have 100 noodles in a bowl. You randomly pick two ends and tie them together. Repeat until no loose ends remain. What is the expected number of loops formed?",
    hints: [
      "With 2k loose ends remaining, P(forming a loop with next tie) = 1/(2k-1).",
      "Use linearity of expectation: E[loops] = Σ_{k=1}^{n} 1/(2k-1).",
      "For n=100 noodles, E = 1/1 + 1/3 + 1/5 + ... + 1/199.",
    ],
    answer: "E[\\text{loops}] = \\sum_{k=1}^{n} \\frac{1}{2k-1} \\approx \\frac{1}{2}\\ln(2n) + \\frac{\\gamma}{2}",
    solutionExplanation:
      "With 2k ends remaining, you pick 1 end (WLOG), then pick a second end. P(other end of same noodle) = 1/(2k-1), forming a loop. E[loops from 2k ends] = 1/(2k-1) + E[loops from 2k-2 ends]. For n=100: E = 1+1/3+1/5+...+1/199 ≈ 2.94 loops expected.",
    simulationType: "noodle-loop",
    params: {
      noodles: { label: "Number of Noodles", min: 5, max: 200, step: 5, default: 100 },
      trials: { label: "Simulations", min: 1000, max: 20000, step: 1000, default: 5000 },
    },
  },
  {
    id: "pirate-gold",
    title: "Pirate Gold Division",
    category: "Game Theory",
    difficulty: "Hard",
    companies: ["Jane Street", "Citadel", "D.E. Shaw"],
    tags: ["Game Theory", "Backward Induction", "Strategy"],
    source: "Green Book §5.1",
    statement:
      "5 pirates rank 1–5 (1 = most senior). They divide 100 gold coins: the most senior proposes a split; all vote; if ≥50% approve, done; else the proposer is thrown overboard and the next pirate proposes. All pirates are perfectly rational and prefer: survival > gold > killing. What does pirate 1 propose?",
    hints: [
      "Work backwards: with 1 pirate, they keep all 100.",
      "With 2 pirates, pirate 1 proposes 100/0 — they have 50% (their own vote).",
      "With 3, pirate 1 needs 2 votes — must give pirate 3 (who gets 0 with 2 pirates) at least 1 coin.",
    ],
    answer: "\\text{Pirate 1: (98, 0, 1, 0, 1)} \\text{ — keeps 98 coins}",
    solutionExplanation:
      "Backward induction: 2 pirates: P1 keeps 100 (own vote = 50%). 3 pirates: P1 needs P3's vote; offer P3 ≥ 1 (they get 0 if P1 dies). Proposal: (99,0,1). 4 pirates: P1 needs 2 more votes; P2 gets 100 with 3-pirate scenario? No — P2 gets 0. P4 gets 0. Give P2=1, P4=1: (98,1,0,1). 5 pirates: give P3=1, P5=1: final answer (98,0,1,0,1).",
    simulationType: "pirate-game",
    params: {
      pirates: { label: "Number of Pirates", min: 2, max: 10, step: 1, default: 5 },
      gold: { label: "Gold Coins", min: 10, max: 200, step: 10, default: 100 },
    },
  },
  {
    id: "brownian-bridge",
    title: "Brownian Motion: Hitting Time",
    category: "Random Walks",
    difficulty: "Hard",
    companies: ["Two Sigma", "Citadel", "Millennium"],
    tags: ["Brownian Motion", "Stopping Time", "Continuous"],
    source: "Green Book §4.5",
    statement:
      "A standard Brownian motion starts at 0. What is the probability it reaches level a > 0 before level −b < 0? What is the expected time to hit either barrier?",
    hints: [
      "Use the optional stopping theorem on the martingale B_t.",
      "P(hit a before −b) = b/(a+b) by the martingale property.",
      "Expected hitting time E[τ] = a·b using the martingale B_t² − t.",
    ],
    answer: "P(\\text{hit } a \\text{ first}) = \\frac{b}{a+b} \\qquad E[\\tau] = a \\cdot b",
    solutionExplanation:
      "Since B_t is a martingale, E[B_τ] = 0. Let p = P(hit a first). E[B_τ] = p·a + (1-p)·(−b) = 0 → p = b/(a+b). For E[τ]: B_t²−t is a martingale, so E[B_τ²] = E[τ]. E[B_τ²] = p·a² + (1-p)·b² = (b·a²+a·b²)/(a+b) = ab(a+b)/(a+b) = ab. So E[τ] = ab.",
    simulationType: "brownian-hitting",
    params: {
      upperBarrier: { label: "Upper Barrier (a)", min: 1, max: 10, step: 0.5, default: 2 },
      lowerBarrier: { label: "Lower Barrier (b)", min: 1, max: 10, step: 0.5, default: 3 },
      trials: { label: "Simulations", min: 500, max: 10000, step: 500, default: 2000 },
    },
  },
  {
    id: "order-statistics",
    title: "Order Statistics: Min and Max of Uniforms",
    category: "Expected Value",
    difficulty: "Medium",
    companies: ["Citadel", "Millennium", "Point72"],
    tags: ["Order Statistics", "Uniform Distribution", "CDF"],
    source: "Green Book §4.4",
    statement:
      "Draw n independent Uniform[0,1] random variables. What is the expected value of the minimum? The maximum? The k-th order statistic?",
    hints: [
      "P(min > x) = (1−x)^n, so E[min] = ∫₀¹ (1−x)^n dx.",
      "P(max ≤ x) = x^n, so E[max] = ∫₀¹ n·x·x^{n-1} dx.",
      "E[X_(k)] = k/(n+1) for the k-th order statistic.",
    ],
    answer: "E[X_{(k)}] = \\frac{k}{n+1} \\qquad E[\\min] = \\frac{1}{n+1} \\qquad E[\\max] = \\frac{n}{n+1}",
    solutionExplanation:
      "The k-th order statistic of n U[0,1] draws has expectation k/(n+1). E[min] = E[X_(1)] = 1/(n+1). E[max] = E[X_(n)] = n/(n+1). E[range] = E[max]−E[min] = (n−1)/(n+1). For n→∞: E[min]→0, E[max]→1.",
    simulationType: "order-statistics",
    params: {
      sampleSize: { label: "Sample Size (n)", min: 2, max: 50, step: 1, default: 10 },
      orderK: { label: "Order k", min: 1, max: 10, step: 1, default: 3 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "poker-texas-outs",
    title: "Poker: Runner-Runner Probability",
    category: "Combinatorics",
    difficulty: "Medium",
    tags: ["Cards", "Combinatorics", "Poker"],
    source: "Classic Poker Math",
    statement:
      "In Texas Hold'em, you hold two hearts and the flop has two hearts (4 hearts total; 9 remaining in deck of 47 unseen cards). What is the probability of hitting a flush (runner-runner heart or a heart on the turn/river)?",
    hints: [
      "P(heart on turn) = 9/47.",
      "P(flush by river) = P(heart on turn) + P(no heart on turn) × P(heart on river | no heart on turn).",
      "Do NOT double-count the runner-runner case.",
    ],
    answer: "P(\\text{flush by river}) = 1 - \\frac{38}{47} \\cdot \\frac{37}{46} \\approx 34.97\\%",
    solutionExplanation:
      "P(no heart on turn AND no heart on river) = (38/47)×(37/46) ≈ 0.650. So P(at least one heart in turn/river) = 1 − 0.650 ≈ 34.97%. The quick approximation '4×outs%' gives 4×9=36%, close enough for table calculations.",
    simulationType: "poker-flush",
    params: {
      heartsNeeded: { label: "Hearts Still Needed", min: 1, max: 2, step: 1, default: 1 },
      heartsInDeck: { label: "Hearts Remaining in Deck", min: 5, max: 13, step: 1, default: 9 },
      trials: { label: "Simulations", min: 10000, max: 200000, step: 10000, default: 100000 },
    },
  },
  {
    id: "ballot-problem",
    title: "Ballot Problem",
    category: "Combinatorics",
    difficulty: "Hard",
    companies: ["Jane Street", "Optiver"],
    tags: ["Ballot", "Catalan", "Path Counting"],
    source: "Green Book §3.2",
    statement:
      "In an election, candidate A gets a votes and candidate B gets b votes, a > b. What is the probability that A is strictly ahead of B throughout the entire counting?",
    hints: [
      "This is the classical ballot problem (Bertrand, 1887).",
      "Use the reflection principle to count unfavorable paths.",
      "Number of paths where A leads throughout = (a−b)/(a+b) × total paths.",
    ],
    answer: "P(A \\text{ always leads}) = \\frac{a - b}{a + b}",
    solutionExplanation:
      "By the reflection principle: the number of counting sequences where A is always strictly ahead equals (a−b)/(a+b) × C(a+b, a). So the probability is simply (a−b)/(a+b). Example: a=3, b=1 → P = 2/4 = 1/2. This elegant result is proven by bijecting 'bad' paths (where B ties or leads) to paths starting with a B vote via reflection.",
    simulationType: "ballot",
    params: {
      votesA: { label: "Votes for A", min: 3, max: 50, step: 1, default: 10 },
      votesB: { label: "Votes for B", min: 1, max: 30, step: 1, default: 6 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "random-chord",
    title: "Bertrand's Paradox (Random Chord)",
    category: "Paradoxes",
    difficulty: "Hard",
    companies: ["Jane Street", "D.E. Shaw"],
    tags: ["Geometric Probability", "Paradox"],
    source: "Classic Geometric Probability",
    statement:
      "A chord is drawn at random in a unit circle. What is the probability it is longer than the side of the inscribed equilateral triangle (length √3)? Three different 'natural' methods give 1/2, 1/3, and 1/4.",
    hints: [
      "Method 1 (random endpoints): fix one endpoint, the chord is longer than √3 iff other endpoint is in an arc of 120° out of 360°.",
      "Method 2 (random midpoint): chord longer iff midpoint is within inner circle of radius 1/2.",
      "Method 3 (random radius): fix direction, midpoint is uniformly on radius — longer iff within inner 1/2.",
    ],
    answer: "P = \\frac{1}{3} \\text{ or } \\frac{1}{2} \\text{ depending on interpretation}",
    solutionExplanation:
      "Method 1: Fix one endpoint. Other endpoint uniform on circle. Arc where chord > √3 is 1/3 of circle. P=1/3. Method 2: Midpoint uniform in disk. Midpoints within radius 1/2 disk give chord > √3. P = π(1/2)²/π = 1/4. Method 3: Midpoint uniform on a fixed diameter. P = 1/2. Paradox: 'random' is not well-defined without a sampling method. The Jaynes maximum-entropy solution gives P=1/2 (invariant under translation/rotation).",
    simulationType: "bertrand-chord",
    params: {
      method: { label: "Method (1=endpoints, 2=midpoint, 3=radius)", min: 1, max: 3, step: 1, default: 1 },
      trials: { label: "Simulations", min: 10000, max: 200000, step: 10000, default: 50000 },
    },
  },
  {
    id: "sum-dice",
    title: "Sum of Two Dice = 7 vs 6",
    category: "Combinatorics",
    difficulty: "Easy",
    tags: ["Dice", "Combinatorics", "Basic Probability"],
    source: "Green Book §3.2",
    statement:
      "Roll two fair 6-sided dice. Which sum is most likely: 7 or 6? How many ways can each be achieved? What is the full probability distribution of the sum?",
    hints: [
      "Enumerate all 36 equally likely outcomes.",
      "Count pairs (a,b) where a+b = k for each k from 2 to 12.",
      "Sum=7 can be achieved in 6 ways: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1).",
    ],
    answer: "P(\\text{sum}=7) = \\frac{6}{36} = \\frac{1}{6} \\text{ — most likely sum}",
    solutionExplanation:
      "Distribution of sum S: P(S=k) = (6−|k−7|)/36 for k=2..12. Sum=7 has 6 ways → P=1/6 (most likely). Sum=6 has 5 ways → P=5/36. The distribution is symmetric about 7 and forms a triangle shape.",
    simulationType: "dice-sum",
    params: {
      dice: { label: "Number of Dice", min: 2, max: 6, step: 1, default: 2 },
      sides: { label: "Sides per Die", min: 4, max: 20, step: 1, default: 6 },
      trials: { label: "Simulations", min: 5000, max: 100000, step: 5000, default: 50000 },
    },
  },
  {
    id: "drunkard-walk",
    title: "Drunkard's Walk in 2D",
    category: "Random Walks",
    difficulty: "Medium",
    tags: ["Random Walk", "2D", "Recurrence"],
    source: "Green Book §4.1",
    statement:
      "A drunkard on an infinite 2D grid takes random steps: up, down, left, or right with equal probability. Will they ever return to the origin? What about in 3D?",
    hints: [
      "This is Pólya's recurrence theorem (1921).",
      "In 1D and 2D, the random walk is recurrent — return probability = 1.",
      "In 3D and higher, the walk is transient — return probability < 1.",
    ],
    answer: "P(\\text{return to origin}) = 1 \\text{ in 1D, 2D} \\qquad \\approx 0.3405 \\text{ in 3D}",
    solutionExplanation:
      "Pólya (1921): 1D walk — recurrent (P=1). 2D walk — recurrent (P=1), proven by showing the expected number of returns is infinite. 3D walk — transient; P(ever return) ≈ 0.3405. In d≥3, the walk escapes to infinity. The key: in 2D the walk is 'barely' recurrent due to logarithmic divergence of return probabilities.",
    simulationType: "random-walk-2d",
    params: {
      steps: { label: "Steps per Walk", min: 100, max: 5000, step: 100, default: 1000 },
      walks: { label: "Number of Walks", min: 5, max: 30, step: 1, default: 10 },
    },
  },
  {
    id: "expected-max-rolls",
    title: "Expected Maximum of n Dice Rolls",
    category: "Expected Value",
    difficulty: "Medium",
    tags: ["Order Statistics", "Expected Value", "Dice"],
    source: "Green Book §4.4",
    statement:
      "Roll a fair 6-sided die n times. What is the expected value of the maximum roll? For n=1: obviously 3.5. For n→∞?",
    hints: [
      "P(max ≤ k) = (k/6)^n. So P(max = k) = (k/6)^n − ((k−1)/6)^n.",
      "E[max] = Σ_{k=1}^{6} k · P(max = k).",
      "Alternatively: E[max] = Σ_{k=1}^{5} P(max > k) = Σ P(max ≥ k+1) = 6 − Σ (k/6)^n.",
    ],
    answer: "E[\\max] = \\sum_{k=1}^{6} k \\left[\\left(\\frac{k}{6}\\right)^n - \\left(\\frac{k-1}{6}\\right)^n\\right]",
    solutionExplanation:
      "Using the formula: E[max] = Σ_{k=0}^{5} P(max > k) = Σ_{k=0}^{5} [1−(k/6)^n]. For n=1: 3.5. n=2: 4.47. n=3: 4.96. As n→∞, E[max]→6. The convergence follows the harmonic series.",
    simulationType: "max-dice",
    params: {
      rolls: { label: "Number of Rolls (n)", min: 1, max: 20, step: 1, default: 3 },
      sides: { label: "Die Sides", min: 4, max: 20, step: 1, default: 6 },
      trials: { label: "Simulations", min: 5000, max: 100000, step: 5000, default: 20000 },
    },
  },
  {
    id: "stick-breaking",
    title: "Stick Breaking (Triangle Inequality)",
    category: "Geometric Probability",
    difficulty: "Medium",
    tags: ["Geometric Probability", "Uniform Distribution"],
    source: "Green Book §3.7",
    statement:
      "A stick is broken at two random points uniformly chosen on [0,1]. What is the probability that the three pieces can form a triangle?",
    hints: [
      "Let the two break points be X and Y, both Uniform[0,1]. WLOG assume X<Y.",
      "The three pieces have lengths X, Y−X, 1−Y.",
      "Triangle inequality: each piece < 1/2. P(all three pieces < 1/2) = 1/4.",
    ],
    answer: "P(\\text{forms triangle}) = \\frac{1}{4}",
    solutionExplanation:
      "The two break points X,Y are uniform on [0,1]². The pieces form a triangle iff each piece < 1/2. This requires: X < 1/2, Y − X < 1/2, and 1 − Y < 1/2 (i.e., Y > 1/2). The favorable region has area 1/4 of the unit square. So P = 1/4.",
    simulationType: "stick-breaking",
    params: {
      trials: { label: "Simulations", min: 10000, max: 500000, step: 10000, default: 100000 },
    },
  },
  {
    id: "simpson-paradox",
    title: "Simpson's Paradox",
    category: "Conditional Probability",
    difficulty: "Hard",
    companies: ["Two Sigma", "Citadel"],
    tags: ["Paradox", "Conditional Probability", "Statistics"],
    source: "Classic Statistical Paradox",
    statement:
      "Drug A has a higher success rate than Drug B in both men AND women, but a lower overall success rate. How is this possible? Construct an example with concrete numbers.",
    hints: [
      "The paradox arises from confounding: group sizes differ between treatments.",
      "If Drug A is mostly given to a harder-to-treat group, overall rate drops.",
      "Example: Drug A: men (93/100), women (8/10). Drug B: men (87/100), women (2/10).",
    ],
    answer: "\\text{Aggregation reverses comparison when groups have different sizes}",
    solutionExplanation:
      "Drug A: 93/100 men (93%) + 8/10 women (80%) = 101/110 overall (91.8%). Drug B: 87/100 men (87%) + 2/10 women (20%) = 89/110 overall (80.9%). But if applied differently — Drug A to mostly women (hard cases), Drug B to mostly men (easy cases): overall rates can reverse. Lesson: always check for confounders when aggregating.",
    simulationType: "simpson",
    params: {
      groupASize: { label: "Group A (hard cases %)", min: 10, max: 90, step: 10, default: 80 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "record-values",
    title: "Record Values in a Sequence",
    category: "Expected Value",
    difficulty: "Medium",
    tags: ["Expected Value", "Indicator Variables", "Harmonic Series"],
    source: "Green Book §3.4",
    statement:
      "Shuffle n distinct numbers randomly. A 'record' occurs at position k if the k-th number is the largest so far. What is the expected number of records in a sequence of n numbers?",
    hints: [
      "P(position k is a record) = P(position k is max of first k) = 1/k.",
      "Records are independent across positions.",
      "E[records] = Σ_{k=1}^{n} 1/k = H_n (the n-th harmonic number).",
    ],
    answer: "E[\\text{records}] = H_n = \\sum_{k=1}^{n} \\frac{1}{k} \\approx \\ln n + \\gamma",
    solutionExplanation:
      "Define indicator I_k = 1 if position k is a record. P(I_k=1) = 1/k (the k-th element is the largest of the first k elements). By linearity: E[records] = Σ 1/k = H_n. For n=10: H_10 ≈ 2.93. For n=100: H_100 ≈ 5.19. This is the same as the coupon collector's harmonic series but in a different context.",
    simulationType: "record-values",
    params: {
      seqLength: { label: "Sequence Length (n)", min: 5, max: 100, step: 5, default: 20 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "ruin-unfair",
    title: "Gambler's Ruin — Unfair Game",
    category: "Random Walks",
    difficulty: "Hard",
    tags: ["Random Walk", "Unfair Game", "Geometric Series"],
    source: "Green Book §4.3",
    statement:
      "In Gambler's Ruin, the gambler wins each bet with probability p ≠ 1/2 and loses with q = 1−p. Starting at $k with target $N, what is the probability of reaching $N?",
    hints: [
      "The recurrence is: p_k = p·p_{k+1} + q·p_{k-1} with p_0=0, p_N=1.",
      "Try p_k = r^k. The characteristic equation is p·r² − r + q = 0, roots r=1 and r=q/p.",
      "General solution: p_k = A + B·(q/p)^k.",
    ],
    answer: "p_k = \\frac{1 - (q/p)^k}{1 - (q/p)^N} \\quad (p \\neq \\frac{1}{2})",
    solutionExplanation:
      "Solving the linear recurrence with boundary conditions p_0=0, p_N=1: p_k = (1−(q/p)^k)/(1−(q/p)^N) for p≠1/2, and p_k = k/N for p=1/2. If p > 1/2, the gambler is favored and the success probability increases dramatically. If p < 1/2, the gambler is nearly certain to go broke unless k/N is large.",
    simulationType: "gamblers-ruin-unfair",
    params: {
      winProb: { label: "Win Probability p (×100)", min: 20, max: 80, step: 1, default: 45 },
      startAmount: { label: "Starting Amount (k)", min: 1, max: 50, step: 1, default: 10 },
      targetAmount: { label: "Target (N)", min: 10, max: 100, step: 5, default: 20 },
      trials: { label: "Simulations", min: 500, max: 10000, step: 500, default: 2000 },
    },
  },
  {
    id: "card-order",
    title: "Probability Red Card Before Black",
    category: "Conditional Probability",
    difficulty: "Easy",
    tags: ["Cards", "Symmetry", "Conditional Probability"],
    source: "Green Book §3.1",
    statement:
      "You shuffle a standard 52-card deck. You flip cards until you see a red card. What is the probability the first card is red? What is the probability the top card is a heart?",
    hints: [
      "By symmetry, each arrangement is equally likely.",
      "P(first card red) = 26/52 = 1/2.",
      "P(top card is heart) = 13/52 = 1/4.",
    ],
    answer: "P(\\text{first red}) = \\frac{1}{2} \\qquad P(\\text{first is heart}) = \\frac{1}{4}",
    solutionExplanation:
      "By symmetry of shuffling: P(top card = any specific card) = 1/52. P(first card is red) = 26/52 = 1/2. P(first card is heart) = 13/52 = 1/4. More subtly: P(first red before first black) in any game of this type is always 1/2 by symmetry between red and black suits.",
    simulationType: "card-color",
    params: {
      trials: { label: "Simulations", min: 10000, max: 200000, step: 10000, default: 100000 },
    },
  },
  {
    id: "buffon-needle",
    title: "Buffon's Needle (Estimating π)",
    category: "Geometric Probability",
    difficulty: "Medium",
    tags: ["Geometric Probability", "Monte Carlo", "Pi"],
    source: "Classic Geometric Probability",
    statement:
      "A needle of length L is dropped on a floor with parallel lines spaced D apart (L ≤ D). What is the probability it crosses a line? (This can estimate π!)",
    hints: [
      "The needle's center is uniform in [0, D/2] from nearest line.",
      "The needle's angle θ is uniform in [0, π/2].",
      "It crosses a line if the center distance < (L/2)·sin(θ).",
    ],
    answer: "P(\\text{cross}) = \\frac{2L}{\\pi D} \\qquad \\Rightarrow \\pi \\approx \\frac{2L \\cdot n}{D \\cdot \\text{crossings}}",
    solutionExplanation:
      "P(cross) = (1/(πD/2)) × ∫₀^{π/2} (L/2)sin(θ) dθ = (1/(πD/2)) × (L/2)×[-cos θ]₀^{π/2} = L/(πD/2) × (L/2) = 2L/(πD). For L=D: P = 2/π ≈ 0.637. So π ≈ 2L·(trials)/(D·crossings) — a physical experiment to estimate π!",
    simulationType: "buffon-needle",
    params: {
      needleLength: { label: "Needle Length L (×100)", min: 10, max: 100, step: 10, default: 100 },
      lineSpacing: { label: "Line Spacing D (×100)", min: 100, max: 200, step: 10, default: 100 },
      trials: { label: "Simulations", min: 10000, max: 1000000, step: 10000, default: 100000 },
    },
  },
  {
    id: "three-way-duel",
    title: "Three-Way Duel (Truel)",
    category: "Game Theory",
    difficulty: "Hard",
    companies: ["Jane Street", "Two Sigma"],
    tags: ["Game Theory", "Strategy", "Probability"],
    source: "Green Book §5.1",
    statement:
      "A, B, C duel. A hits with prob 1/3, B with 1/2, C with 1.  Each shoots the biggest threat. A goes first, then B, then C. Who should A shoot at first to maximize survival?",
    hints: [
      "If A shoots at C (most dangerous), C may die but then A faces B with 1/2 accuracy.",
      "If A shoots at B, B may die but A faces C (sure shot) with 1/3 accuracy.",
      "Counterintuitive: A should shoot at the AIR (intentionally miss) in the first round!",
    ],
    answer: "A \\text{ should miss intentionally.  } P(A \\text{ survives}) \\approx 25\\%",
    solutionExplanation:
      "If A shoots C: P(A survives) ≈ 17.8%. If A shoots B: P(A survives) ≈ 18.4%. If A misses: B shoots C (bigger threat), C shoots B if alive. A then faces a wounded opponent. P(A survives) ≈ 25%. Intentionally missing lets B and C eliminate each other first — the weakest player survives longest by staying out of conflicts.",
    simulationType: "truel",
    params: {
      trials: { label: "Simulations", min: 10000, max: 200000, step: 10000, default: 50000 },
    },
  },
  {
    id: "markov-chain-absorbing",
    title: "Absorbing Markov Chain: Expected Steps",
    category: "Random Walks",
    difficulty: "Hard",
    companies: ["Citadel", "D.E. Shaw", "WorldQuant"],
    tags: ["Markov Chain", "Absorbing State", "Linear Algebra"],
    source: "Green Book §4.2",
    statement:
      "A frog jumps on lily pads numbered 0 to N. From pad k (0 < k < N), it jumps to k+1 with prob p and k−1 with prob 1−p. Pads 0 and N are absorbing. Starting at k=1, what is the expected number of jumps to absorption?",
    hints: [
      "Let e_k = expected steps to absorption from state k.",
      "e_k = 1 + p·e_{k+1} + (1-p)·e_{k-1}, with e_0 = e_N = 0.",
      "For p=0.5 (fair): e_k = k(N-k).",
    ],
    answer: "e_k = \\frac{1}{q-p}\\left(k - N\\frac{1-(q/p)^k}{1-(q/p)^N}\\right) \\quad (p \\neq q)",
    solutionExplanation:
      "For fair game (p=q=1/2): e_k = k(N−k). For biased: solve the inhomogeneous recurrence. From state 1 with N=10, p=0.5: e_1 = 1×9 = 9 expected jumps. This is a classic application of the fundamental matrix of absorbing Markov chains.",
    simulationType: "absorbing-markov",
    params: {
      startState: { label: "Start Position (k)", min: 1, max: 19, step: 1, default: 5 },
      totalStates: { label: "Total Pads (N)", min: 5, max: 30, step: 1, default: 10 },
      jumpProb: { label: "P(jump right) ×100", min: 10, max: 90, step: 5, default: 50 },
      trials: { label: "Simulations", min: 500, max: 20000, step: 500, default: 5000 },
    },
  },
  {
    id: "optimal-bet",
    title: "Kelly Criterion: Optimal Bet Size",
    category: "Game Theory",
    difficulty: "Hard",
    companies: ["Citadel", "D.E. Shaw", "Virtu"],
    tags: ["Kelly Criterion", "Expected Value", "Optimization"],
    source: "Green Book §5.3",
    statement:
      "A bet pays 2:1 (win $2 per $1 bet) with probability p=0.6. You have $100. What fraction f of your bankroll should you bet each round to maximize long-run growth? The Kelly Criterion gives the answer.",
    hints: [
      "Growth rate G(f) = p·log(1+f) + (1-p)·log(1-f). Maximize over f.",
      "Differentiate: p/(1+f) − (1-p)/(1-f) = 0.",
      "Solution: f* = p − q/b where b is the net odds and q=1-p.",
    ],
    answer: "f^* = p - \\frac{q}{b} = 0.6 - \\frac{0.4}{2} = 0.4 \\quad (\\text{bet 40\\% of bankroll})",
    solutionExplanation:
      "Kelly Criterion: f* = (bp−q)/b where b=net odds, p=win prob, q=1-p. Here b=2, p=0.6, q=0.4: f*=(2×0.6−0.4)/2 = 0.8/2 = 0.4. Bet 40% each round for maximum geometric growth. Overbetting (f > f*) reduces long-run growth. Full Kelly is theoretically optimal but practitioners often use half-Kelly to reduce variance.",
    simulationType: "kelly-criterion",
    params: {
      winProb: { label: "Win Probability p (×100)", min: 51, max: 95, step: 1, default: 60 },
      odds: { label: "Net Odds b (×10)", min: 10, max: 50, step: 5, default: 20 },
      betFraction: { label: "Bet Fraction f (×100)", min: 5, max: 80, step: 5, default: 40 },
      rounds: { label: "Rounds to Simulate", min: 100, max: 1000, step: 50, default: 200 },
    },
  },
  {
    id: "sum-random-variables",
    title: "Sum of Uniform Random Variables",
    category: "Expected Value",
    difficulty: "Medium",
    tags: ["Uniform Distribution", "CLT", "Irwin-Hall"],
    source: "Green Book §4.4",
    statement:
      "Let X₁, X₂, …, Xₙ be i.i.d. Uniform[0,1]. What is the expected number of terms needed for their sum to exceed 1? What distribution does the sum follow?",
    hints: [
      "P(X₁ + … + Xₙ ≤ 1) = 1/n! (by Irwin-Hall distribution).",
      "E[N] where N = min{n: X₁+…+Xₙ > 1} = e ≈ 2.718.",
      "The sum X₁+…+Xₙ follows the Irwin-Hall distribution; CLT kicks in quickly.",
    ],
    answer: "E[N] = e \\approx 2.718 \\quad \\text{(number of U[0,1] to exceed 1)}",
    solutionExplanation:
      "E[N] = Σ_{n=0}^∞ P(X₁+…+Xₙ ≤ 1) = Σ_{n=0}^∞ 1/n! = e. Beautiful result! The sum of n uniform[0,1] variables follows Irwin-Hall distribution. As n grows, by CLT it approaches Normal(n/2, n/12). The convergence is very fast — by n=12 it's nearly Normal.",
    simulationType: "sum-uniforms",
    params: {
      trials: { label: "Simulations", min: 10000, max: 500000, step: 10000, default: 100000 },
    },
  },
  {
    id: "runs-test",
    title: "Runs in a Sequence",
    category: "Combinatorics",
    difficulty: "Medium",
    tags: ["Runs", "Combinatorics", "Sequences"],
    source: "Green Book §3.2",
    statement:
      "Flip a fair coin n times. A 'run' is a maximal consecutive sequence of identical outcomes (e.g., HHH is one run of length 3). What is the expected number of runs in n flips?",
    hints: [
      "A new run starts at position 1, and at position k>1 if flip k ≠ flip k-1.",
      "P(new run at position k) = 1/2 for k > 1.",
      "E[runs] = 1 + (n-1)/2 = (n+1)/2.",
    ],
    answer: "E[\\text{runs}] = \\frac{n+1}{2}",
    solutionExplanation:
      "Position 1 always starts a run. For positions k=2,...,n: a new run starts iff flip k ≠ flip k-1, which has probability 1/2. By linearity: E[runs] = 1 + (n-1)·(1/2) = (n+1)/2. For n=10: E[runs] = 5.5. Variance = (n-1)/4.",
    simulationType: "coin-runs",
    params: {
      flips: { label: "Number of Flips (n)", min: 10, max: 200, step: 10, default: 20 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "negative-hypergeometric",
    title: "Negative Hypergeometric: Drawing Until Red",
    category: "Expected Value",
    difficulty: "Medium",
    tags: ["Negative Hypergeometric", "Expected Value", "Sampling"],
    source: "Green Book §3.5",
    statement:
      "An urn has R red and B blue balls. You draw without replacement until you get the first red ball. What is the expected number of draws?",
    hints: [
      "By symmetry, the expected position of the first red ball among all R+B draws.",
      "The first red ball is equally likely to be in any of the R+B positions.",
      "E[first red] = (R+B+1)/(R+1) by symmetry of order statistics.",
    ],
    answer: "E[\\text{draws until first red}] = \\frac{R + B + 1}{R + 1}",
    solutionExplanation:
      "By symmetry, the positions of R red balls are uniformly distributed among R+B positions. The expected position of the smallest (first red) is (R+B+1)/(R+1). Example: 4 red, 10 blue → E = 15/5 = 3 draws. This generalizes to expected draws until k-th red: k(R+B+1)/(R+1).",
    simulationType: "draw-until-red",
    params: {
      redBalls: { label: "Red Balls (R)", min: 1, max: 20, step: 1, default: 4 },
      blueBalls: { label: "Blue Balls (B)", min: 1, max: 40, step: 1, default: 10 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "geometric-waiting",
    title: "Waiting for r Successes (Negative Binomial)",
    category: "Expected Value",
    difficulty: "Medium",
    tags: ["Negative Binomial", "Expected Value", "Geometric"],
    source: "Green Book §3.5",
    statement:
      "A factory has 5% defect rate. How many items do you need to inspect to find 3 defective ones? What is the expected number and the variance?",
    hints: [
      "This follows a Negative Binomial distribution: waiting for r successes with prob p.",
      "E[trials] = r/p.",
      "Var[trials] = r(1-p)/p².",
    ],
    answer: "E[\\text{trials}] = \\frac{r}{p} = \\frac{3}{0.05} = 60 \\quad \\text{Var} = \\frac{r(1-p)}{p^2} = 1140",
    solutionExplanation:
      "Negative Binomial NB(r,p): waiting for r successes with success prob p each trial. E[N] = r/p = 3/0.05 = 60. Var[N] = r(1-p)/p² = 3×0.95/0.0025 = 1140. This is a sum of r independent geometric(p) variables, so mean = r×(1/p) by linearity.",
    simulationType: "neg-binomial",
    params: {
      successesNeeded: { label: "Successes Needed (r)", min: 1, max: 10, step: 1, default: 3 },
      successProb: { label: "P(success) ×100", min: 1, max: 50, step: 1, default: 5 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "poisson-approximation",
    title: "Poisson Approximation to Binomial",
    category: "Conditional Probability",
    difficulty: "Medium",
    tags: ["Poisson", "Binomial", "Approximation"],
    source: "Green Book §4.6",
    statement:
      "In a call center, calls arrive at rate λ=3 per minute. What is the probability of exactly k calls in a minute? When does the Poisson approximation to Binomial apply?",
    hints: [
      "Poisson(λ): P(X=k) = e^{-λ}λ^k/k!",
      "Binomial(n,p) ≈ Poisson(λ=np) when n large, p small.",
      "P(X=3 | λ=3) = e^{-3}·27/6 ≈ 22.4%.",
    ],
    answer: "P(X = k) = \\frac{e^{-\\lambda}\\lambda^k}{k!} \\qquad E[X] = \\text{Var}[X] = \\lambda",
    solutionExplanation:
      "Poisson is the limit of Binomial(n,p) as n→∞, p→0, np→λ. P(X=3|λ=3) = e⁻³×3³/3! ≈ 0.224. Key property: mean = variance = λ. Poisson processes have memoryless exponential inter-arrival times. Rule of thumb: Binomial → Poisson when n≥20 and p≤0.05.",
    simulationType: "poisson",
    params: {
      lambda: { label: "Rate λ (×10)", min: 1, max: 50, step: 1, default: 30 },
      trials: { label: "Simulations", min: 5000, max: 100000, step: 5000, default: 50000 },
    },
  },
  {
    id: "martingale-doublng",
    title: "Martingale Doubling Strategy",
    category: "Game Theory",
    difficulty: "Medium",
    companies: ["Citadel", "Two Sigma"],
    tags: ["Martingale", "Strategy", "Risk"],
    source: "Green Book §4.2",
    statement:
      "The Martingale strategy: in a fair coin game, bet $1; if you lose, double your bet each time until you win. You always net $1 per sequence. But what is the risk? What if the casino has a $1024 maximum bet?",
    hints: [
      "Expected profit per game is $1 (you always win $1 eventually).",
      "But: P(need more than k flips) = (1/2)^k. With max bet $1024 (2^10): P(table limit) = 1/1024.",
      "Expected loss when table limit hit: −$1023.",
    ],
    answer: "E[\\text{profit}] = 0 \\quad \\text{(fair game — the bet size doesn't help)}",
    solutionExplanation:
      "Despite always winning $1 per cycle, the Martingale fails: with a $1024 cap (10 doubles), P(ruin) = 1/1024 ≈ 0.1%. Expected profit = 1×(1023/1024) + (−1023)×(1/1024) = 0. The strategy is a net-zero martingale — the large rare loss exactly cancels the frequent small gains. In practice with house edge, it's negative EV.",
    simulationType: "martingale",
    params: {
      maxBet: { label: "Max Bet ($)", min: 32, max: 4096, step: 32, default: 1024 },
      startBet: { label: "Starting Bet ($)", min: 1, max: 32, step: 1, default: 1 },
      rounds: { label: "Rounds", min: 100, max: 10000, step: 100, default: 1000 },
    },
  },
  {
    id: "brownian-max",
    title: "Maximum of Brownian Motion",
    category: "Random Walks",
    difficulty: "Hard",
    tags: ["Brownian Motion", "Reflection Principle", "Maximum"],
    source: "Green Book §4.5",
    statement:
      "Let M_T = max_{0≤t≤T} B_t where B_t is standard Brownian motion. What is the distribution of M_T? What is P(M_T > a)?",
    hints: [
      "By the reflection principle: P(M_T ≥ a) = 2·P(B_T ≥ a) for a > 0.",
      "P(M_T ≥ a) = 2·(1 − Φ(a/√T)) where Φ is the standard normal CDF.",
      "The distribution of M_T is the same as |B_T| (half-normal distribution).",
    ],
    answer: "P(M_T \\geq a) = 2\\Phi\\left(-\\frac{a}{\\sqrt{T}}\\right) = 2\\left(1 - \\Phi\\left(\\frac{a}{\\sqrt{T}}\\right)\\right)",
    solutionExplanation:
      "The reflection principle: any path that reaches level a by time T either ends above a, or can be reflected to end above a. P(M_T ≥ a) = 2P(B_T ≥ a) = 2(1−Φ(a/√T)). The distribution of M_T is the same as |B_T|, a folded normal (half-normal). E[M_T] = √(2T/π).",
    simulationType: "brownian-max",
    params: {
      timeHorizon: { label: "Time Horizon T (×10)", min: 1, max: 50, step: 1, default: 10 },
      barrier: { label: "Barrier a (×10)", min: 5, max: 50, step: 5, default: 20 },
      trials: { label: "Simulations", min: 5000, max: 100000, step: 5000, default: 20000 },
    },
  },
  {
    id: "birthday-same-month",
    title: "Birthday: Same Month",
    category: "Combinatorics",
    difficulty: "Easy",
    tags: ["Birthday", "Combinatorics", "Pigeonhole"],
    source: "Green Book §3.2",
    statement:
      "How many people do you need to guarantee (100%) that two share a birth month? How many do you need so the probability exceeds 50%? (12 months, assume uniform distribution)",
    hints: [
      "Guarantee: Pigeonhole — 12 months, so 13 people guarantees a match.",
      "P(no match) = (12/12)·(11/12)·(10/12)·…",
      "For 50%: find n where P(no match) < 0.5.",
    ],
    answer: "\\text{Guarantee: 13 people} \\qquad \\text{50\\% threshold: n = 5}",
    solutionExplanation:
      "P(all different months among n) = (12/12)·(11/12)·…·((12−n+1)/12). For n=5: P(all diff) = 12·11·10·9·8/12^5 ≈ 38.2%, so P(match) ≈ 61.8% > 50%. For n=4: P(match) ≈ 42.7% < 50%. Answer: 5 people gives >50% chance. 13 guarantees it by Pigeonhole.",
    simulationType: "birthday-month",
    params: {
      people: { label: "People in Group", min: 2, max: 20, step: 1, default: 5 },
      trials: { label: "Simulations", min: 5000, max: 100000, step: 5000, default: 20000 },
    },
  },
  {
    id: "coin-game-stopping",
    title: "Coin Game: Stop at Profit",
    category: "Stopping Problems",
    difficulty: "Medium",
    tags: ["Optimal Stopping", "Expected Value", "Coin"],
    source: "Jane Street Interview",
    statement:
      "You toss a fair coin. You get +$1 for heads, -$1 for tails. You can stop at any time and collect your current profit (min $0). What is the optimal strategy and expected payout?",
    hints: [
      "You should stop as soon as you're ahead. But by symmetry, you'll always eventually get ahead.",
      "With optimal stopping: stop at first time profit > 0.",
      "This is the optimal stopping version of Gambler's Ruin.",
    ],
    answer: "E[\\text{payout with optimal stop}] = \\infty \\text{ (stop when first positive)}",
    solutionExplanation:
      "If you must stop at some fixed time T, optimal strategy is to stop when ahead. Since the walk is recurrent, you'll eventually be positive (in expectation). However, if there's a deadline, the problem becomes complex. For the unlimited version: since you stop at first positive, E[payout] = E[first return above 0] which by random walk theory gives E[payout]→∞ but the typical payout is O(1).",
    simulationType: "coin-profit",
    params: {
      maxSteps: { label: "Max Steps Before Forced Stop", min: 10, max: 500, step: 10, default: 100 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "normal-dist-prob",
    title: "Standard Normal Probabilities",
    category: "Expected Value",
    difficulty: "Easy",
    tags: ["Normal Distribution", "Z-Score", "CDF"],
    source: "Green Book §4.4",
    statement:
      "X ~ N(0,1). Compute: P(X > 1), P(|X| > 2), P(X > 0 | X > −1). Also: if returns are normally distributed with μ=10%, σ=20%, what is P(return > 0)?",
    hints: [
      "P(X > 1) = 1 − Φ(1) ≈ 15.87%.",
      "P(|X| > 2) ≈ 4.55% (the '2-sigma' rule).",
      "P(X > 0 | X > −1) = P(X > 0)/P(X > −1) = 0.5/Φ(1) ≈ 62.6%.",
    ],
    answer: "P(X>1) \\approx 15.9\\% \\quad P(|X|>2) \\approx 4.6\\% \\quad P(|X|>3) \\approx 0.3\\%",
    solutionExplanation:
      "Key normal distribution facts: P(|X|<1σ)≈68%, P(|X|<2σ)≈95.4%, P(|X|<3σ)≈99.7% (the 68-95-99.7 rule). For returns N(10%,20%): P(return>0) = P(Z > -0.5) = Φ(0.5) ≈ 69.1%. Conditional: P(X>0|X>-1) = P(0<X)/P(X>-1) = 0.5/Φ(1) ≈ 0.5/0.841 ≈ 59.4%.",
    simulationType: "normal-probabilities",
    params: {
      zScore: { label: "Z-score threshold (×10)", min: -30, max: 30, step: 5, default: 10 },
      trials: { label: "Simulations", min: 10000, max: 500000, step: 10000, default: 100000 },
    },
  },
  {
    id: "geometric-distribution",
    title: "Memoryless Property of Geometric",
    category: "Conditional Probability",
    difficulty: "Easy",
    tags: ["Geometric Distribution", "Memoryless", "Conditional"],
    source: "Green Book §3.5",
    statement:
      "A geometric random variable X (number of trials until first success, p=0.3) has the memoryless property. Given you've failed 5 times already, the remaining waiting time has the same distribution. Prove this and compute P(X > 10 | X > 5).",
    hints: [
      "P(X > n) = (1-p)^n for geometric distribution.",
      "P(X > m+n | X > n) = P(X > m) by the memoryless property.",
      "P(X > 10 | X > 5) = P(X > 5) = (0.7)^5.",
    ],
    answer: "P(X > 10 | X > 5) = P(X > 5) = (1-p)^5 = 0.7^5 \\approx 16.8\\%",
    solutionExplanation:
      "P(X>10|X>5) = P(X>10∩X>5)/P(X>5) = P(X>10)/P(X>5) = (0.7)^10/(0.7)^5 = (0.7)^5 ≈ 0.168. This is exactly P(X>5)! The geometric distribution is the unique discrete memoryless distribution, just as the exponential is the unique continuous memoryless distribution.",
    simulationType: "geometric-memoryless",
    params: {
      successProb: { label: "P(success) ×100", min: 5, max: 90, step: 5, default: 30 },
      givenFailures: { label: "Given Failures (n)", min: 1, max: 20, step: 1, default: 5 },
      extraSteps: { label: "Extra Steps (m)", min: 1, max: 20, step: 1, default: 5 },
      trials: { label: "Simulations", min: 5000, max: 100000, step: 5000, default: 50000 },
    },
  },
  {
    id: "random-triangle",
    title: "Random Points in a Triangle",
    category: "Geometric Probability",
    difficulty: "Medium",
    tags: ["Geometric Probability", "Uniform Distribution"],
    source: "Green Book §3.7",
    statement:
      "Three points are chosen uniformly at random inside a square. What is the probability that the triangle they form contains the center of the square?",
    hints: [
      "By symmetry, consider each point's position relative to center.",
      "Each point is equally likely to be in any of the 4 quadrants.",
      "The triangle contains center iff the three points are not all in a half-plane.",
    ],
    answer: "P(\\text{triangle contains center}) = \\frac{1}{4}",
    solutionExplanation:
      "For a convex region symmetric about center O: P(random triangle contains O) = 1/4. Proof via the ham-sandwich argument: for each configuration, consider the antipodal points. The triangle contains center iff no half-plane through center contains all three points — probability 1/4 by symmetry of the 2^3=8 sign combinations.",
    simulationType: "random-triangle",
    params: {
      trials: { label: "Simulations", min: 10000, max: 500000, step: 10000, default: 100000 },
    },
  },
  {
    id: "exponential-min",
    title: "Minimum of Exponential Random Variables",
    category: "Expected Value",
    difficulty: "Medium",
    tags: ["Exponential Distribution", "Minimum", "Memoryless"],
    source: "Green Book §4.6",
    statement:
      "X₁ ~ Exp(λ₁) and X₂ ~ Exp(λ₂) are independent. What is the distribution of min(X₁,X₂)? What is E[min(X₁,X₂)]? Which event is more likely: X₁ < X₂?",
    hints: [
      "P(min > t) = P(X₁ > t)·P(X₂ > t) = e^{-(λ₁+λ₂)t}.",
      "So min(X₁,X₂) ~ Exp(λ₁+λ₂).",
      "P(X₁ < X₂) = λ₁/(λ₁+λ₂).",
    ],
    answer: "\\min(X_1,X_2) \\sim \\text{Exp}(\\lambda_1+\\lambda_2) \\qquad P(X_1 < X_2) = \\frac{\\lambda_1}{\\lambda_1+\\lambda_2}",
    solutionExplanation:
      "Key results: (1) min of independent exponentials is exponential with rate = sum of rates. (2) P(X₁<X₂) = λ₁/(λ₁+λ₂). These are fundamental in queuing theory, reliability, and race conditions. E[min] = 1/(λ₁+λ₂). For equal rates: E[min(X,X)] = 1/(2λ) = E[X]/2.",
    simulationType: "exp-minimum",
    params: {
      lambda1: { label: "Rate λ₁ (×10)", min: 1, max: 50, step: 1, default: 10 },
      lambda2: { label: "Rate λ₂ (×10)", min: 1, max: 50, step: 1, default: 20 },
      trials: { label: "Simulations", min: 5000, max: 100000, step: 5000, default: 20000 },
    },
  },
  {
    id: "correlation-causation",
    title: "Regression to the Mean",
    category: "Expected Value",
    difficulty: "Medium",
    tags: ["Regression", "Correlation", "Statistics"],
    source: "Green Book §4.7",
    statement:
      "A student scores 95 on exam 1 (top 5%). Their expected score on exam 2 (assuming identical independent exams) is NOT 95 but closer to the mean. If scores are Normal with correlation ρ=0.7 between exams, what is E[score 2 | score 1 = 95]?",
    hints: [
      "For bivariate normal: E[Y|X=x] = μ_Y + ρ·(σ_Y/σ_X)·(x − μ_X).",
      "With μ=70, σ=15, ρ=0.7: E[Y|X=95] = 70 + 0.7·(95−70) = 70 + 17.5 = 87.5.",
      "The 'regression to the mean' phenomenon — extreme scores partially reflect luck.",
    ],
    answer: "E[\\text{score 2} | \\text{score 1} = 95] = \\mu + \\rho(x - \\mu) = 87.5",
    solutionExplanation:
      "Regression to the mean: E[Y|X=x] = μ + ρ(x−μ). For x=95, μ=70, ρ=0.7: E[Y|X=95] = 70 + 0.7×25 = 87.5. The student's expected score regresses 30% of the way back to the mean. This explains why top performers often 'regress' — their extreme score contained a luck component. Galton discovered this in 1886.",
    simulationType: "regression-mean",
    params: {
      correlation: { label: "Correlation ρ (×100)", min: 0, max: 100, step: 5, default: 70 },
      score1: { label: "Score 1 (x)", min: 50, max: 100, step: 5, default: 95 },
      trials: { label: "Simulations", min: 5000, max: 100000, step: 5000, default: 20000 },
    },
  },
  {
    id: "banach-matchbox",
    title: "Banach Matchbox Problem",
    category: "Expected Value",
    difficulty: "Hard",
    tags: ["Expected Value", "Negative Binomial", "Classic"],
    source: "Green Book §3.5",
    statement:
      "A mathematician carries two matchboxes, each with n matches. Each time they need a match, they pick a box at random. When they first find an empty box, how many matches are expected in the other box?",
    hints: [
      "Let X = number in the other box when first empty found.",
      "E[X] ≈ √(πn/2) − 1/2 for large n (by Stirling's approximation).",
      "The exact formula involves a sum using the negative binomial distribution.",
    ],
    answer: "E[X] \\approx \\sqrt{\\frac{\\pi n}{2}} - \\frac{1}{2} \\approx 1.253\\sqrt{n}",
    solutionExplanation:
      "Exact: E[remaining] = 2n·C(2n,n)·(1/2)^(2n) − 1 ≈ √(πn/2) − 1 by Stirling. For n=50: E ≈ √(25π) ≈ 8.86. The probability the other box has k matches when first empty box found is C(2n−k,n)·(1/2)^(2n−k+1) for k=0,...,n. This is a classic problem due to Stefan Banach.",
    simulationType: "banach-matchbox",
    params: {
      matchesPerBox: { label: "Matches per Box (n)", min: 10, max: 200, step: 10, default: 50 },
      trials: { label: "Simulations", min: 1000, max: 20000, step: 1000, default: 5000 },
    },
  },
  {
    id: "conditional-expectation-tower",
    title: "Tower Property: Compound Expectation",
    category: "Expected Value",
    difficulty: "Medium",
    tags: ["Conditional Expectation", "Tower Property", "LLN"],
    source: "Green Book §3.3",
    statement:
      "A bus arrives at a random time uniform on [0,60] minutes. You arrive at a random time uniform on [0,60] minutes. What is the expected wait? If you know the bus runs every U ~ Uniform[10,30] minutes, what is the expected wait given you just missed one?",
    hints: [
      "E[wait | bus interval = u] = u/2 (average wait is half the interval).",
      "E[wait] = E[E[wait | U]] = E[U/2] = E[U]/2 = 20/2 = 10 minutes.",
      "The inspection paradox: intervals you land in are biased towards longer ones!",
    ],
    answer: "E[\\text{wait}] = E[U]/2 = 10 \\text{ min} \\quad \\text{(without inspection paradox)}",
    solutionExplanation:
      "By the tower property E[W] = E[E[W|U]] = E[U/2] = E[U]/2. If U~Uniform[10,30]: E[U]=20, E[W]=10. However, the inspection paradox: if you arrive at a random time and the bus interval is random, you're more likely to land in a longer interval. This increases the actual expected wait above E[U]/2.",
    simulationType: "bus-wait",
    params: {
      minInterval: { label: "Min Interval (min)", min: 5, max: 30, step: 5, default: 10 },
      maxInterval: { label: "Max Interval (min)", min: 15, max: 60, step: 5, default: 30 },
      trials: { label: "Simulations", min: 5000, max: 100000, step: 5000, default: 20000 },
    },
  },
  {
    id: "optimal-stopping-uniform",
    title: "Optimal Stopping: One Chance to Accept",
    category: "Stopping Problems",
    difficulty: "Medium",
    companies: ["Jane Street", "D.E. Shaw", "Squarepoint"],
    tags: ["Optimal Stopping", "Uniform Distribution", "Threshold"],
    source: "Green Book §5.2",
    statement:
      "You observe n offers from Uniform[0,1] one at a time. You can accept or reject immediately. You want to maximize the expected value of the accepted offer. What is the optimal threshold strategy?",
    hints: [
      "With 1 offer left: always accept (no choice). E = 1/2.",
      "With 2 offers left: accept if current > E[best of 1 remaining] = 1/2.",
      "With k offers left: accept if offer > threshold t_k = E[max of k-1 uniforms].",
    ],
    answer: "\\text{Threshold with } k \\text{ left: } t_k = \\frac{k-1}{k} \\cdot t_{k-1} + \\frac{1}{k}",
    solutionExplanation:
      "Optimal thresholds: t_1 = 0 (accept anything), t_2 = 1/2, t_3 = max(0, ...). In general, E[optimal with n offers] = 1 - 1/n + 1/(2n²) + ... → 1 as n→∞. For n=10: E ≈ 0.726. The optimal strategy dramatically outperforms random selection (E=0.5).",
    simulationType: "optimal-stopping-uniform",
    params: {
      offers: { label: "Number of Offers (n)", min: 2, max: 20, step: 1, default: 5 },
      trials: { label: "Simulations", min: 5000, max: 100000, step: 5000, default: 20000 },
    },
  },
  {
    id: "law-large-numbers",
    title: "Law of Large Numbers Demo",
    category: "Expected Value",
    difficulty: "Easy",
    tags: ["LLN", "Convergence", "Expected Value"],
    source: "Green Book §4.6",
    statement:
      "Roll a fair 6-sided die repeatedly. The sample mean should converge to 3.5. How many rolls until you're within 0.1 of the true mean with 95% probability? (Law of Large Numbers in action)",
    hints: [
      "By LLN, sample mean X̄_n → μ = 3.5 as n → ∞.",
      "By CLT: X̄_n ≈ Normal(μ, σ²/n) where σ² = Var(die) = 35/12.",
      "For 95% confidence within ε=0.1: n ≥ (1.96·σ/ε)² ≈ 1,126.",
    ],
    answer: "n \\approx \\left(\\frac{1.96\\sigma}{\\varepsilon}\\right)^2 \\approx 1126 \\text{ rolls for 95\\% CI within 0.1}",
    solutionExplanation:
      "σ² = Var(die) = E[X²] - E[X]² = 91/6 - 12.25 = 35/12 ≈ 2.917. σ ≈ 1.708. For ε=0.1, 95% CI: n = (1.96×1.708/0.1)² ≈ (33.5)² ≈ 1122. The LLN guarantees convergence but the CLT tells us the rate: SE = σ/√n decreases as 1/√n.",
    simulationType: "lln-demo",
    params: {
      sides: { label: "Die Sides", min: 4, max: 20, step: 1, default: 6 },
      maxRolls: { label: "Max Rolls", min: 100, max: 5000, step: 100, default: 1000 },
    },
  },
  {
    id: "poisson-process-arrivals",
    title: "Poisson Process: Arrival Times",
    category: "Expected Value",
    difficulty: "Medium",
    tags: ["Poisson Process", "Exponential", "Arrival Times"],
    source: "Green Book §4.6",
    statement:
      "Customers arrive at rate λ=2 per minute (Poisson process). Given exactly 3 customers arrive in [0,5] minutes, what is the distribution of their arrival times? What is the expected time of the 2nd arrival?",
    hints: [
      "Given N(T)=n, the n arrival times are i.i.d. Uniform[0,T].",
      "Given 3 arrivals in [0,5], times are 3 i.i.d. Uniform[0,5] — order statistics!",
      "E[2nd arrival time | 3 arrivals in 5 min] = E[U_(2)] = 2·5/(3+1) = 2.5.",
    ],
    answer: "E[t_{(k)} | N(T)=n] = \\frac{kT}{n+1} \\qquad E[t_{(2)} | N(5)=3] = 2.5 \\text{ min}",
    solutionExplanation:
      "Conditional on n arrivals in [0,T], the arrival times are the order statistics of n U[0,T] draws. E[k-th order stat] = kT/(n+1). For the 2nd of 3 arrivals in 5 min: E = 2×5/4 = 2.5 min. Unconditionally, inter-arrival times are i.i.d. Exp(λ), so the k-th arrival time ~ Gamma(k, λ) with mean k/λ.",
    simulationType: "poisson-arrivals",
    params: {
      arrivalRate: { label: "Arrival Rate λ (×10)", min: 5, max: 50, step: 5, default: 20 },
      timeWindow: { label: "Time Window T (×10)", min: 10, max: 100, step: 10, default: 50 },
      trials: { label: "Simulations", min: 5000, max: 100000, step: 5000, default: 20000 },
    },
  },
];
