import { EXTRA_PROBLEMS } from "./problems-extra";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Problem = {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  tags: string[];
  companies?: string[];
  statement: string;
  hints: string[];
  answer: string;
  solutionExplanation: string;
  simulationType: string;
  params: Record<string, { label: string; min: number; max: number; step: number; default: number }>;
  source?: string;
};

export const CATEGORIES = [
  "All",
  "Conditional Probability",
  "Expected Value",
  "Combinatorics",
  "Random Walks",
  "Paradoxes",
  "Stopping Problems",
  "Game Theory",
  "Geometric Probability",
];

export const PROBLEMS: Problem[] = [
  {
    id: "monty-hall",
    title: "Monty Hall Problem",
    category: "Conditional Probability",
    difficulty: "Easy",
    tags: ["Bayes", "Conditional Probability", "Classic"],
    companies: ["Jane Street", "Two Sigma", "Citadel"],
    source: "Green Book §3.1",
    statement:
      "You're on a game show. There are 3 doors: behind one is a car, behind the others are goats. You pick door 1. The host, who knows what's behind each door, opens door 3 (a goat). Should you switch to door 2 or stay with door 1? What is the probability of winning if you switch?",
    hints: [
      "Think about what information the host's action reveals.",
      "Enumerate all equally likely initial configurations.",
      "P(win | switch) = P(car behind door you didn't pick initially)",
    ],
    answer: "\\frac{2}{3} \\text{ if you switch, } \\frac{1}{3} \\text{ if you stay}",
    solutionExplanation:
      "Initially, P(car behind door 1) = 1/3 and P(car behind door 2 or 3) = 2/3. When the host reveals a goat behind door 3, the probability 2/3 collapses entirely onto door 2. So switching wins with probability 2/3. Formally, by Bayes' theorem: P(car=2 | host opens 3) = 2/3.",
    simulationType: "monty-hall",
    params: {
      trials: { label: "Simulations", min: 100, max: 50000, step: 100, default: 10000 },
    },
  },
  {
    id: "birthday-problem",
    title: "Birthday Problem",
    category: "Combinatorics",
    difficulty: "Easy",
    tags: ["Combinatorics", "Probability", "Classic"],
    companies: ["Optiver", "Citadel", "DRW"],
    source: "Green Book §3.2",
    statement:
      "How many people do you need in a room before the probability that at least two share a birthday exceeds 50%? Assume 365 days in a year, all equally likely.",
    hints: [
      "It's easier to compute P(no shared birthday) = 1 - P(at least one match).",
      "P(all distinct) = \\frac{365}{365} \\cdot \\frac{364}{365} \\cdot \\frac{363}{365} \\cdots",
      "The answer is surprisingly small — think about pairs, not individuals.",
    ],
    answer: "\\text{23 people for } P > 50\\%",
    solutionExplanation:
      "P(no match among n people) = ∏_{k=0}^{n-1} (365-k)/365. For n=23: P(no match) ≈ 0.4927, so P(match) ≈ 50.7%. The answer is 23. For n=70, the probability exceeds 99.9%.",
    simulationType: "birthday",
    params: {
      people: { label: "People in Room", min: 2, max: 100, step: 1, default: 23 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "gamblers-ruin",
    title: "Gambler's Ruin",
    category: "Random Walks",
    difficulty: "Medium",
    tags: ["Random Walk", "Martingale", "Classic"],
    companies: ["Jane Street", "Susquehanna"],
    source: "Green Book §4.3",
    statement:
      "A gambler starts with \\$k and plays a fair coin-flip game. Each flip they win \\$1 or lose \\$1. They stop when they reach \\$N or go broke (\\$0). What is the probability of reaching \\$N?",
    hints: [
      "Let p_k = P(reach N | start at k). What boundary conditions do you have?",
      "For a fair game, p_k satisfies: p_k = (p_{k-1} + p_{k+1}) / 2",
      "This is a linear recurrence. The solution is p_k = k/N.",
    ],
    answer: "p_k = \\frac{k}{N}",
    solutionExplanation:
      "For a fair game (p=0.5), the probability of ruin starting at $k is (N-k)/N, and probability of reaching $N is k/N. This follows from the recurrence p_k = 0.5·p_{k-1} + 0.5·p_{k+1} with boundary conditions p_0=0, p_N=1. The linear solution p_k = k/N satisfies both.",
    simulationType: "gamblers-ruin",
    params: {
      startAmount: { label: "Starting Amount ($k)", min: 1, max: 50, step: 1, default: 10 },
      targetAmount: { label: "Target Amount ($N)", min: 5, max: 100, step: 5, default: 20 },
      trials: { label: "Simulations", min: 100, max: 10000, step: 100, default: 2000 },
    },
  },
  {
    companies: ["Two Sigma", "Citadel"],
    id: "coupon-collector",
    title: "Coupon Collector",
    category: "Expected Value",
    difficulty: "Medium",
    tags: ["Expected Value", "Harmonic Series", "Classic"],
    source: "Green Book §3.5",
    statement:
      "Each cereal box contains one of n different coupons, equally likely. How many boxes do you expect to buy before collecting all n coupons?",
    hints: [
      "Think about the expected number of boxes to get the k-th new coupon given you have k-1.",
      "When you have k-1 coupons, P(new coupon) = (n-k+1)/n.",
      "Sum up the expected waiting times for each new coupon.",
    ],
    answer: "E[T] = n \\cdot H_n = n \\sum_{k=1}^{n} \\frac{1}{k} \\approx n \\ln n",
    solutionExplanation:
      "The expected time to get the k-th new coupon is n/(n-k+1). Total expected time = n·(1 + 1/2 + 1/3 + ... + 1/n) = n·H_n where H_n is the n-th harmonic number. For n=50, E[T] ≈ 224.5 boxes.",
    simulationType: "coupon-collector",
    params: {
      coupons: { label: "Number of Coupons (n)", min: 2, max: 100, step: 1, default: 10 },
      trials: { label: "Simulations", min: 500, max: 20000, step: 500, default: 5000 },
    },
  },
  {
    id: "boy-or-girl",
    title: "Boy or Girl Paradox",
    category: "Conditional Probability",
    difficulty: "Easy",
    tags: ["Bayes", "Conditional Probability", "Paradox"],
    companies: ["Jane Street", "Virtu"],
    source: "Green Book §3.3",
    statement:
      "A family has two children. You learn that at least one is a boy. What is the probability that both children are boys? (Variant B: You meet one child who is a boy — what is P(both boys)?)",
    hints: [
      "List all equally likely two-child outcomes: BB, BG, GB, GG.",
      "Conditioning on 'at least one boy' removes GG from the sample space.",
      "For variant B: meeting a specific child changes the conditioning event.",
    ],
    answer: "\\frac{1}{3} \\text{ (at least one boy)} \\quad \\frac{1}{2} \\text{ (you meet a boy)}",
    solutionExplanation:
      "Sample space: {BB, BG, GB, GG} each with prob 1/4. Given 'at least one boy': space = {BB, BG, GB}. P(BB | at least one boy) = (1/4)/(3/4) = 1/3. But if you meet a specific child who is a boy, you're conditioning on a specific child being a boy, giving P(BB) = 1/2. The difference is the conditioning event.",
    simulationType: "boy-or-girl",
    params: {
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 20000 },
    },
  },
  {
    id: "secretary-problem",
    title: "Secretary Problem",
    category: "Stopping Problems",
    companies: ["Jane Street", "DE Shaw", "Two Sigma"],
    difficulty: "Hard",
    tags: ["Optimal Stopping", "Strategy", "Classic"],
    source: "Green Book §5.2",
    statement:
      "You interview n candidates one by one in random order. After each interview you must immediately accept or reject. You can't go back. What strategy maximizes your probability of hiring the best candidate?",
    hints: [
      "Reject the first r candidates (observation phase), then accept the next one better than all previous.",
      "The optimal r satisfies: r/n → 1/e as n → ∞.",
      "The maximum probability of success converges to 1/e ≈ 36.8%.",
    ],
    answer: "\\text{Skip first } \\lfloor n/e \\rfloor \\text{ candidates. P(success)} \\to \\frac{1}{e} \\approx 36.8\\%",
    solutionExplanation:
      "The optimal strategy: observe (and reject) the first r* = ⌊n/e⌋ candidates, then hire the next candidate who is better than all observed. The probability of success = (r/n)·Σ_{k=r}^{n-1} 1/(k) → 1/e as n→∞. For n=100, skip first 37, success probability ≈ 36.8%.",
    simulationType: "secretary",
    params: {
      candidates: { label: "Number of Candidates (n)", min: 5, max: 200, step: 5, default: 50 },
      trials: { label: "Simulations", min: 1000, max: 30000, step: 1000, default: 10000 },
    },
  },
  {
    id: "two-envelopes",
    title: "Two Envelopes Problem",
    category: "Paradoxes",
    difficulty: "Hard",
    tags: ["Paradox", "Expected Value", "Strategy"],
    source: "Green Book §3.8",
    statement:
      "Two envelopes contain money: one has twice the other. You pick one, see the amount x. Should you switch? The naive argument says switch (expected value = 1.25x) but this leads to a paradox — you should always switch, even before opening!",
    hints: [
      "The flaw: you can't simultaneously have P(x is smaller) = P(x is larger) = 1/2 for all x.",
      "The distribution of the amounts matters — it can't be uniform over all positive reals.",
      "Without knowing the prior distribution, switching has no expected benefit.",
    ],
    answer: "\\text{No advantage to switching without prior knowledge of the distribution}",
    solutionExplanation:
      "The paradox arises because the argument assumes a specific prior. If envelope A has x, then either (A=x, B=2x) or (A=x, B=x/2). Without knowing which scenario is more likely (i.e. the prior on the amounts), you cannot compute a valid expected value. The correct answer: switching is neither beneficial nor harmful — the strategies are equivalent.",
    simulationType: "two-envelopes",
    params: {
      maxAmount: { label: "Max Base Amount", min: 10, max: 1000, step: 10, default: 100 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "random-walk",
    title: "1D Random Walk",
    category: "Random Walks",
    difficulty: "Medium",
    tags: ["Random Walk", "Martingale", "Diffusion"],
    source: "Green Book §4.1",
    statement:
      "A particle starts at position 0. At each step it moves +1 or -1 with equal probability. After n steps, what is the expected distance from the origin? What is the distribution of positions?",
    hints: [
      "Let X_i = ±1 with equal probability. Position after n steps: S_n = X_1 + ... + X_n.",
      "E[S_n] = 0 by symmetry. What about E[|S_n|] and Var(S_n)?",
      "Var(S_n) = n, so std dev = √n. The distribution approaches Normal(0, n).",
    ],
    answer: "E[S_n] = 0, \\quad \\text{Var}(S_n) = n, \\quad E[|S_n|] \\approx \\sqrt{\\frac{2n}{\\pi}}",
    solutionExplanation:
      "Since each step is ±1 with equal prob, E[X_i]=0 and Var(X_i)=1. By independence: E[S_n]=0 and Var(S_n)=n. By CLT, S_n/√n → Normal(0,1). The expected absolute displacement E[|S_n|] ≈ √(2n/π) by the half-normal distribution formula.",
    simulationType: "random-walk",
    params: {
      steps: { label: "Steps per Walk", min: 10, max: 500, step: 10, default: 100 },
      walks: { label: "Number of Walks", min: 1, max: 50, step: 1, default: 10 },
    },
  },
  {
    id: "dice-stopping",
    title: "Dice Stopping Problem",
    category: "Stopping Problems",
    difficulty: "Medium",
    tags: ["Optimal Stopping", "Expected Value", "Strategy"],
    source: "Jane Street Interview",
    statement:
      "You roll a fair 6-sided die repeatedly. You may stop at any time and collect the face value in dollars. What is the optimal stopping strategy and what is the expected payout?",
    hints: [
      "Work backwards. What is the expected value of continuing vs stopping?",
      "If expected future value is V, you stop when current roll > V.",
      "Set up the equation: V = (1/6)·[stop values + V·(number of continue values)]",
    ],
    answer: "\\text{Stop if roll} \\geq 4. \\quad E[\\text{payout}] = \\frac{14}{3} \\approx 4.67",
    solutionExplanation:
      "Let V = expected payout under optimal strategy. You stop if the roll ≥ V (taking the money), continue otherwise. V = (1/6)·(4+5+6) + (3/6)·V ⟹ V/2 = 15/6 = 5/2 ⟹ V = 14/3 ≈ 4.67. The threshold is 4 (stop if ≥ 4). Generalizes: for n-sided die, stop if roll > n(√2-1).",
    simulationType: "dice-stopping",
    params: {
      sides: { label: "Die Sides", min: 4, max: 20, step: 1, default: 6 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "expected-rolls",
    title: "Expected Rolls to Get Six",
    category: "Expected Value",
    difficulty: "Easy",
    tags: ["Geometric Distribution", "Expected Value"],
    source: "Green Book §3.4",
    statement:
      "How many times do you expect to roll a fair 6-sided die before getting a 6? Generalize: what is the expected number of trials to get a success with probability p?",
    hints: [
      "Each roll is independent. P(6) = 1/6.",
      "This is a geometric distribution with p = 1/6.",
      "E[geometric(p)] = 1/p.",
    ],
    answer: "E[T] = \\frac{1}{p} = 6 \\text{ rolls}",
    solutionExplanation:
      "The number of trials until first success follows a geometric distribution. E[T] = 1 + (1-p)·E[T], so E[T] = 1/p. For p=1/6: E[T] = 6. Variance = (1-p)/p² = 30. This extends to any success probability — expected rolls = reciprocal of success probability.",
    simulationType: "expected-rolls",
    params: {
      successProb: { label: "P(success) × 100", min: 5, max: 95, step: 5, default: 17 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  {
    id: "urn-drawing",
    title: "Urn Drawing (Hypergeometric)",
    category: "Combinatorics",
    difficulty: "Medium",
    tags: ["Combinatorics", "Hypergeometric", "Sampling"],
    source: "Green Book §3.6",
    statement:
      "An urn contains N balls: K red and (N-K) blue. You draw n balls without replacement. What is the probability of getting exactly k red balls?",
    hints: [
      "Count favorable outcomes: C(K,k)·C(N-K, n-k) ways.",
      "Total outcomes: C(N, n) ways.",
      "This is the hypergeometric distribution.",
    ],
    answer: "P(X=k) = \\frac{\\binom{K}{k}\\binom{N-K}{n-k}}{\\binom{N}{n}}",
    solutionExplanation:
      "The hypergeometric distribution counts successes in n draws from a finite population without replacement. Mean = n·K/N, Variance = n·(K/N)·(1-K/N)·(N-n)/(N-1). As N→∞ with K/N→p, this converges to Binomial(n,p).",
    simulationType: "urn-drawing",
    params: {
      totalBalls: { label: "Total Balls (N)", min: 10, max: 100, step: 5, default: 50 },
      redBalls: { label: "Red Balls (K)", min: 5, max: 50, step: 1, default: 20 },
      draws: { label: "Draws (n)", min: 1, max: 30, step: 1, default: 10 },
      trials: { label: "Simulations", min: 1000, max: 30000, step: 1000, default: 5000 },
    },
  },
  {
    id: "card-problem",
    title: "Ace in the Deck",
    category: "Conditional Probability",
    difficulty: "Easy",
    tags: ["Cards", "Conditional Probability"],
    source: "Jane Street Interview",
    statement:
      "You shuffle a standard 52-card deck and flip cards one at a time. What is the expected number of cards you flip until you see the first Ace?",
    hints: [
      "Think about symmetry: the 4 aces and 48 non-aces divide the deck into 5 segments.",
      "By symmetry, E[position of first ace] = E[1st order statistic of 4 uniform draws from 52].",
      "The expected position of the k-th ace is k·(n+1)/(m+1) where n=52, m=4.",
    ],
    answer: "E[\\text{first Ace at position}] = \\frac{53}{5} = 10.6",
    solutionExplanation:
      "By symmetry, the 4 aces divide the deck into 5 equally likely gaps. The expected position of the first ace = (52+1)/(4+1) = 53/5 = 10.6. So on average you flip about 10-11 cards before seeing the first ace. In general with m aces in n cards: E[first ace] = (n+1)/(m+1).",
    simulationType: "card-ace",
    params: {
      aces: { label: "Number of Aces", min: 1, max: 13, step: 1, default: 4 },
      trials: { label: "Simulations", min: 1000, max: 50000, step: 1000, default: 10000 },
    },
  },
  ...EXTRA_PROBLEMS,
  {
    id: "three-doors-variant",
    title: "Bayes Theorem: Disease Testing",
    category: "Conditional Probability",
    difficulty: "Medium",
    tags: ["Bayes", "False Positive", "Medical"],
    source: "Classic Bayes Problem",
    statement:
      "A disease affects 1% of the population. A test is 99% accurate (both sensitivity and specificity). You test positive. What is the probability you actually have the disease?",
    hints: [
      "Use Bayes' theorem: P(Disease | +) = P(+ | Disease)·P(Disease) / P(+)",
      "P(+) = P(+|D)·P(D) + P(+|no D)·P(no D)",
      "The base rate (1%) matters enormously — this is why rare disease testing is tricky.",
    ],
    answer: "P(\\text{disease} | +) = \\frac{0.99 \\times 0.01}{0.99 \\times 0.01 + 0.01 \\times 0.99} = 50\\%",
    solutionExplanation:
      "P(D|+) = P(+|D)·P(D) / [P(+|D)·P(D) + P(+|¬D)·P(¬D)] = (0.99×0.01) / (0.99×0.01 + 0.01×0.99) = 0.0099/0.0198 = 50%. Even with 99% accuracy, only 50% of positives truly have the disease when prevalence is 1% — because false positives outnumber true positives.",
    simulationType: "disease-test",
    params: {
      prevalence: { label: "Prevalence (%)", min: 1, max: 50, step: 1, default: 1 },
      sensitivity: { label: "Test Sensitivity (%)", min: 50, max: 100, step: 1, default: 99 },
      specificity: { label: "Test Specificity (%)", min: 50, max: 100, step: 1, default: 99 },
      trials: { label: "Simulations", min: 10000, max: 100000, step: 10000, default: 50000 },
    },
  },
];
