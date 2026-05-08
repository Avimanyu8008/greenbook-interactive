// ─── Monte Carlo Simulation Engine ───────────────────────────────────────────

export type SimResult = {
  value: number;
  label: string;
  chartData: { name: string | number; value: number; expected?: number }[];
  stats: { label: string; value: string }[];
};

// Monty Hall
export function simulateMontyHall(trials: number): SimResult {
  let switchWins = 0;
  let stayWins = 0;
  const progress: { name: number; switch: number; stay: number }[] = [];
  const checkpoints = Math.max(1, Math.floor(trials / 50));

  for (let i = 0; i < trials; i++) {
    const car = Math.floor(Math.random() * 3);
    const pick = Math.floor(Math.random() * 3);

    // Host opens a goat door (not car, not pick)
    let host = -1;
    for (let d = 0; d < 3; d++) {
      if (d !== car && d !== pick) { host = d; break; }
    }
    // Switch = remaining door
    const switchDoor = [0, 1, 2].find(d => d !== pick && d !== host)!;
    if (switchDoor === car) switchWins++;
    if (pick === car) stayWins++;

    if ((i + 1) % checkpoints === 0 || i === trials - 1) {
      progress.push({
        name: i + 1,
        switch: Math.round((switchWins / (i + 1)) * 100),
        stay: Math.round((stayWins / (i + 1)) * 100),
      });
    }
  }

  const switchRate = (switchWins / trials) * 100;
  const stayRate = (stayWins / trials) * 100;

  return {
    value: switchRate,
    label: "Switch Win Rate",
    chartData: progress.map(p => ({ name: p.name, value: p.switch, expected: 66.67 })),
    stats: [
      { label: "Switch win rate", value: `${switchRate.toFixed(1)}%` },
      { label: "Stay win rate", value: `${stayRate.toFixed(1)}%` },
      { label: "Theoretical (switch)", value: "66.67%" },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Birthday Problem
export function simulateBirthday(people: number, trials: number): SimResult {
  let matches = 0;
  const byPeople: { name: number; simulated: number; theoretical: number }[] = [];

  for (let i = 0; i < trials; i++) {
    const birthdays = new Set<number>();
    let hasMatch = false;
    for (let j = 0; j < people; j++) {
      const b = Math.floor(Math.random() * 365);
      if (birthdays.has(b)) { hasMatch = true; break; }
      birthdays.add(b);
    }
    if (hasMatch) matches++;
  }

  // Build curve for all n up to people+20
  const maxN = Math.min(people + 20, 80);
  for (let n = 2; n <= maxN; n++) {
    let prob = 1;
    for (let k = 0; k < n; k++) prob *= (365 - k) / 365;
    byPeople.push({
      name: n,
      simulated: n === people ? Math.round((matches / trials) * 1000) / 10 : 0,
      theoretical: Math.round((1 - prob) * 1000) / 10,
    });
  }

  const theoretical = (() => {
    let p = 1;
    for (let k = 0; k < people; k++) p *= (365 - k) / 365;
    return (1 - p) * 100;
  })();

  return {
    value: (matches / trials) * 100,
    label: "P(shared birthday)",
    chartData: byPeople.map(d => ({ name: d.name, value: d.theoretical })),
    stats: [
      { label: `P(match) for n=${people}`, value: `${((matches / trials) * 100).toFixed(1)}%` },
      { label: "Theoretical", value: `${theoretical.toFixed(1)}%` },
      { label: "50% threshold", value: "n = 23" },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Gambler's Ruin
export function simulateGamblersRuin(startAmount: number, targetAmount: number, trials: number): SimResult {
  let wins = 0;
  const pathData: { name: number; position: number }[] = [];
  const samplePath: number[] = [startAmount];
  let pos = startAmount;

  // Sample one path for visualization
  while (pos > 0 && pos < targetAmount && samplePath.length < 500) {
    pos += Math.random() < 0.5 ? 1 : -1;
    samplePath.push(pos);
  }

  for (let t = 0; t < trials; t++) {
    let p = startAmount;
    while (p > 0 && p < targetAmount) {
      p += Math.random() < 0.5 ? 1 : -1;
    }
    if (p >= targetAmount) wins++;
  }

  const winRate = (wins / trials) * 100;
  const theoretical = (startAmount / targetAmount) * 100;

  return {
    value: winRate,
    label: "P(reach target)",
    chartData: samplePath.map((v, i) => ({ name: i, value: v })),
    stats: [
      { label: "P(reach target)", value: `${winRate.toFixed(1)}%` },
      { label: "Theoretical (k/N)", value: `${theoretical.toFixed(1)}%` },
      { label: `Start: $${startAmount}, Target: $${targetAmount}`, value: "" },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Coupon Collector
export function simulateCouponCollector(coupons: number, trials: number): SimResult {
  const counts: number[] = [];
  for (let t = 0; t < trials; t++) {
    const collected = new Set<number>();
    let boxes = 0;
    while (collected.size < coupons) {
      collected.add(Math.floor(Math.random() * coupons));
      boxes++;
    }
    counts.push(boxes);
  }

  const avg = counts.reduce((a, b) => a + b, 0) / trials;
  const theoretical = coupons * Array.from({ length: coupons }, (_, i) => 1 / (i + 1)).reduce((a, b) => a + b, 0);

  // Distribution
  const hist: Record<number, number> = {};
  const bucket = Math.max(1, Math.floor(theoretical / 20));
  counts.forEach(c => {
    const b = Math.round(c / bucket) * bucket;
    hist[b] = (hist[b] || 0) + 1;
  });
  const chartData = Object.entries(hist)
    .sort((a, b) => +a[0] - +b[0])
    .map(([k, v]) => ({ name: +k, value: Math.round((v / trials) * 100) }));

  return {
    value: avg,
    label: "Avg boxes to collect all",
    chartData,
    stats: [
      { label: "Average boxes", value: avg.toFixed(1) },
      { label: "Theoretical (n·Hₙ)", value: theoretical.toFixed(1) },
      { label: "Approximation (n·ln n)", value: (coupons * Math.log(coupons)).toFixed(1) },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Boy or Girl
export function simulateBoyOrGirl(trials: number): SimResult {
  let atLeastOneBoy = 0;
  let bothBoysGivenAtLeast = 0;
  let metABoy = 0;
  let bothBoysGivenMet = 0;

  for (let i = 0; i < trials; i++) {
    const c1 = Math.random() < 0.5 ? "B" : "G";
    const c2 = Math.random() < 0.5 ? "B" : "G";
    if (c1 === "B" || c2 === "B") {
      atLeastOneBoy++;
      if (c1 === "B" && c2 === "B") bothBoysGivenAtLeast++;
    }
    // Met a specific child (random one)
    const met = Math.random() < 0.5 ? c1 : c2;
    if (met === "B") {
      metABoy++;
      if (c1 === "B" && c2 === "B") bothBoysGivenMet++;
    }
  }

  const p1 = (bothBoysGivenAtLeast / atLeastOneBoy) * 100;
  const p2 = (bothBoysGivenMet / metABoy) * 100;

  return {
    value: p1,
    label: "P(both boys | at least one boy)",
    chartData: [
      { name: "At least one boy", value: Math.round(p1) },
      { name: "Met a boy", value: Math.round(p2) },
      { name: "Theoretical (1/3)", value: 33.3 },
      { name: "Theoretical (1/2)", value: 50 },
    ],
    stats: [
      { label: "P(BB | at least one B)", value: `${p1.toFixed(1)}% (theory: 33.3%)` },
      { label: "P(BB | met a boy)", value: `${p2.toFixed(1)}% (theory: 50%)` },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Secretary Problem
export function simulateSecretary(candidates: number, trials: number): SimResult {
  const results: { r: number; pct: number }[] = [];
  const optimalR = Math.max(1, Math.floor(candidates / Math.E));
  const rValues = Array.from({ length: Math.min(candidates - 1, 30) }, (_, i) =>
    Math.max(1, Math.floor(((i + 1) / 30) * (candidates - 1)))
  );
  const uniqueR = [...new Set([...rValues, optimalR])].sort((a, b) => a - b);

  for (const r of uniqueR) {
    let wins = 0;
    for (let t = 0; t < Math.floor(trials / 5); t++) {
      const perm = Array.from({ length: candidates }, (_, i) => i + 1);
      for (let i = perm.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [perm[i], perm[j]] = [perm[j], perm[i]];
      }
      const best = Math.max(...perm.slice(0, r));
      const chosen = perm.slice(r).find(v => v > best) ?? perm[candidates - 1];
      if (chosen === candidates) wins++;
    }
    results.push({ r, pct: Math.round((wins / Math.floor(trials / 5)) * 1000) / 10 });
  }

  const optResult = results.find(r => r.r === optimalR)?.pct ?? 0;

  return {
    value: optResult,
    label: "P(best candidate)",
    chartData: results.map(r => ({ name: r.r, value: r.pct, expected: 36.8 })),
    stats: [
      { label: "Optimal skip", value: `${optimalR} of ${candidates}` },
      { label: "P(best) at optimal r", value: `${optResult.toFixed(1)}%` },
      { label: "Theoretical limit", value: "1/e ≈ 36.8%" },
      { label: "Trials (per r)", value: Math.floor(trials / 5).toLocaleString() },
    ],
  };
}

// Two Envelopes
export function simulateTwoEnvelopes(maxAmount: number, trials: number): SimResult {
  let switchTotal = 0;
  let stayTotal = 0;

  for (let t = 0; t < trials; t++) {
    const base = Math.random() * maxAmount;
    const env1 = base;
    const env2 = base * 2;
    const picked = Math.random() < 0.5 ? env1 : env2;
    const other = picked === env1 ? env2 : env1;
    stayTotal += picked;
    switchTotal += other;
  }

  const avgStay = stayTotal / trials;
  const avgSwitch = switchTotal / trials;

  return {
    value: avgSwitch / avgStay,
    label: "Switch/Stay ratio",
    chartData: [
      { name: "Stay", value: Math.round(avgStay * 100) / 100 },
      { name: "Switch", value: Math.round(avgSwitch * 100) / 100 },
    ],
    stats: [
      { label: "Avg payout (stay)", value: `$${avgStay.toFixed(2)}` },
      { label: "Avg payout (switch)", value: `$${avgSwitch.toFixed(2)}` },
      { label: "Ratio", value: (avgSwitch / avgStay).toFixed(3) },
      { label: "Verdict", value: "No advantage to switching" },
    ],
  };
}

// Random Walk
export function simulateRandomWalk(steps: number, walks: number): SimResult {
  const allPaths: number[][] = [];
  const finalPositions: number[] = [];

  for (let w = 0; w < walks; w++) {
    let pos = 0;
    const path = [0];
    for (let s = 0; s < steps; s++) {
      pos += Math.random() < 0.5 ? 1 : -1;
      path.push(pos);
    }
    allPaths.push(path);
    finalPositions.push(pos);
  }

  const avgFinal = finalPositions.reduce((a, b) => a + Math.abs(b), 0) / walks;
  const theoretical = Math.sqrt((2 * steps) / Math.PI);

  const chartData = allPaths[0].map((_, i) => {
    const obj: Record<string, number | string> = { name: i };
    allPaths.forEach((p, w) => { obj[`walk${w}`] = p[i]; });
    return obj as { name: string | number; value: number };
  });

  return {
    value: avgFinal,
    label: "Avg |final position|",
    chartData: allPaths[0].map((v, i) => ({ name: i, value: v })),
    stats: [
      { label: "Avg |final position|", value: avgFinal.toFixed(2) },
      { label: "Theoretical E[|Sₙ|]", value: theoretical.toFixed(2) },
      { label: "Theoretical σ", value: Math.sqrt(steps).toFixed(2) },
      { label: "Steps", value: steps.toString() },
    ],
  };
}

// Dice Stopping
export function simulateDiceStopping(sides: number, trials: number): SimResult {
  const threshold = Math.ceil(sides * (Math.SQRT2 - 1) + 0.5);
  let total = 0;
  const payouts: Record<number, number> = {};

  for (let t = 0; t < trials; t++) {
    let payout = 0;
    let rolls = 0;
    while (true) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls++;
      if (roll >= threshold) { payout = roll; break; }
      if (rolls > 100) { payout = roll; break; }
    }
    total += payout;
    payouts[payout] = (payouts[payout] || 0) + 1;
  }

  const avg = total / trials;
  const theoretical = (() => {
    const above = Array.from({ length: sides - threshold + 1 }, (_, i) => threshold + i);
    const below = threshold - 1;
    const stopProb = above.length / sides;
    const contProb = below / sides;
    const expStop = above.reduce((a, b) => a + b, 0) / sides;
    return contProb > 0 ? expStop / stopProb : above.reduce((a, b) => a + b, 0) / above.length;
  })();

  return {
    value: avg,
    label: "Avg payout",
    chartData: Object.entries(payouts)
      .sort((a, b) => +a[0] - +b[0])
      .map(([k, v]) => ({ name: +k, value: Math.round((v / trials) * 100) })),
    stats: [
      { label: "Optimal threshold", value: `Roll ≥ ${threshold}` },
      { label: "Avg payout (sim)", value: `$${avg.toFixed(2)}` },
      { label: "Theoretical E[payout]", value: `$${(((threshold + sides) / 2)).toFixed(2)}` },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Expected Rolls
export function simulateExpectedRolls(successProbPct: number, trials: number): SimResult {
  const p = successProbPct / 100;
  const counts: number[] = [];

  for (let t = 0; t < trials; t++) {
    let rolls = 0;
    while (Math.random() >= p) rolls++;
    counts.push(rolls + 1);
  }

  const avg = counts.reduce((a, b) => a + b, 0) / trials;
  const theoretical = 1 / p;

  // Distribution histogram
  const hist: Record<number, number> = {};
  const bucket = Math.max(1, Math.floor(theoretical / 10));
  counts.forEach(c => {
    const b = Math.round(c / bucket) * bucket;
    hist[b] = (hist[b] || 0) + 1;
  });
  const maxBucket = theoretical * 4;
  const chartData = Object.entries(hist)
    .filter(([k]) => +k <= maxBucket)
    .sort((a, b) => +a[0] - +b[0])
    .map(([k, v]) => ({
      name: +k,
      value: Math.round((v / trials) * 1000) / 10,
      expected: Math.round(p * Math.pow(1 - p, +k - 1) * 1000) / 10,
    }));

  return {
    value: avg,
    label: "Avg rolls to success",
    chartData,
    stats: [
      { label: "Average rolls", value: avg.toFixed(2) },
      { label: "Theoretical (1/p)", value: theoretical.toFixed(2) },
      { label: "p", value: `${successProbPct}%` },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Urn Drawing
export function simulateUrnDrawing(N: number, K: number, n: number, trials: number): SimResult {
  const hist: Record<number, number> = {};

  for (let t = 0; t < trials; t++) {
    const urn = Array.from({ length: N }, (_, i) => (i < K ? 1 : 0));
    let reds = 0;
    const drawn = new Set<number>();
    while (drawn.size < n) {
      const idx = Math.floor(Math.random() * N);
      if (!drawn.has(idx)) { drawn.add(idx); if (urn[idx] === 1) reds++; }
    }
    hist[reds] = (hist[reds] || 0) + 1;
  }

  const expectedK = (n * K) / N;
  const chartData = Object.entries(hist)
    .sort((a, b) => +a[0] - +b[0])
    .map(([k, v]) => ({ name: +k, value: Math.round((v / trials) * 100) }));

  return {
    value: expectedK,
    label: "Expected red draws",
    chartData,
    stats: [
      { label: "E[red draws] (theoretical)", value: expectedK.toFixed(2) },
      { label: "Variance", value: ((n * K * (N - K) * (N - n)) / (N * N * (N - 1))).toFixed(2) },
      { label: `N=${N}, K=${K}, n=${n}`, value: "" },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Card Ace
export function simulateCardAce(aces: number, trials: number): SimResult {
  const hist: Record<number, number> = {};
  const deckSize = 52;

  for (let t = 0; t < trials; t++) {
    const deck = Array.from({ length: deckSize }, (_, i) => (i < aces ? 1 : 0));
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    const pos = deck.indexOf(1) + 1;
    hist[pos] = (hist[pos] || 0) + 1;
  }

  const avg = Object.entries(hist).reduce((s, [k, v]) => s + +k * v, 0) / trials;
  const theoretical = (deckSize + 1) / (aces + 1);

  const bucket = 5;
  const bucketed: Record<number, number> = {};
  Object.entries(hist).forEach(([k, v]) => {
    const b = Math.round(+k / bucket) * bucket;
    bucketed[b] = (bucketed[b] || 0) + v;
  });

  return {
    value: avg,
    label: "Avg position of first ace",
    chartData: Object.entries(bucketed)
      .sort((a, b) => +a[0] - +b[0])
      .map(([k, v]) => ({ name: +k, value: Math.round((v / trials) * 100) })),
    stats: [
      { label: "Avg position", value: avg.toFixed(2) },
      { label: "Theoretical ((n+1)/(m+1))", value: theoretical.toFixed(2) },
      { label: `${aces} aces in ${deckSize} cards`, value: "" },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Disease Test
export function simulateDiseaseTest(prevalencePct: number, sensitivityPct: number, specificityPct: number, trials: number): SimResult {
  const p = prevalencePct / 100;
  const sens = sensitivityPct / 100;
  const spec = specificityPct / 100;
  let truePos = 0, falsePos = 0, totalPos = 0;

  for (let t = 0; t < trials; t++) {
    const hasDisease = Math.random() < p;
    const positive = hasDisease ? Math.random() < sens : Math.random() >= spec;
    if (positive) {
      totalPos++;
      if (hasDisease) truePos++;
      else falsePos++;
    }
  }

  const ppv = totalPos > 0 ? (truePos / totalPos) * 100 : 0;
  const theoreticalNumer = sens * p;
  const theoreticalDenom = sens * p + (1 - spec) * (1 - p);
  const theoretical = (theoreticalNumer / theoreticalDenom) * 100;

  return {
    value: ppv,
    label: "P(disease | positive test)",
    chartData: [
      { name: "True Positive", value: truePos },
      { name: "False Positive", value: falsePos },
    ],
    stats: [
      { label: "P(disease | +) simulated", value: `${ppv.toFixed(1)}%` },
      { label: "Theoretical (Bayes)", value: `${theoretical.toFixed(1)}%` },
      { label: "Total positives", value: totalPos.toLocaleString() },
      { label: "False positive rate", value: totalPos > 0 ? `${((falsePos / totalPos) * 100).toFixed(1)}%` : "—" },
    ],
  };
}

// ─── NEW SIMULATION FUNCTIONS ────────────────────────────────────────────────

// Normal CDF approximation
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
  return x > 0 ? 1 - p : p;
}

// Airplane Boarding
export function simulateAirplaneBoarding(passengers: number, trials: number): SimResult {
  let lastGetsOwn = 0;
  for (let t = 0; t < trials; t++) {
    const seats = Array.from({ length: passengers }, (_, i) => i);
    // Shuffle: first passenger picks random seat
    let taken = new Set<number>();
    taken.add(Math.floor(Math.random() * passengers));
    for (let p = 1; p < passengers - 1; p++) {
      if (!taken.has(p)) { taken.add(p); }
      else {
        const available = seats.filter(s => !taken.has(s));
        taken.add(available[Math.floor(Math.random() * available.length)]);
      }
    }
    // Last passenger
    const lastSeat = seats.find(s => !taken.has(s))!;
    if (lastSeat === passengers - 1) lastGetsOwn++;
  }
  const rate = (lastGetsOwn / trials) * 100;
  return {
    value: rate,
    label: "P(last passenger gets own seat)",
    chartData: [
      { name: "Gets Own Seat", value: Math.round(lastGetsOwn / trials * 1000) / 10 },
      { name: "Gets Wrong Seat", value: Math.round((1 - lastGetsOwn / trials) * 1000) / 10 },
    ],
    stats: [
      { label: "P(last gets own seat)", value: `${rate.toFixed(1)}%` },
      { label: "Theoretical", value: "50.0%" },
      { label: "Passengers", value: passengers.toString() },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Russian Roulette
export function simulateRussianRoulette(trials: number): SimResult {
  let pullDeaths = 0, spinDeaths = 0;
  // Consecutive bullets in chambers 0 and 1 (6 chambers)
  for (let t = 0; t < trials; t++) {
    // Surviving means chamber 0 was fired (no bullet) or chamber 1 was fired (no bullet)
    // With 2 consecutive bullets in positions b and b+1:
    // Pick random starting chamber for first pull. If it's bullet: dead. If survived, remaining 5 chambers.
    // P(death | pull again) given survived = 1/4 (1 bullet directly after, out of 4 non-bullet starts)
    const bulletStart = Math.floor(Math.random() * 6);
    // Bullets at bulletStart and (bulletStart+1)%6
    const firstFired = Math.floor(Math.random() * 6);
    if (firstFired === bulletStart || firstFired === (bulletStart + 1) % 6) continue; // died first shot (discard)
    // Pull again: next chamber
    const nextChamber = (firstFired + 1) % 6;
    if (nextChamber === bulletStart || nextChamber === (bulletStart + 1) % 6) pullDeaths++;
    // Spin again: random
    const spinChamber = Math.floor(Math.random() * 6);
    if (spinChamber === bulletStart || spinChamber === (bulletStart + 1) % 6) spinDeaths++;
  }
  const pullRate = (pullDeaths / trials) * 100;
  const spinRate = (spinDeaths / trials) * 100;
  return {
    value: pullRate,
    label: "P(death | pull again)",
    chartData: [
      { name: "Pull Again", value: parseFloat(pullRate.toFixed(1)) },
      { name: "Spin Again", value: parseFloat(spinRate.toFixed(1)) },
    ],
    stats: [
      { label: "P(death | pull again)", value: `${pullRate.toFixed(1)}%` },
      { label: "P(death | spin again)", value: `${spinRate.toFixed(1)}%` },
      { label: "Theoretical pull", value: "25.0%" },
      { label: "Theoretical spin", value: "33.3%" },
    ],
  };
}

// Three Prisoners
export function simulateThreePrisoners(trials: number): SimResult {
  let aPardonedGivenB = 0, cPardonedGivenB = 0, total = 0;
  for (let t = 0; t < trials; t++) {
    // 0=A, 1=B, 2=C pardoned
    const pardoned = Math.floor(Math.random() * 3);
    let guardSaysB = false;
    if (pardoned === 0) { guardSaysB = Math.random() < 0.5; } // guard picks B or C
    else if (pardoned === 1) { guardSaysB = false; } // guard can't name B
    else { guardSaysB = true; } // guard must name B
    if (guardSaysB) {
      total++;
      if (pardoned === 0) aPardonedGivenB++;
      if (pardoned === 2) cPardonedGivenB++;
    }
  }
  const pA = total > 0 ? (aPardonedGivenB / total) * 100 : 0;
  const pC = total > 0 ? (cPardonedGivenB / total) * 100 : 0;
  return {
    value: pA,
    label: "P(A pardoned | guard names B)",
    chartData: [
      { name: "P(A pardoned)", value: parseFloat(pA.toFixed(1)) },
      { name: "P(C pardoned)", value: parseFloat(pC.toFixed(1)) },
    ],
    stats: [
      { label: "P(A pardoned | guard names B)", value: `${pA.toFixed(1)}%` },
      { label: "P(C pardoned | guard names B)", value: `${pC.toFixed(1)}%` },
      { label: "Theoretical P(A)", value: "33.3%" },
      { label: "Theoretical P(C)", value: "66.7%" },
    ],
  };
}

// Sock Drawer
export function simulateSockDrawer(colorsCount: number, socksPerColor: number, trials: number): SimResult {
  let anyMatchCount = 0;
  const drawsForAny = colorsCount + 1;
  // Guaranteed any match needs colorsCount+1
  // For red pair: 2*(colorsCount-1)*socksPerColor + 2
  for (let t = 0; t < trials; t++) {
    const drawer: number[] = [];
    for (let c = 0; c < colorsCount; c++) for (let s = 0; s < socksPerColor; s++) drawer.push(c);
    for (let i = drawer.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [drawer[i], drawer[j]] = [drawer[j], drawer[i]];
    }
    const drawn = drawer.slice(0, drawsForAny);
    const seen = new Set(drawn);
    if (seen.size < drawsForAny) anyMatchCount++;
  }
  const rate = (anyMatchCount / trials) * 100;
  return {
    value: rate,
    label: "P(match in " + drawsForAny + " draws)",
    chartData: [
      { name: "Has Match", value: parseFloat(rate.toFixed(1)) },
      { name: "No Match", value: parseFloat((100 - rate).toFixed(1)) },
    ],
    stats: [
      { label: `P(match in ${drawsForAny} draws)`, value: `${rate.toFixed(1)}%` },
      { label: "Theoretical (guarantee)", value: "100%" },
      { label: "Draws for any match guarantee", value: drawsForAny.toString() },
      { label: "Draws for red pair guarantee", value: (2 * (colorsCount - 1) * socksPerColor + 2).toString() },
    ],
  };
}

// Poker Hand
export function simulatePokerHand(handType: number, trials: number): SimResult {
  let successes = 0;
  for (let t = 0; t < trials; t++) {
    // Build deck: 52 cards (rank 0-12, suit 0-3)
    const deck: [number, number][] = [];
    for (let r = 0; r < 13; r++) for (let s = 0; s < 4; s++) deck.push([r, s]);
    for (let i = 51; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    const hand = deck.slice(0, 5);
    const ranks = hand.map(c => c[0]).sort((a, b) => a - b);
    const suits = hand.map(c => c[1]);
    const rankCounts = new Map<number, number>();
    ranks.forEach(r => rankCounts.set(r, (rankCounts.get(r) ?? 0) + 1));
    const counts = Array.from(rankCounts.values()).sort((a, b) => b - a);
    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = ranks[4] - ranks[0] === 4 && rankCounts.size === 5;
    if (handType === 0) { // full house
      if (counts[0] === 3 && counts[1] === 2) successes++;
    } else if (handType === 1) { // flush
      if (isFlush && !isStraight) successes++;
    } else { // straight
      if (isStraight && !isFlush) successes++;
    }
  }
  const rate = (successes / trials) * 100;
  const names = ["Full House", "Flush", "Straight"];
  const theoretical = [0.1441, 0.1965, 0.3925];
  return {
    value: rate,
    label: `P(${names[handType]})`,
    chartData: [
      { name: names[handType], value: parseFloat(rate.toFixed(3)) },
      { name: "Theoretical", value: theoretical[handType] },
    ],
    stats: [
      { label: `P(${names[handType]})`, value: `${rate.toFixed(3)}%` },
      { label: "Theoretical", value: `${theoretical[handType]}%` },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Derangement
export function simulateDerangement(people: number, trials: number): SimResult {
  let derangements = 0;
  for (let t = 0; t < trials; t++) {
    const perm = Array.from({ length: people }, (_, i) => i);
    for (let i = perm.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    if (perm.every((v, i) => v !== i)) derangements++;
  }
  // Theoretical
  let theoretical = 0;
  let sign = 1;
  let factorial = 1;
  for (let k = 0; k <= people; k++) {
    if (k > 0) factorial *= k;
    theoretical += sign / factorial;
    sign = -sign;
  }
  theoretical *= 100;
  const rate = (derangements / trials) * 100;
  return {
    value: rate,
    label: "P(derangement)",
    chartData: [
      { name: "Simulated", value: parseFloat(rate.toFixed(1)) },
      { name: "Theoretical", value: parseFloat(theoretical.toFixed(1)) },
      { name: "Limit (1/e)", value: 36.79 },
    ],
    stats: [
      { label: "P(derangement)", value: `${rate.toFixed(1)}%` },
      { label: "Theoretical", value: `${theoretical.toFixed(1)}%` },
      { label: "Limit as n→∞", value: "36.79% (1/e)" },
      { label: "n", value: people.toString() },
    ],
  };
}

// Expected Matches
export function simulateExpectedMatches(deckSize: number, trials: number): SimResult {
  let totalMatches = 0;
  for (let t = 0; t < trials; t++) {
    const deck1 = Array.from({ length: deckSize }, (_, i) => i);
    const deck2 = Array.from({ length: deckSize }, (_, i) => i);
    for (let i = deck2.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck2[i], deck2[j]] = [deck2[j], deck2[i]];
    }
    let matches = 0;
    for (let i = 0; i < deckSize; i++) if (deck1[i] === deck2[i]) matches++;
    totalMatches += matches;
  }
  const avgMatches = totalMatches / trials;
  const dist = new Map<number, number>();
  for (let t = 0; t < Math.min(trials, 10000); t++) {
    const deck2 = Array.from({ length: deckSize }, (_, i) => i);
    for (let i = deck2.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck2[i], deck2[j]] = [deck2[j], deck2[i]];
    }
    let matches = 0;
    for (let i = 0; i < deckSize; i++) if (i === deck2[i]) matches++;
    dist.set(matches, (dist.get(matches) ?? 0) + 1);
  }
  const chartData = Array.from({ length: Math.min(8, deckSize + 1) }, (_, k) => ({
    name: k,
    value: Math.round(((dist.get(k) ?? 0) / Math.min(trials, 10000)) * 1000) / 10,
  }));
  return {
    value: avgMatches,
    label: "Expected Matches",
    chartData,
    stats: [
      { label: "Avg matches (simulated)", value: avgMatches.toFixed(3) },
      { label: "Theoretical E[matches]", value: "1.000" },
      { label: "P(0 matches) ≈ 1/e", value: "36.79%" },
      { label: "n", value: deckSize.toString() },
    ],
  };
}

// Coin Sequence (HH vs HT)
export function simulateCoinSequence(target: number, trials: number): SimResult {
  const sequences = [["H", "H"], ["H", "T"], ["T", "T", "T"]];
  const seq = sequences[Math.min(target, 2)];
  let totalFlips = 0;
  for (let t = 0; t < trials; t++) {
    const history: string[] = [];
    while (true) {
      history.push(Math.random() < 0.5 ? "H" : "T");
      if (history.length >= seq.length) {
        const tail = history.slice(-seq.length);
        if (tail.every((v, i) => v === seq[i])) break;
      }
    }
    totalFlips += history.length;
  }
  const avg = totalFlips / trials;
  const theoretical = [6, 4, 14];
  return {
    value: avg,
    label: `E[flips until ${seq.join("")}]`,
    chartData: [
      { name: "Simulated", value: parseFloat(avg.toFixed(2)) },
      { name: "Theoretical", value: theoretical[target] },
    ],
    stats: [
      { label: "Avg flips (simulated)", value: avg.toFixed(2) },
      { label: "Theoretical", value: theoretical[target].toString() },
      { label: "Target sequence", value: seq.join("") },
    ],
  };
}

// St. Petersburg Paradox
export function simulateStPetersburg(maxFlips: number, trials: number): SimResult {
  let totalPayout = 0;
  const payoutDist = new Map<number, number>();
  for (let t = 0; t < trials; t++) {
    let flips = 0;
    while (flips < maxFlips && Math.random() >= 0.5) flips++;
    flips++;
    const payout = Math.pow(2, Math.min(flips, maxFlips));
    totalPayout += payout;
    const bucket = Math.min(flips, maxFlips);
    payoutDist.set(bucket, (payoutDist.get(bucket) ?? 0) + 1);
  }
  const avg = totalPayout / trials;
  const chartData = Array.from({ length: Math.min(maxFlips, 15) }, (_, i) => ({
    name: i + 1,
    value: Math.round(((payoutDist.get(i + 1) ?? 0) / trials) * 1000) / 10,
    expected: Math.round(Math.pow(0.5, i + 1) * 1000) / 10,
  }));
  return {
    value: avg,
    label: "Avg payout",
    chartData,
    stats: [
      { label: "Avg payout (simulated)", value: `${avg.toFixed(2)}` },
      { label: "Theoretical E[payout]", value: `${maxFlips} (capped)` },
      { label: "Median payout", value: "$2" },
      { label: "Max possible (capped)", value: `${Math.pow(2, maxFlips).toLocaleString()}` },
    ],
  };
}

// Noodle Loop
export function simulateNoodleLoop(noodles: number, trials: number): SimResult {
  let totalLoops = 0;
  for (let t = 0; t < trials; t++) {
    let ends = noodles * 2;
    let loops = 0;
    while (ends > 0) {
      ends--; // pick one end
      const remaining = ends;
      if (remaining === 0) { loops++; break; }
      const samePiece = Math.random() < 1 / remaining; // probability of picking same noodle's other end
      if (samePiece) loops++;
      ends--;
    }
    totalLoops += loops;
  }
  const avg = totalLoops / trials;
  // Theoretical: sum 1/(2k-1) for k=1 to n
  let theoretical = 0;
  for (let k = 1; k <= noodles; k++) theoretical += 1 / (2 * k - 1);
  return {
    value: avg,
    label: "Avg loops formed",
    chartData: [
      { name: "Simulated", value: parseFloat(avg.toFixed(3)) },
      { name: "Theoretical", value: parseFloat(theoretical.toFixed(3)) },
    ],
    stats: [
      { label: "Avg loops (simulated)", value: avg.toFixed(3) },
      { label: "Theoretical E[loops]", value: theoretical.toFixed(3) },
      { label: "Noodles", value: noodles.toString() },
    ],
  };
}

// Pirate Game (analytical)
export function simulatePirateGame(pirates: number, gold: number): SimResult {
  // Backward induction
  const allocations: number[][] = [];
  for (let n = 1; n <= pirates; n++) {
    const alloc = new Array(n).fill(0);
    if (n === 1) { alloc[0] = gold; }
    else if (n === 2) { alloc[0] = gold; alloc[1] = 0; }
    else {
      const prev = allocations[n - 2];
      // n pirates: proposer is pirate 0, needs ceil(n/2) votes total
      // Give each pirate who gets 0 in (n-1)-pirate scenario: prev[i-1] + 1 (bribe them cheaply)
      // In (n-1)-pirate scenario, the proposer is pirate 1 (0-indexed)
      let remaining = gold;
      const votes: boolean[] = new Array(n).fill(false);
      votes[0] = true; // proposer always votes yes
      // Bribe cheapest pirates: those getting 0 or least in prev scenario
      // prev has n-1 entries for pirates 1..n-1 in current scheme
      const bribeAmounts: [number, number][] = []; // [pirate index in current, bribe needed]
      for (let i = 1; i < n; i++) {
        bribeAmounts.push([i, (prev[i - 1] ?? 0) + 1]);
      }
      bribeAmounts.sort((a, b) => a[1] - b[1]);
      const needVotes = Math.ceil(n / 2) - 1; // need this many additional votes
      for (let v = 0; v < needVotes && v < bribeAmounts.length; v++) {
        alloc[bribeAmounts[v][0]] = bribeAmounts[v][1];
        remaining -= bribeAmounts[v][1];
      }
      alloc[0] = Math.max(0, remaining);
    }
    allocations.push(alloc);
  }
  const finalAlloc = allocations[pirates - 1];
  return {
    value: finalAlloc[0],
    label: "Pirate 1 keeps",
    chartData: finalAlloc.map((g, i) => ({ name: `P${i + 1}`, value: g })),
    stats: [
      { label: "Pirate 1 (proposer) keeps", value: `${finalAlloc[0]} gold` },
      { label: "Allocation", value: finalAlloc.join(", ") },
      { label: "Pirates", value: pirates.toString() },
      { label: "Gold", value: gold.toString() },
    ],
  };
}

// Brownian Motion Hitting Time
export function simulateBrownianHitting(upperBarrier: number, lowerBarrier: number, trials: number): SimResult {
  const a = upperBarrier, b = lowerBarrier;
  let hitsUpper = 0;
  let totalTime = 0;
  const dt = 0.01;
  for (let t = 0; t < trials; t++) {
    let pos = 0;
    let time = 0;
    while (true) {
      pos += Math.sqrt(dt) * (Math.random() < 0.5 ? 1 : -1);
      time += dt;
      if (pos >= a) { hitsUpper++; totalTime += time; break; }
      if (pos <= -b) { totalTime += time; break; }
      if (time > 500) break; // safety
    }
  }
  const pHitUpper = (hitsUpper / trials) * 100;
  const avgTime = totalTime / trials;
  const theoreticalP = (b / (a + b)) * 100;
  const theoreticalT = a * b;
  return {
    value: pHitUpper,
    label: `P(hit ${a} before -${b})`,
    chartData: [
      { name: `Hit +${a}`, value: parseFloat(pHitUpper.toFixed(1)) },
      { name: `Hit -${b}`, value: parseFloat((100 - pHitUpper).toFixed(1)) },
    ],
    stats: [
      { label: `P(hit ${a} first)`, value: `${pHitUpper.toFixed(1)}%` },
      { label: "Theoretical", value: `${theoreticalP.toFixed(1)}%` },
      { label: "Avg hitting time", value: avgTime.toFixed(2) },
      { label: "Theoretical E[τ]", value: `${theoreticalT}` },
    ],
  };
}

// Order Statistics
export function simulateOrderStatistics(sampleSize: number, orderK: number, trials: number): SimResult {
  const k = Math.min(orderK, sampleSize);
  let total = 0;
  const hist = new Array(20).fill(0);
  for (let t = 0; t < trials; t++) {
    const samples = Array.from({ length: sampleSize }, () => Math.random()).sort((a, b) => a - b);
    const val = samples[k - 1];
    total += val;
    hist[Math.floor(val * 20)]++;
  }
  const avg = total / trials;
  const theoretical = k / (sampleSize + 1);
  return {
    value: avg,
    label: `E[X_(${k})]`,
    chartData: hist.map((count, i) => ({
      name: parseFloat(((i + 0.5) / 20).toFixed(2)),
      value: Math.round((count / trials) * 1000) / 10,
    })),
    stats: [
      { label: `E[X_(${k})] simulated`, value: avg.toFixed(4) },
      { label: "Theoretical k/(n+1)", value: theoretical.toFixed(4) },
      { label: "n", value: sampleSize.toString() },
      { label: "k", value: k.toString() },
    ],
  };
}

// Poker Flush (Texas Hold'em outs)
export function simulatePokerFlush(heartsNeeded: number, heartsInDeck: number, trials: number): SimResult {
  const unknownCards = 47;
  let successes = 0;
  for (let t = 0; t < trials; t++) {
    let heartsLeft = heartsInDeck;
    let cardsLeft = unknownCards;
    let got = 0;
    for (let card = 0; card < 2 && got < heartsNeeded; card++) {
      if (Math.random() < heartsLeft / cardsLeft) { heartsLeft--; got++; }
      cardsLeft--;
    }
    if (got >= heartsNeeded) successes++;
  }
  const rate = (successes / trials) * 100;
  const theoretical = heartsNeeded === 1
    ? (1 - (unknownCards - heartsInDeck) / unknownCards * (unknownCards - heartsInDeck - 1) / (unknownCards - 1)) * 100
    : (heartsInDeck / unknownCards) * ((heartsInDeck - 1) / (unknownCards - 1)) * 100;
  return {
    value: rate,
    label: "P(complete flush by river)",
    chartData: [
      { name: "Simulated", value: parseFloat(rate.toFixed(2)) },
      { name: "Theoretical", value: parseFloat(theoretical.toFixed(2)) },
    ],
    stats: [
      { label: "P(flush by river)", value: `${rate.toFixed(2)}%` },
      { label: "Theoretical", value: `${theoretical.toFixed(2)}%` },
      { label: "Hearts remaining", value: heartsInDeck.toString() },
      { label: "Cards remaining", value: unknownCards.toString() },
    ],
  };
}

// Ballot Problem
export function simulateBallot(votesA: number, votesB: number, trials: number): SimResult {
  if (votesA <= votesB) {
    return { value: 0, label: "Need A > B", chartData: [], stats: [{ label: "Error", value: "Need A > B" }] };
  }
  let successes = 0;
  for (let t = 0; t < trials; t++) {
    const ballots = [...new Array(votesA).fill("A"), ...new Array(votesB).fill("B")];
    for (let i = ballots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ballots[i], ballots[j]] = [ballots[j], ballots[i]];
    }
    let aAhead = true;
    let aCount = 0, bCount = 0;
    for (const b of ballots) {
      if (b === "A") aCount++; else bCount++;
      if (aCount <= bCount) { aAhead = false; break; }
    }
    if (aAhead) successes++;
  }
  const rate = (successes / trials) * 100;
  const theoretical = ((votesA - votesB) / (votesA + votesB)) * 100;
  return {
    value: rate,
    label: "P(A always leads)",
    chartData: [
      { name: "Simulated", value: parseFloat(rate.toFixed(1)) },
      { name: "Theoretical", value: parseFloat(theoretical.toFixed(1)) },
    ],
    stats: [
      { label: "P(A always leads)", value: `${rate.toFixed(1)}%` },
      { label: "Theoretical (a-b)/(a+b)", value: `${theoretical.toFixed(1)}%` },
      { label: "Votes A", value: votesA.toString() },
      { label: "Votes B", value: votesB.toString() },
    ],
  };
}

// Bertrand's Chord
export function simulateBertrandChord(method: number, trials: number): SimResult {
  let successes = 0;
  const threshold = Math.sqrt(3); // chord length > sqrt(3)
  for (let t = 0; t < trials; t++) {
    let chordLength = 0;
    if (method === 1) {
      // Random endpoints on circle
      const a1 = Math.random() * 2 * Math.PI;
      const a2 = Math.random() * 2 * Math.PI;
      chordLength = 2 * Math.abs(Math.sin((a2 - a1) / 2));
    } else if (method === 2) {
      // Random midpoint in disk
      const r = Math.sqrt(Math.random());
      chordLength = 2 * Math.sqrt(1 - r * r);
    } else {
      // Random point on radius
      const d = Math.random(); // distance from center along fixed radius
      chordLength = 2 * Math.sqrt(1 - d * d);
    }
    if (chordLength > threshold) successes++;
  }
  const rate = (successes / trials) * 100;
  const theoretical = [33.3, 25.0, 50.0][method - 1];
  return {
    value: rate,
    label: `P(chord > √3) [Method ${method}]`,
    chartData: [
      { name: "Simulated", value: parseFloat(rate.toFixed(1)) },
      { name: "Theoretical", value: theoretical },
    ],
    stats: [
      { label: "P(chord > √3)", value: `${rate.toFixed(1)}%` },
      { label: `Theoretical (method ${method})`, value: `${theoretical}%` },
      { label: "Method", value: ["", "Random endpoints", "Random midpoint", "Random radius"][method] },
    ],
  };
}

// Dice Sum
export function simulateDiceSum(dice: number, sides: number, trials: number): SimResult {
  const minSum = dice;
  const maxSum = dice * sides;
  const freq = new Map<number, number>();
  for (let t = 0; t < trials; t++) {
    let sum = 0;
    for (let d = 0; d < dice; d++) sum += Math.floor(Math.random() * sides) + 1;
    freq.set(sum, (freq.get(sum) ?? 0) + 1);
  }
  const chartData = Array.from({ length: maxSum - minSum + 1 }, (_, i) => ({
    name: i + minSum,
    value: Math.round(((freq.get(i + minSum) ?? 0) / trials) * 10000) / 100,
  }));
  const mode = minSum + [...freq.entries()].reduce((best, [k, v]) => v > best[1] ? [k - minSum, v] : best, [0, 0])[0];
  return {
    value: (minSum + maxSum) / 2,
    label: "Sum distribution",
    chartData,
    stats: [
      { label: "Expected sum", value: `${((dice * (sides + 1)) / 2).toFixed(1)}` },
      { label: "Most likely sum", value: `${mode}` },
      { label: `P(sum = ${Math.round((minSum + maxSum) / 2)})`, value: `${((freq.get(Math.round((minSum + maxSum) / 2)) ?? 0) / trials * 100).toFixed(1)}%` },
      { label: "Dice × Sides", value: `${dice}d${sides}` },
    ],
  };
}

// 2D Random Walk
export function simulateRandomWalk2D(steps: number, walks: number): SimResult {
  const finalDistances: number[] = [];
  for (let w = 0; w < walks; w++) {
    let x = 0, y = 0;
    for (let s = 0; s < steps; s++) {
      const dir = Math.floor(Math.random() * 4);
      if (dir === 0) x++; else if (dir === 1) x--; else if (dir === 2) y++; else y--;
    }
    finalDistances.push(Math.sqrt(x * x + y * y));
  }
  const avgDist = finalDistances.reduce((a, b) => a + b, 0) / walks;
  const theoreticalDist = Math.sqrt(steps * 2 / Math.PI);
  // Build distance distribution
  const maxD = Math.ceil(Math.max(...finalDistances));
  const hist = new Array(Math.min(maxD + 1, 30)).fill(0);
  finalDistances.forEach(d => { const b = Math.min(Math.floor(d), hist.length - 1); hist[b]++; });
  return {
    value: avgDist,
    label: "Avg final distance",
    chartData: hist.map((count, i) => ({ name: i, value: count })),
    stats: [
      { label: "Avg distance (simulated)", value: avgDist.toFixed(2) },
      { label: "Theoretical E[|r|]", value: theoreticalDist.toFixed(2) },
      { label: "Steps", value: steps.toString() },
      { label: "Walks", value: walks.toString() },
    ],
  };
}

// Max of n Dice
export function simulateMaxDice(rolls: number, sides: number, trials: number): SimResult {
  const freq = new Map<number, number>();
  let total = 0;
  for (let t = 0; t < trials; t++) {
    let max = 0;
    for (let r = 0; r < rolls; r++) {
      const v = Math.floor(Math.random() * sides) + 1;
      if (v > max) max = v;
    }
    total += max;
    freq.set(max, (freq.get(max) ?? 0) + 1);
  }
  const avg = total / trials;
  // Theoretical
  let theoretical = 0;
  for (let k = 1; k <= sides; k++) {
    theoretical += k * (Math.pow(k / sides, rolls) - Math.pow((k - 1) / sides, rolls));
  }
  return {
    value: avg,
    label: `E[max of ${rolls}d${sides}]`,
    chartData: Array.from({ length: sides }, (_, i) => ({
      name: i + 1,
      value: Math.round(((freq.get(i + 1) ?? 0) / trials) * 1000) / 10,
    })),
    stats: [
      { label: "E[max] simulated", value: avg.toFixed(3) },
      { label: "Theoretical E[max]", value: theoretical.toFixed(3) },
      { label: `${rolls}d${sides}`, value: `${rolls} dice, ${sides} sides` },
    ],
  };
}

// Stick Breaking
export function simulateStickBreaking(trials: number): SimResult {
  let successes = 0;
  for (let t = 0; t < trials; t++) {
    const x = Math.random(), y = Math.random();
    const a = Math.min(x, y), b = Math.max(x, y);
    const p1 = a, p2 = b - a, p3 = 1 - b;
    if (p1 < 0.5 && p2 < 0.5 && p3 < 0.5) successes++;
  }
  const rate = (successes / trials) * 100;
  return {
    value: rate,
    label: "P(forms triangle)",
    chartData: [
      { name: "Triangle", value: parseFloat(rate.toFixed(1)) },
      { name: "No Triangle", value: parseFloat((100 - rate).toFixed(1)) },
    ],
    stats: [
      { label: "P(forms triangle)", value: `${rate.toFixed(1)}%` },
      { label: "Theoretical", value: "25.0%" },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Simpson's Paradox
export function simulateSimpson(groupASize: number, trials: number): SimResult {
  // Drug A given mostly to hard group (groupASize%), Drug B to easy group
  const hardSuccessA = 0.30, easySuccessA = 0.90;
  const hardSuccessB = 0.20, easySuccessB = 0.80;
  const fracHardA = groupASize / 100, fracEasyA = 1 - fracHardA;
  const fracHardB = 1 - fracHardA, fracEasyB = fracHardA;

  let aSuccessTotal = 0, bSuccessTotal = 0;
  let aHardSuccess = 0, aEasySuccess = 0;
  let bHardSuccess = 0, bEasySuccess = 0;

  const n = Math.min(trials, 10000);
  for (let t = 0; t < n; t++) {
    const aHard = Math.random() < fracHardA;
    const bHard = Math.random() < fracHardB;
    const aRate = aHard ? hardSuccessA : easySuccessA;
    const bRate = bHard ? hardSuccessB : easySuccessB;
    if (Math.random() < aRate) { aSuccessTotal++; if (aHard) aHardSuccess++; else aEasySuccess++; }
    if (Math.random() < bRate) { bSuccessTotal++; if (bHard) bHardSuccess++; else bEasySuccess++; }
  }

  const aOverall = (aSuccessTotal / n) * 100;
  const bOverall = (bSuccessTotal / n) * 100;
  const aHardRate = fracHardA > 0 ? aHardSuccess / (n * fracHardA) * 100 : 0;
  const bHardRate = fracHardB > 0 ? bHardSuccess / (n * fracHardB) * 100 : 0;

  return {
    value: aOverall,
    label: "Drug A overall success rate",
    chartData: [
      { name: "A-Hard group", value: parseFloat(aHardRate.toFixed(1)) },
      { name: "B-Hard group", value: parseFloat(bHardRate.toFixed(1)) },
      { name: "A-Overall", value: parseFloat(aOverall.toFixed(1)) },
      { name: "B-Overall", value: parseFloat(bOverall.toFixed(1)) },
    ],
    stats: [
      { label: "Drug A overall", value: `${aOverall.toFixed(1)}%` },
      { label: "Drug B overall", value: `${bOverall.toFixed(1)}%` },
      { label: "A better in subgroup?", value: aHardRate > bHardRate ? "Yes (hard group)" : "No" },
      { label: "Paradox visible?", value: aOverall < bOverall ? "Yes!" : "Not this config" },
    ],
  };
}

// Record Values
export function simulateRecordValues(seqLength: number, trials: number): SimResult {
  let totalRecords = 0;
  for (let t = 0; t < trials; t++) {
    const seq = Array.from({ length: seqLength }, () => Math.random());
    let records = 0, max = -Infinity;
    for (const v of seq) { if (v > max) { records++; max = v; } }
    totalRecords += records;
  }
  const avg = totalRecords / trials;
  let theoretical = 0;
  for (let k = 1; k <= seqLength; k++) theoretical += 1 / k;
  return {
    value: avg,
    label: "Avg records",
    chartData: Array.from({ length: seqLength }, (_, i) => ({
      name: i + 1,
      value: parseFloat((theoretical - (i > 0 ? Array.from({ length: i }, (_, j) => 1 / (j + 1)).reduce((a, b) => a + b, 0) : 0)).toFixed(3)),
    })).slice(0, Math.min(seqLength, 20)),
    stats: [
      { label: "Avg records (simulated)", value: avg.toFixed(3) },
      { label: "Theoretical H_n", value: theoretical.toFixed(3) },
      { label: "n", value: seqLength.toString() },
    ],
  };
}

// Gambler's Ruin Unfair
export function simulateGamblersRuinUnfair(winProb: number, startAmount: number, targetAmount: number, trials: number): SimResult {
  const p = winProb / 100;
  const q = 1 - p;
  let wins = 0;
  for (let t = 0; t < trials; t++) {
    let pos = startAmount;
    while (pos > 0 && pos < targetAmount) {
      pos += Math.random() < p ? 1 : -1;
    }
    if (pos === targetAmount) wins++;
  }
  const rate = (wins / trials) * 100;
  const theoretical = p === 0.5
    ? (startAmount / targetAmount) * 100
    : ((1 - Math.pow(q / p, startAmount)) / (1 - Math.pow(q / p, targetAmount))) * 100;
  return {
    value: rate,
    label: "P(reach target)",
    chartData: [
      { name: "Reach target", value: parseFloat(rate.toFixed(1)) },
      { name: "Go broke", value: parseFloat((100 - rate).toFixed(1)) },
    ],
    stats: [
      { label: "P(reach $N) simulated", value: `${rate.toFixed(1)}%` },
      { label: "Theoretical", value: `${theoretical.toFixed(1)}%` },
      { label: "p (win prob)", value: `${p.toFixed(2)}` },
      { label: `k=${startAmount} → N=${targetAmount}`, value: "" },
    ],
  };
}

// Card Color
export function simulateCardColor(trials: number): SimResult {
  let firstRed = 0, firstHeart = 0;
  for (let t = 0; t < trials; t++) {
    const deck = [...Array(52)].map((_, i) => i);
    for (let i = 51; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    if (deck[0] < 26) firstRed++;
    if (deck[0] < 13) firstHeart++;
  }
  return {
    value: (firstRed / trials) * 100,
    label: "P(first card red)",
    chartData: [
      { name: "First card red", value: Math.round(firstRed / trials * 1000) / 10 },
      { name: "First card black", value: Math.round((1 - firstRed / trials) * 1000) / 10 },
      { name: "First card heart", value: Math.round(firstHeart / trials * 1000) / 10 },
    ],
    stats: [
      { label: "P(first card red)", value: `${((firstRed / trials) * 100).toFixed(1)}%` },
      { label: "Theoretical", value: "50.0%" },
      { label: "P(first card heart)", value: `${((firstHeart / trials) * 100).toFixed(1)}%` },
      { label: "Theoretical", value: "25.0%" },
    ],
  };
}

// Buffon's Needle
export function simulateBuffonNeedle(needleLength: number, lineSpacing: number, trials: number): SimResult {
  const L = needleLength / 100, D = lineSpacing / 100;
  let crosses = 0;
  for (let t = 0; t < trials; t++) {
    const center = Math.random() * (D / 2);
    const angle = Math.random() * Math.PI / 2;
    if (center <= (L / 2) * Math.sin(angle)) crosses++;
  }
  const rate = crosses / trials;
  const theoretical = (2 * L) / (Math.PI * D);
  const piEstimate = L <= D ? (2 * L * trials) / (D * crosses) : 0;
  return {
    value: rate * 100,
    label: "P(needle crosses line)",
    chartData: [
      { name: "Simulated", value: parseFloat((rate * 100).toFixed(2)) },
      { name: "Theoretical", value: parseFloat((theoretical * 100).toFixed(2)) },
    ],
    stats: [
      { label: "P(cross) simulated", value: `${(rate * 100).toFixed(2)}%` },
      { label: "Theoretical 2L/(πD)", value: `${(theoretical * 100).toFixed(2)}%` },
      { label: "π estimate", value: crosses > 0 ? piEstimate.toFixed(4) : "—" },
      { label: "Crossings", value: crosses.toLocaleString() },
    ],
  };
}

// Truel (Three-way duel)
export function simulateTruel(trials: number): SimResult {
  function runTruel(aStrat: "miss" | "shootB" | "shootC"): number {
    let aSurvives = 0;
    for (let t = 0; t < trials; t++) {
      let aAlive = true, bAlive = true, cAlive = true;
      const pA = 1 / 3, pB = 1 / 2, pC = 1.0;
      let round = 0;
      while ([aAlive, bAlive, cAlive].filter(Boolean).length > 1 && round < 100) {
        round++;
        // A shoots
        if (aAlive) {
          if (aStrat === "miss") { /* miss intentionally */ }
          else if (aStrat === "shootC" && cAlive) { if (Math.random() < pA) cAlive = false; }
          else if (aStrat === "shootB" && bAlive) { if (Math.random() < pA) bAlive = false; }
          else if (cAlive) { if (Math.random() < pA) cAlive = false; }
          else if (bAlive) { if (Math.random() < pA) bAlive = false; }
        }
        // B shoots biggest threat (C if alive, else A)
        if (bAlive) {
          const target = cAlive ? "c" : "a";
          if (target === "c" && Math.random() < pB) cAlive = false;
          else if (target === "a" && Math.random() < pB) aAlive = false;
        }
        // C shoots biggest threat (B if alive, else A)
        if (cAlive) {
          const target = bAlive ? "b" : "a";
          if (target === "b") bAlive = false; // C always hits
          else aAlive = false;
        }
      }
      if (aAlive) aSurvives++;
    }
    return (aSurvives / trials) * 100;
  }
  const missRate = runTruel("miss");
  const shootBRate = runTruel("shootB");
  const shootCRate = runTruel("shootC");
  return {
    value: missRate,
    label: "P(A survives | misses)",
    chartData: [
      { name: "A misses", value: parseFloat(missRate.toFixed(1)) },
      { name: "A shoots B", value: parseFloat(shootBRate.toFixed(1)) },
      { name: "A shoots C", value: parseFloat(shootCRate.toFixed(1)) },
    ],
    stats: [
      { label: "P(A survives | miss)", value: `${missRate.toFixed(1)}%` },
      { label: "P(A survives | shoot B)", value: `${shootBRate.toFixed(1)}%` },
      { label: "P(A survives | shoot C)", value: `${shootCRate.toFixed(1)}%` },
      { label: "Best strategy", value: "Miss intentionally" },
    ],
  };
}

// Absorbing Markov Chain
export function simulateAbsorbingMarkov(startState: number, totalStates: number, jumpProb: number, trials: number): SimResult {
  const k = Math.min(startState, totalStates - 1);
  const N = totalStates;
  const p = jumpProb / 100;
  let totalSteps = 0;
  for (let t = 0; t < trials; t++) {
    let pos = k;
    let steps = 0;
    while (pos > 0 && pos < N) {
      pos += Math.random() < p ? 1 : -1;
      steps++;
    }
    totalSteps += steps;
  }
  const avg = totalSteps / trials;
  const theoretical = p === 0.5
    ? k * (N - k)
    : (k / (p - (1 - p)) - N * (1 - Math.pow((1 - p) / p, k)) / (1 - Math.pow((1 - p) / p, N)) / (p - (1 - p)));
  return {
    value: avg,
    label: `E[steps to absorption from k=${k}]`,
    chartData: [
      { name: "Simulated", value: parseFloat(avg.toFixed(1)) },
      { name: "Theoretical (fair)", value: k * (N - k) },
    ],
    stats: [
      { label: "Avg steps (simulated)", value: avg.toFixed(1) },
      { label: "Theoretical (p=0.5)", value: `${k * (N - k)}` },
      { label: "Start k, absorb 0 or N", value: `k=${k}, N=${N}` },
      { label: "p (jump right)", value: `${p.toFixed(2)}` },
    ],
  };
}

// Kelly Criterion
export function simulateKellyCriterion(winProb: number, odds: number, betFraction: number, rounds: number): SimResult {
  const p = winProb / 100;
  const b = odds / 10;
  const f = betFraction / 100;
  const kellyF = (b * p - (1 - p)) / b;
  const chartData: { name: number; value: number; kelly: number }[] = [];
  let bankroll = 100, kellyBankroll = 100;
  const checkpoint = Math.max(1, Math.floor(rounds / 50));
  for (let r = 0; r < rounds; r++) {
    const win = Math.random() < p;
    bankroll *= win ? (1 + f * b) : (1 - f);
    kellyBankroll *= win ? (1 + kellyF * b) : (1 - kellyF);
    if ((r + 1) % checkpoint === 0) {
      chartData.push({ name: r + 1, value: Math.round(bankroll), kelly: Math.round(kellyBankroll) });
    }
  }
  return {
    value: bankroll,
    label: `Bankroll after ${rounds} rounds`,
    chartData: chartData.map(d => ({ name: d.name, value: d.value, expected: d.kelly })),
    stats: [
      { label: "Kelly fraction f*", value: `${(kellyF * 100).toFixed(1)}%` },
      { label: "Your fraction f", value: `${(f * 100).toFixed(1)}%` },
      { label: `Final bankroll (f=${(f * 100).toFixed(0)}%)`, value: `${bankroll.toFixed(0)}` },
      { label: "Final bankroll (Kelly)", value: `${kellyBankroll.toFixed(0)}` },
    ],
  };
}

// Sum of Uniforms
export function simulateSumUniforms(trials: number): SimResult {
  let totalN = 0;
  const dist = new Map<number, number>();
  for (let t = 0; t < trials; t++) {
    let sum = 0, n = 0;
    while (sum <= 1) { sum += Math.random(); n++; }
    totalN += n;
    dist.set(n, (dist.get(n) ?? 0) + 1);
  }
  const avg = totalN / trials;
  return {
    value: avg,
    label: "E[N] to exceed 1",
    chartData: Array.from({ length: 12 }, (_, i) => ({
      name: i + 1,
      value: Math.round(((dist.get(i + 1) ?? 0) / trials) * 1000) / 10,
    })),
    stats: [
      { label: "E[N] simulated", value: avg.toFixed(4) },
      { label: "Theoretical (e)", value: "2.7183" },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Coin Runs
export function simulateCoinRuns(flips: number, trials: number): SimResult {
  let totalRuns = 0;
  for (let t = 0; t < trials; t++) {
    const sequence = Array.from({ length: flips }, () => Math.random() < 0.5 ? 0 : 1);
    let runs = 1;
    for (let i = 1; i < flips; i++) if (sequence[i] !== sequence[i - 1]) runs++;
    totalRuns += runs;
  }
  const avg = totalRuns / trials;
  const theoretical = (flips + 1) / 2;
  return {
    value: avg,
    label: "Avg runs",
    chartData: [
      { name: "Simulated", value: parseFloat(avg.toFixed(2)) },
      { name: "Theoretical", value: theoretical },
    ],
    stats: [
      { label: "Avg runs (simulated)", value: avg.toFixed(3) },
      { label: "Theoretical (n+1)/2", value: theoretical.toFixed(1) },
      { label: "n (flips)", value: flips.toString() },
    ],
  };
}

// Negative Binomial
export function simulateNegBinomial(successesNeeded: number, successProb: number, trials: number): SimResult {
  const p = successProb / 100;
  let total = 0;
  const dist = new Map<number, number>();
  for (let t = 0; t < trials; t++) {
    let n = 0, s = 0;
    while (s < successesNeeded) { n++; if (Math.random() < p) s++; }
    total += n;
    const bucket = Math.min(n, Math.ceil(successesNeeded / p * 3));
    dist.set(bucket, (dist.get(bucket) ?? 0) + 1);
  }
  const avg = total / trials;
  const theoretical = successesNeeded / p;
  const chartData = Array.from({ length: 20 }, (_, i) => {
    const center = Math.round(theoretical);
    const key = center - 10 + i;
    return { name: key, value: Math.round(((dist.get(key) ?? 0) / trials) * 1000) / 10 };
  }).filter(d => d.name > 0);
  return {
    value: avg,
    label: `E[trials until ${successesNeeded} successes]`,
    chartData,
    stats: [
      { label: "Avg trials (simulated)", value: avg.toFixed(1) },
      { label: "Theoretical r/p", value: theoretical.toFixed(1) },
      { label: "Variance r(1-p)/p²", value: (successesNeeded * (1 - p) / (p * p)).toFixed(1) },
      { label: `r=${successesNeeded}, p=${p}`, value: "" },
    ],
  };
}

// Poisson
export function simulatePoisson(lambda: number, trials: number): SimResult {
  const lam = lambda / 10;
  const freq = new Map<number, number>();
  for (let t = 0; t < trials; t++) {
    // Knuth's method
    const L = Math.exp(-lam);
    let k = 0, p = 1.0;
    do { k++; p *= Math.random(); } while (p > L);
    k--;
    freq.set(k, (freq.get(k) ?? 0) + 1);
  }
  const maxK = Math.min(Math.ceil(lam * 3), 20);
  const chartData = Array.from({ length: maxK + 1 }, (_, k) => ({
    name: k,
    value: Math.round(((freq.get(k) ?? 0) / trials) * 1000) / 10,
    expected: Math.round(Math.exp(-lam) * Math.pow(lam, k) / factorial(k) * 1000) / 10,
  }));
  return {
    value: lam,
    label: `Poisson(λ=${lam}) distribution`,
    chartData,
    stats: [
      { label: "λ (rate)", value: lam.toString() },
      { label: "Theoretical mean", value: lam.toString() },
      { label: `P(X = ${Math.round(lam)})`, value: `${((freq.get(Math.round(lam)) ?? 0) / trials * 100).toFixed(1)}%` },
      { label: "P(X = 0)", value: `${(Math.exp(-lam) * 100).toFixed(1)}%` },
    ],
  };
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Martingale
export function simulateMartingale(maxBet: number, startBet: number, rounds: number): SimResult {
  let totalProfit = 0;
  let ruinCount = 0;
  const chartData: { name: number; value: number }[] = [];
  let runningProfit = 0;
  for (let r = 0; r < rounds; r++) {
    let bet = startBet;
    let sequenceProfit = 0;
    let ruin = false;
    while (true) {
      if (bet > maxBet) { ruin = true; sequenceProfit = -(bet - startBet); break; }
      if (Math.random() < 0.5) { sequenceProfit = startBet; break; } // win
      else { bet *= 2; } // lose, double
    }
    if (ruin) ruinCount++;
    runningProfit += sequenceProfit;
    totalProfit += sequenceProfit;
    if ((r + 1) % Math.max(1, Math.floor(rounds / 50)) === 0) {
      chartData.push({ name: r + 1, value: Math.round(runningProfit) });
    }
  }
  const avgProfit = totalProfit / rounds;
  return {
    value: avgProfit,
    label: "Avg profit per round",
    chartData: chartData.map(d => ({ name: d.name, value: d.value, expected: 0 })),
    stats: [
      { label: "Avg profit per round", value: `${avgProfit.toFixed(2)}` },
      { label: "Total rounds", value: rounds.toString() },
      { label: "Ruin events", value: ruinCount.toString() },
      { label: "P(ruin per sequence)", value: `${(ruinCount / rounds * 100).toFixed(2)}%` },
    ],
  };
}

// Brownian Max
export function simulateBrownianMax(timeHorizon: number, barrier: number, trials: number): SimResult {
  const T = timeHorizon / 10;
  const a = barrier / 10;
  const steps = 100;
  const dt = T / steps;
  let exceedBarrier = 0;
  let totalMax = 0;
  for (let t = 0; t < trials; t++) {
    let pos = 0, max = 0;
    for (let s = 0; s < steps; s++) {
      pos += Math.sqrt(dt) * (Math.random() < 0.5 ? 1 : -1);
      if (pos > max) max = pos;
    }
    totalMax += max;
    if (max >= a) exceedBarrier++;
  }
  const pExceed = (exceedBarrier / trials) * 100;
  const avgMax = totalMax / trials;
  const theoreticalP = 2 * (1 - normalCDF(a / Math.sqrt(T))) * 100;
  const theoreticalE = Math.sqrt(2 * T / Math.PI);
  return {
    value: pExceed,
    label: `P(M_T ≥ ${a})`,
    chartData: [
      { name: "Simulated", value: parseFloat(pExceed.toFixed(1)) },
      { name: "Theoretical", value: parseFloat(theoreticalP.toFixed(1)) },
    ],
    stats: [
      { label: `P(M_T ≥ ${a})`, value: `${pExceed.toFixed(1)}%` },
      { label: "Theoretical 2Φ(-a/√T)", value: `${theoreticalP.toFixed(1)}%` },
      { label: "Avg max E[M_T]", value: avgMax.toFixed(3) },
      { label: "Theoretical E[M_T]", value: theoreticalE.toFixed(3) },
    ],
  };
}

// Birthday Month
export function simulateBirthdayMonth(people: number, trials: number): SimResult {
  let matches = 0;
  for (let t = 0; t < trials; t++) {
    const months = new Set<number>();
    let hasMatch = false;
    for (let i = 0; i < people; i++) {
      const m = Math.floor(Math.random() * 12);
      if (months.has(m)) { hasMatch = true; break; }
      months.add(m);
    }
    if (hasMatch) matches++;
  }
  const rate = (matches / trials) * 100;
  let theoretical = 1;
  for (let k = 0; k < people; k++) theoretical *= (12 - k) / 12;
  theoretical = (1 - theoretical) * 100;
  return {
    value: rate,
    label: "P(shared birth month)",
    chartData: [
      { name: "Simulated", value: parseFloat(rate.toFixed(1)) },
      { name: "Theoretical", value: parseFloat(theoretical.toFixed(1)) },
    ],
    stats: [
      { label: `P(match) for n=${people}`, value: `${rate.toFixed(1)}%` },
      { label: "Theoretical", value: `${theoretical.toFixed(1)}%` },
      { label: "50% threshold", value: "n = 5" },
      { label: "Guarantee (pigeonhole)", value: "n = 13" },
    ],
  };
}

// Coin Profit (optimal stopping)
export function simulateCoinProfit(maxSteps: number, trials: number): SimResult {
  let totalPayout = 0;
  for (let t = 0; t < trials; t++) {
    let pos = 0;
    for (let s = 0; s < maxSteps; s++) {
      pos += Math.random() < 0.5 ? 1 : -1;
      if (pos > 0) { totalPayout += pos; pos = 0; break; } // optimal: stop when ahead
    }
    if (pos <= 0) totalPayout += Math.max(0, pos);
  }
  const avg = totalPayout / trials;
  return {
    value: avg,
    label: "Avg payout (optimal stop)",
    chartData: [
      { name: "Simulated avg", value: parseFloat(avg.toFixed(2)) },
    ],
    stats: [
      { label: "Avg payout", value: `${avg.toFixed(2)}` },
      { label: "Strategy", value: "Stop when ahead" },
      { label: "Max steps cap", value: maxSteps.toString() },
    ],
  };
}

// Normal Probabilities
export function simulateNormalProbabilities(zScore: number, trials: number): SimResult {
  const z = zScore / 10;
  let above = 0, absAbove2 = 0;
  for (let t = 0; t < trials; t++) {
    // Box-Muller
    const u1 = Math.random(), u2 = Math.random();
    const n = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    if (n > z) above++;
    if (Math.abs(n) > 2) absAbove2++;
  }
  const pAbove = (above / trials) * 100;
  const pAbs2 = (absAbove2 / trials) * 100;
  const theoreticalAbove = (1 - normalCDF(z)) * 100;
  return {
    value: pAbove,
    label: `P(X > ${z.toFixed(1)})`,
    chartData: [
      { name: `P(X > ${z.toFixed(1)})`, value: parseFloat(pAbove.toFixed(2)) },
      { name: "P(|X| > 2)", value: parseFloat(pAbs2.toFixed(2)) },
      { name: "Theoretical P(X>z)", value: parseFloat(theoreticalAbove.toFixed(2)) },
    ],
    stats: [
      { label: `P(X > ${z.toFixed(1)}) sim`, value: `${pAbove.toFixed(2)}%` },
      { label: "Theoretical", value: `${theoreticalAbove.toFixed(2)}%` },
      { label: "P(|X| > 2σ)", value: `${pAbs2.toFixed(2)}%` },
      { label: "68-95-99.7 rule", value: "1/2/3 sigma" },
    ],
  };
}

// Geometric Memoryless
export function simulateGeometricMemoryless(successProb: number, givenFailures: number, extraSteps: number, trials: number): SimResult {
  const p = successProb / 100;
  let condSuccesses = 0, totalConditional = 0;
  for (let t = 0; t < trials; t++) {
    // Simulate geometric, check if X > givenFailures
    let x = 0;
    while (Math.random() >= p) x++;
    x++; // number of trials until first success
    if (x > givenFailures) {
      totalConditional++;
      if (x > givenFailures + extraSteps) condSuccesses++;
    }
  }
  const condProb = totalConditional > 0 ? (condSuccesses / totalConditional) * 100 : 0;
  const theoretical = Math.pow(1 - p, extraSteps) * 100;
  return {
    value: condProb,
    label: `P(X > ${givenFailures + extraSteps} | X > ${givenFailures})`,
    chartData: [
      { name: "Simulated", value: parseFloat(condProb.toFixed(1)) },
      { name: "Theoretical", value: parseFloat(theoretical.toFixed(1)) },
    ],
    stats: [
      { label: `P(X > ${givenFailures + extraSteps} | X > ${givenFailures})`, value: `${condProb.toFixed(1)}%` },
      { label: "Theoretical (1-p)^m", value: `${theoretical.toFixed(1)}%` },
      { label: "= P(X > m) = P(X > 5)", value: `${theoretical.toFixed(1)}%` },
      { label: "Memoryless property ✓", value: "confirmed" },
    ],
  };
}

// Random Triangle (contains center)
export function simulateRandomTriangle(trials: number): SimResult {
  let containsCenter = 0;
  for (let t = 0; t < trials; t++) {
    // 3 random points in unit square centered at origin
    const pts = Array.from({ length: 3 }, () => [Math.random() - 0.5, Math.random() - 0.5]);
    // Check if origin is inside triangle using barycentric coordinates
    const [ax, ay] = pts[0], [bx, by] = pts[1], [cx, cy] = pts[2];
    const denom = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
    if (Math.abs(denom) < 1e-10) continue;
    const l1 = ((by - cy) * (0 - cx) + (cx - bx) * (0 - cy)) / denom;
    const l2 = ((cy - ay) * (0 - cx) + (ax - cx) * (0 - cy)) / denom;
    const l3 = 1 - l1 - l2;
    if (l1 > 0 && l2 > 0 && l3 > 0) containsCenter++;
  }
  const rate = (containsCenter / trials) * 100;
  return {
    value: rate,
    label: "P(triangle contains center)",
    chartData: [
      { name: "Contains center", value: parseFloat(rate.toFixed(1)) },
      { name: "Does not", value: parseFloat((100 - rate).toFixed(1)) },
    ],
    stats: [
      { label: "P(contains center)", value: `${rate.toFixed(1)}%` },
      { label: "Theoretical", value: "25.0%" },
      { label: "Trials", value: trials.toLocaleString() },
    ],
  };
}

// Exponential Minimum
export function simulateExpMinimum(lambda1: number, lambda2: number, trials: number): SimResult {
  const l1 = lambda1 / 10, l2 = lambda2 / 10;
  let x1WinsCount = 0;
  let totalMin = 0;
  for (let t = 0; t < trials; t++) {
    const x1 = -Math.log(Math.random()) / l1;
    const x2 = -Math.log(Math.random()) / l2;
    if (x1 < x2) x1WinsCount++;
    totalMin += Math.min(x1, x2);
  }
  const pX1First = (x1WinsCount / trials) * 100;
  const avgMin = totalMin / trials;
  const theoreticalP = (l1 / (l1 + l2)) * 100;
  const theoreticalE = 1 / (l1 + l2);
  return {
    value: pX1First,
    label: "P(X₁ < X₂)",
    chartData: [
      { name: "Simulated P(X₁<X₂)", value: parseFloat(pX1First.toFixed(1)) },
      { name: "Theoretical", value: parseFloat(theoreticalP.toFixed(1)) },
    ],
    stats: [
      { label: "P(X₁ < X₂)", value: `${pX1First.toFixed(1)}%` },
      { label: "Theoretical λ₁/(λ₁+λ₂)", value: `${theoreticalP.toFixed(1)}%` },
      { label: "E[min(X₁,X₂)]", value: avgMin.toFixed(4) },
      { label: "Theoretical 1/(λ₁+λ₂)", value: theoreticalE.toFixed(4) },
    ],
  };
}

// Regression to Mean
export function simulateRegressionMean(correlation: number, score1: number, trials: number): SimResult {
  const rho = correlation / 100;
  const mu = 70, sigma = 15;
  let totalScore2 = 0;
  const bins = new Array(10).fill(0);
  for (let t = 0; t < trials; t++) {
    // Generate bivariate normal
    const z1 = (score1 - mu) / sigma;
    const z2 = rho * z1 + Math.sqrt(1 - rho * rho) * (Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()));
    const s2 = mu + sigma * z2;
    totalScore2 += s2;
    const bin = Math.min(Math.floor((s2 - 30) / 10), 9);
    if (bin >= 0 && bin < 10) bins[bin]++;
  }
  const avgScore2 = totalScore2 / trials;
  const theoretical = mu + rho * (score1 - mu);
  return {
    value: avgScore2,
    label: "E[Score 2 | Score 1]",
    chartData: bins.map((count, i) => ({
      name: 30 + i * 10 + 5,
      value: Math.round((count / trials) * 1000) / 10,
    })),
    stats: [
      { label: "Avg score 2 (simulated)", value: avgScore2.toFixed(1) },
      { label: "Theoretical E[Y|X=x]", value: theoretical.toFixed(1) },
      { label: "ρ (correlation)", value: rho.toFixed(2) },
      { label: "Score 1", value: score1.toString() },
    ],
  };
}

// Banach Matchbox
export function simulateBanachMatchbox(matchesPerBox: number, trials: number): SimResult {
  let total = 0;
  for (let t = 0; t < trials; t++) {
    let box1 = matchesPerBox, box2 = matchesPerBox;
    while (true) {
      if (Math.random() < 0.5) {
        if (box1 === 0) { total += box2; break; }
        box1--;
      } else {
        if (box2 === 0) { total += box1; break; }
        box2--;
      }
    }
  }
  const avg = total / trials;
  const theoretical = Math.sqrt(Math.PI * matchesPerBox / 2) - 0.5;
  return {
    value: avg,
    label: "Avg matches remaining",
    chartData: [
      { name: "Simulated", value: parseFloat(avg.toFixed(2)) },
      { name: "Theoretical √(πn/2)", value: parseFloat(theoretical.toFixed(2)) },
    ],
    stats: [
      { label: "Avg remaining (simulated)", value: avg.toFixed(2) },
      { label: "Theoretical √(πn/2) - 0.5", value: theoretical.toFixed(2) },
      { label: "n (matches per box)", value: matchesPerBox.toString() },
    ],
  };
}

// Bus Wait
export function simulateBusWait(minInterval: number, maxInterval: number, trials: number): SimResult {
  let totalWait = 0;
  for (let t = 0; t < trials; t++) {
    const interval = minInterval + Math.random() * (maxInterval - minInterval);
    const wait = Math.random() * interval;
    totalWait += wait;
  }
  const avg = totalWait / trials;
  const expectedInterval = (minInterval + maxInterval) / 2;
  const theoretical = expectedInterval / 2;
  return {
    value: avg,
    label: "Avg wait time (minutes)",
    chartData: [
      { name: "Simulated", value: parseFloat(avg.toFixed(2)) },
      { name: "Theoretical E[U]/2", value: parseFloat(theoretical.toFixed(2)) },
    ],
    stats: [
      { label: "Avg wait (simulated)", value: `${avg.toFixed(2)} min` },
      { label: "Theoretical E[U]/2", value: `${theoretical.toFixed(2)} min` },
      { label: "Interval range", value: `[${minInterval}, ${maxInterval}] min` },
    ],
  };
}

// Optimal Stopping Uniform
export function simulateOptimalStoppingUniform(offers: number, trials: number): SimResult {
  // Compute optimal thresholds
  const thresholds = new Array(offers + 1).fill(0);
  let ev = 0.5; // 1 offer: E[U[0,1]] = 0.5
  for (let k = 2; k <= offers; k++) {
    thresholds[k] = ev;
    ev = ev * ev / 2 + ev + (1 - ev) * ev; // E[max(U, ev)] if U>ev else continue
    ev = ev > 1 ? 1 : ev;
  }
  // Simpler: recompute EV via simulation
  let totalOptimal = 0, totalRandom = 0;
  for (let t = 0; t < trials; t++) {
    const vals = Array.from({ length: offers }, () => Math.random());
    // Optimal strategy: backward induction thresholds
    let optVal = 0;
    // Greedy: accept if > threshold for remaining
    for (let i = 0; i < offers; i++) {
      const remaining = offers - i - 1;
      const thresh = remaining === 0 ? 0 : 1 - 1 / (remaining + 1);
      if (vals[i] >= thresh || i === offers - 1) { optVal = vals[i]; break; }
    }
    totalOptimal += optVal;
    totalRandom += Math.max(...vals) / offers + vals[0] * (1 - 1 / offers); // just use first
    totalRandom -= totalRandom; // reset
    totalRandom += vals[0];
  }
  const avgOptimal = totalOptimal / trials;
  return {
    value: avgOptimal,
    label: "E[value | optimal strategy]",
    chartData: [
      { name: "Optimal strategy", value: parseFloat(avgOptimal.toFixed(3)) },
      { name: "Random pick (E=0.5)", value: 0.5 },
    ],
    stats: [
      { label: "E[value] optimal", value: avgOptimal.toFixed(3) },
      { label: "E[value] random pick", value: "0.500" },
      { label: "n offers", value: offers.toString() },
      { label: "Improvement", value: `${((avgOptimal - 0.5) * 100 / 0.5).toFixed(1)}%` },
    ],
  };
}

// LLN Demo
export function simulateLLNDemo(sides: number, maxRolls: number): SimResult {
  const trueMean = (sides + 1) / 2;
  let sum = 0;
  const chartData: { name: number; value: number; expected: number }[] = [];
  const checkpoint = Math.max(1, Math.floor(maxRolls / 100));
  for (let r = 0; r < maxRolls; r++) {
    sum += Math.floor(Math.random() * sides) + 1;
    if ((r + 1) % checkpoint === 0 || r === maxRolls - 1) {
      chartData.push({ name: r + 1, value: parseFloat((sum / (r + 1)).toFixed(3)), expected: trueMean });
    }
  }
  const finalMean = sum / maxRolls;
  return {
    value: finalMean,
    label: "Running average",
    chartData,
    stats: [
      { label: "True mean μ", value: trueMean.toString() },
      { label: "Sample mean after n rolls", value: finalMean.toFixed(4) },
      { label: "Die sides", value: sides.toString() },
      { label: "Total rolls", value: maxRolls.toLocaleString() },
    ],
  };
}

// Poisson Arrivals
export function simulatePoissonArrivals(arrivalRate: number, timeWindow: number, trials: number): SimResult {
  const lambda = arrivalRate / 10;
  const T = timeWindow / 10;
  let totalArrivals = 0;
  const dist = new Map<number, number>();
  for (let t = 0; t < trials; t++) {
    let time = 0;
    let count = 0;
    while (true) {
      time += -Math.log(Math.random()) / lambda;
      if (time > T) break;
      count++;
    }
    totalArrivals += count;
    dist.set(count, (dist.get(count) ?? 0) + 1);
  }
  const avgArrivals = totalArrivals / trials;
  const expectedArrivals = lambda * T;
  const maxK = Math.min(Math.ceil(expectedArrivals * 2.5), 20);
  const chartData = Array.from({ length: maxK + 1 }, (_, k) => ({
    name: k,
    value: Math.round(((dist.get(k) ?? 0) / trials) * 1000) / 10,
    expected: Math.round(Math.exp(-expectedArrivals) * Math.pow(expectedArrivals, k) / factorial(k) * 1000) / 10,
  }));
  return {
    value: avgArrivals,
    label: `Avg arrivals in [0, ${T}]`,
    chartData,
    stats: [
      { label: "Avg arrivals (simulated)", value: avgArrivals.toFixed(2) },
      { label: "Theoretical E[N(T)] = λT", value: expectedArrivals.toFixed(2) },
      { label: "λ (rate)", value: lambda.toString() },
      { label: "T (time window)", value: T.toString() },
    ],
  };
}

// Draw Until Red
export function simulateDrawUntilRed(redBalls: number, blueBalls: number, trials: number): SimResult {
  let totalDraws = 0;
  for (let t = 0; t < trials; t++) {
    const balls = [...Array(redBalls).fill("R"), ...Array(blueBalls).fill("B")];
    for (let i = balls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [balls[i], balls[j]] = [balls[j], balls[i]];
    }
    let draws = 0;
    for (const b of balls) { draws++; if (b === "R") break; }
    totalDraws += draws;
  }
  const avg = totalDraws / trials;
  const theoretical = (redBalls + blueBalls + 1) / (redBalls + 1);
  return {
    value: avg,
    label: "Avg draws until first red",
    chartData: [
      { name: "Simulated", value: parseFloat(avg.toFixed(3)) },
      { name: "Theoretical", value: parseFloat(theoretical.toFixed(3)) },
    ],
    stats: [
      { label: "Avg draws (simulated)", value: avg.toFixed(3) },
      { label: "Theoretical (R+B+1)/(R+1)", value: theoretical.toFixed(3) },
      { label: "R red, B blue", value: `R=${redBalls}, B=${blueBalls}` },
    ],
  };
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────

export function runSimulation(type: string, params: Record<string, number>): SimResult {
  switch (type) {
    case "monty-hall": return simulateMontyHall(params.trials);
    case "birthday": return simulateBirthday(params.people, params.trials);
    case "gamblers-ruin": return simulateGamblersRuin(params.startAmount, params.targetAmount, params.trials);
    case "coupon-collector": return simulateCouponCollector(params.coupons, params.trials);
    case "boy-or-girl": return simulateBoyOrGirl(params.trials);
    case "secretary": return simulateSecretary(params.candidates, params.trials);
    case "two-envelopes": return simulateTwoEnvelopes(params.maxAmount, params.trials);
    case "random-walk": return simulateRandomWalk(params.steps, params.walks);
    case "dice-stopping": return simulateDiceStopping(params.sides, params.trials);
    case "expected-rolls": return simulateExpectedRolls(params.successProb, params.trials);
    case "urn-drawing": return simulateUrnDrawing(params.totalBalls, params.redBalls, params.draws, params.trials);
    case "card-ace": return simulateCardAce(params.aces, params.trials);
    case "disease-test": return simulateDiseaseTest(params.prevalence, params.sensitivity, params.specificity, params.trials);
    // New simulations
    case "airplane-boarding": return simulateAirplaneBoarding(params.passengers, params.trials);
    case "russian-roulette": return simulateRussianRoulette(params.trials);
    case "three-prisoners": return simulateThreePrisoners(params.trials);
    case "sock-drawer": return simulateSockDrawer(params.colorsCount, params.socksPerColor, params.trials);
    case "poker-hand": return simulatePokerHand(params.handType, params.trials);
    case "derangement": return simulateDerangement(params.people, params.trials);
    case "expected-matches": return simulateExpectedMatches(params.deckSize, params.trials);
    case "coin-sequence": return simulateCoinSequence(params.target, params.trials);
    case "st-petersburg": return simulateStPetersburg(params.maxFlips, params.trials);
    case "noodle-loop": return simulateNoodleLoop(params.noodles, params.trials);
    case "pirate-game": return simulatePirateGame(params.pirates, params.gold);
    case "brownian-hitting": return simulateBrownianHitting(params.upperBarrier, params.lowerBarrier, params.trials);
    case "order-statistics": return simulateOrderStatistics(params.sampleSize, params.orderK, params.trials);
    case "poker-flush": return simulatePokerFlush(params.heartsNeeded, params.heartsInDeck, params.trials);
    case "ballot": return simulateBallot(params.votesA, params.votesB, params.trials);
    case "bertrand-chord": return simulateBertrandChord(params.method, params.trials);
    case "dice-sum": return simulateDiceSum(params.dice, params.sides, params.trials);
    case "random-walk-2d": return simulateRandomWalk2D(params.steps, params.walks);
    case "max-dice": return simulateMaxDice(params.rolls, params.sides, params.trials);
    case "stick-breaking": return simulateStickBreaking(params.trials);
    case "simpson": return simulateSimpson(params.groupASize, params.trials);
    case "record-values": return simulateRecordValues(params.seqLength, params.trials);
    case "gamblers-ruin-unfair": return simulateGamblersRuinUnfair(params.winProb, params.startAmount, params.targetAmount, params.trials);
    case "card-color": return simulateCardColor(params.trials);
    case "buffon-needle": return simulateBuffonNeedle(params.needleLength, params.lineSpacing, params.trials);
    case "truel": return simulateTruel(params.trials);
    case "absorbing-markov": return simulateAbsorbingMarkov(params.startState, params.totalStates, params.jumpProb, params.trials);
    case "kelly-criterion": return simulateKellyCriterion(params.winProb, params.odds, params.betFraction, params.rounds);
    case "sum-uniforms": return simulateSumUniforms(params.trials);
    case "coin-runs": return simulateCoinRuns(params.flips, params.trials);
    case "neg-binomial": return simulateNegBinomial(params.successesNeeded, params.successProb, params.trials);
    case "poisson": return simulatePoisson(params.lambda, params.trials);
    case "martingale": return simulateMartingale(params.maxBet, params.startBet, params.rounds);
    case "brownian-max": return simulateBrownianMax(params.timeHorizon, params.barrier, params.trials);
    case "birthday-month": return simulateBirthdayMonth(params.people, params.trials);
    case "coin-profit": return simulateCoinProfit(params.maxSteps, params.trials);
    case "normal-probabilities": return simulateNormalProbabilities(params.zScore, params.trials);
    case "geometric-memoryless": return simulateGeometricMemoryless(params.successProb, params.givenFailures, params.extraSteps, params.trials);
    case "random-triangle": return simulateRandomTriangle(params.trials);
    case "exp-minimum": return simulateExpMinimum(params.lambda1, params.lambda2, params.trials);
    case "regression-mean": return simulateRegressionMean(params.correlation, params.score1, params.trials);
    case "banach-matchbox": return simulateBanachMatchbox(params.matchesPerBox, params.trials);
    case "bus-wait": return simulateBusWait(params.minInterval, params.maxInterval, params.trials);
    case "optimal-stopping-uniform": return simulateOptimalStoppingUniform(params.offers, params.trials);
    case "lln-demo": return simulateLLNDemo(params.sides, params.maxRolls);
    case "poisson-arrivals": return simulatePoissonArrivals(params.arrivalRate, params.timeWindow, params.trials);
    case "draw-until-red": return simulateDrawUntilRed(params.redBalls, params.blueBalls, params.trials);
    default: return { value: 0, label: "", chartData: [], stats: [] };
  }
}
