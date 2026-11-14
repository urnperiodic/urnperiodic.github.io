export const BUILTIN_FLASHCARD_DECKS = [
  {
    id: 'deck-biology',
    title: 'Biology & Cell Energetics',
    subject: 'Science',
    description: 'Core cellular processes, organelles, photosynthesis, respiration, and genetics.',
    cards: [
      {
        id: 'bio-1',
        term: 'ATP (Adenosine Triphosphate)',
        definition: 'Primary energy-carrying molecule used by cells to power active transport, synthesis, and movement.',
        hint: 'Energy released when the third phosphate bond hydrolyzes into ADP + Pi.',
      },
      {
        id: 'bio-2',
        term: 'Photosynthesis',
        definition: 'Process in chloroplasts where light energy converts CO2 and H2O into glucose (C6H12O6) and O2.',
        hint: '6CO2 + 6H2O + light -> C6H12O6 + 6O2',
      },
      {
        id: 'bio-3',
        term: 'Cellular Respiration',
        definition: 'Metabolic pathway (glycolysis, Krebs cycle, ETC) that breaks down glucose with O2 to generate ~30-32 ATP.',
        hint: 'Occurs in cytoplasm and mitochondria.',
      },
      {
        id: 'bio-4',
        term: 'Osmosis',
        definition: 'Passive diffusion of water across a selectively permeable membrane from lower to higher solute concentration.',
        hint: 'Hypertonic solution shrinks animal cells; hypotonic swells them.',
      },
      {
        id: 'bio-5',
        term: 'Enzyme Active Site',
        definition: 'Specific 3D pocket of a protein catalyst where substrates bind and activation energy is lowered.',
        hint: 'Denatured by extreme heat or pH shifts.',
      },
      {
        id: 'bio-6',
        term: 'Mitosis vs. Meiosis',
        definition: 'Mitosis produces 2 genetically identical diploid cells; meiosis produces 4 genetically varied haploid gametes.',
        hint: 'Crossing over occurs in Prophase I of meiosis.',
      },
      {
        id: 'bio-7',
        term: 'Semi-Conservative DNA Replication',
        definition: 'Each new DNA double helix retains one original parental strand paired with one newly synthesized strand.',
        hint: 'Helicase unzips; DNA Polymerase III adds bases 5\' -> 3\'.',
      },
      {
        id: 'bio-8',
        term: 'Natural Selection',
        definition: 'Differential survival and reproduction of individuals with heritable traits better suited to their environment.',
        hint: 'Acts on phenotypes in a population over generations.',
      },
    ],
  },
  {
    id: 'deck-math',
    title: 'Algebra II & Pre-Calculus',
    subject: 'Mathematics',
    description: 'Essential formulas, identities, functions, and conic sections.',
    cards: [
      {
        id: 'math-1',
        term: 'Quadratic Formula',
        definition: 'x = (-b ± sqrt(b^2 - 4ac)) / (2a), giving the roots of ax^2 + bx + c = 0.',
        hint: 'Works for both real and complex roots.',
      },
      {
        id: 'math-2',
        term: 'Discriminant (b^2 - 4ac)',
        definition: 'Determines root count: > 0 means 2 real roots, = 0 means 1 repeated real root, < 0 means 2 complex roots.',
        hint: 'Inside the square root of the quadratic formula.',
      },
      {
        id: 'math-3',
        term: 'Logarithm Product & Quotient Rules',
        definition: 'log_b(MN) = log_b(M) + log_b(N) and log_b(M/N) = log_b(M) - log_b(N).',
        hint: 'Power rule: log_b(M^k) = k * log_b(M).',
      },
      {
        id: 'math-4',
        term: 'Pythagorean Trigonometric Identity',
        definition: 'sin^2(theta) + cos^2(theta) = 1 for every angle theta on the unit circle.',
        hint: 'Dividing by cos^2(theta) yields tan^2(theta) + 1 = sec^2(theta).',
      },
      {
        id: 'math-5',
        term: 'Point-Slope Linear Form',
        definition: 'y - y1 = m(x - x1), where m is slope and (x1, y1) is a known point on the line.',
        hint: 'Perpendicular slopes satisfy m1 * m2 = -1.',
      },
      {
        id: 'math-6',
        term: 'Compound Interest Formula',
        definition: 'A = P(1 + r/n)^(nt), where P is principal, r is annual rate, n is compounds/year, and t is years.',
        hint: 'Continuous compounding uses A = Pe^(rt).',
      },
      {
        id: 'math-7',
        term: 'Law of Sines',
        definition: 'a / sin(A) = b / sin(B) = c / sin(C) in any triangle with opposite sides and angles.',
        hint: 'Use Law of Cosines (c^2 = a^2 + b^2 - 2ab cos C) for SAS or SSS.',
      },
    ],
  },
  {
    id: 'deck-history',
    title: 'US History & Constitutional Civics',
    subject: 'Social Studies',
    description: 'Founding documents, amendments, Supreme Court doctrines, and major eras.',
    cards: [
      {
        id: 'hist-1',
        term: 'Checks and Balances',
        definition: 'Constitutional system letting executive, legislative, and judicial branches limit each other\'s powers.',
        hint: 'Example: Presidential veto overridden by 2/3 vote in Congress.',
      },
      {
        id: 'hist-2',
        term: 'Marbury v. Madison (1803)',
        definition: 'Landmark Supreme Court ruling that established judicial review—courts can strike down unconstitutional laws.',
        hint: 'Chief Justice John Marshall wrote the opinion.',
      },
      {
        id: 'hist-3',
        term: '13th, 14th & 15th Amendments',
        definition: 'Reconstruction Amendments: abolished slavery (13th), granted citizenship & equal protection (14th), and protected voting rights regardless of race (15th).',
        hint: 'Ratified between 1865 and 1870.',
      },
      {
        id: 'hist-4',
        term: 'Federalism',
        definition: 'Division of governing authority between a national federal government and individual state governments.',
        hint: '10th Amendment reserves undelegated powers to the states/people.',
      },
      {
        id: 'hist-5',
        term: 'The New Deal (1933-1939)',
        definition: 'FDR\'s federal programs focused on Relief, Recovery, and Reform during the Great Depression.',
        hint: 'Created Social Security, FDIC, SEC, and Civilian Conservation Corps.',
      },
      {
        id: 'hist-6',
        term: 'Containment Policy',
        definition: 'Post-WWII US Cold War strategy to prevent the geographic spread of Soviet communism.',
        hint: 'Applied through the Truman Doctrine, Marshall Plan, and NATO.',
      },
    ],
  },
  {
    id: 'deck-ela',
    title: 'ELA Rhetoric & Literary Devices',
    subject: 'ELA',
    description: 'Persuasive appeals, figurative language, syntax, and analytical terms.',
    cards: [
      {
        id: 'ela-1',
        term: 'Ethos, Pathos, Logos',
        definition: 'Aristotle\'s rhetorical appeals: Ethos (speaker credibility), Pathos (emotion), and Logos (logic & evidence).',
        hint: 'Strong arguments combine credible sources with clear reasoning.',
      },
      {
        id: 'ela-2',
        term: 'Dramatic Irony',
        definition: 'When the audience knows a critical truth that characters inside the story do not yet realize.',
        hint: 'Creates suspense or tragedy (e.g., Romeo & Juliet).',
      },
      {
        id: 'ela-3',
        term: 'Juxtaposition',
        definition: 'Placing two contrasting ideas, images, or characters side-by-side to highlight their differences.',
        hint: 'Used heavily in opening lines and character foils.',
      },
      {
        id: 'ela-4',
        term: 'Tone vs. Mood',
        definition: 'Tone is the author\'s attitude toward the subject; mood is the emotional atmosphere felt by the reader.',
        hint: 'Diction and syntax shape both.',
      },
      {
        id: 'ela-5',
        term: 'Allusion',
        definition: 'An indirect reference to a well-known historical event, literary work, myth, or figure.',
        hint: 'Adds deeper meaning without explaining the reference directly.',
      },
      {
        id: 'ela-6',
        term: 'Anaphora',
        definition: 'Deliberate repetition of a word or phrase at the start of successive clauses or sentences.',
        hint: 'Example: "We shall fight on the beaches, we shall fight..."',
      },
    ],
  },
  {
    id: 'deck-italian',
    title: 'Italian Essentials & Verbs',
    subject: 'Italian',
    description: 'High-frequency greetings, verbs, question words, and classroom expressions.',
    cards: [
      {
        id: 'it-1',
        term: 'Essere (to be)',
        definition: 'io sono, tu sei, lui/lei e, noi siamo, voi siete, loro sono.',
        hint: 'Irregular high-frequency auxiliary verb.',
      },
      {
        id: 'it-2',
        term: 'Avere (to have)',
        definition: 'io ho, tu hai, lui/lei ha, noi abbiamo, voi avete, loro hanno.',
        hint: 'Also used for age ("Ho sedici anni") and hunger/thirst.',
      },
      {
        id: 'it-3',
        term: 'Question Words',
        definition: 'Chi (who), Che cosa (what), Dove (where), Quando (when), Perché (why/because), Come (how).',
        hint: 'Perché means both "why?" and "because".',
      },
      {
        id: 'it-4',
        term: 'Buongiorno / Buonasera / Arrivederci',
        definition: 'Good morning (or hello), good evening, and formal goodbye.',
        hint: 'Use "Ciao" with friends and family.',
      },
      {
        id: 'it-5',
        term: 'Per favore / Grazie mille / Prego',
        definition: 'Please / Thank you very much / You\'re welcome.',
        hint: 'Core polite expressions.',
      },
    ],
  },
];

export const BUILTIN_QUIZZES = [
  {
    id: 'quiz-science',
    title: 'Biology & Chemistry Practice Test',
    subject: 'Science',
    description: 'Test cellular energetics, genetics, bonding, and scientific reasoning.',
    questions: [
      {
        id: 'qs-1',
        prompt: 'Which organelle is the primary site of oxidative phosphorylation and ATP production in eukaryotic cells?',
        options: ['Golgi apparatus', 'Mitochondrion', 'Lysosome', 'Smooth endoplasmic reticulum'],
        correctIndex: 1,
        explanation: 'Mitochondria house the Krebs cycle and electron transport chain, producing most cellular ATP.',
      },
      {
        id: 'qs-2',
        prompt: 'What happens to an animal red blood cell placed into a strongly hypertonic salt solution?',
        options: [
          'Water enters rapidly and the cell bursts',
          'Salt pumps out to maintain volume',
          'Water leaves by osmosis and the cell shrivels',
          'Glucose diffuses inside until equilibrium',
        ],
        correctIndex: 2,
        explanation: 'Water moves toward higher solute concentration outside the cell, causing crenation (shriveling).',
      },
      {
        id: 'qs-3',
        prompt: 'Which enzyme unzips the DNA double helix by breaking hydrogen bonds between base pairs?',
        options: ['DNA ligase', 'Helicase', 'RNA primase', 'Amylase'],
        correctIndex: 1,
        explanation: 'Helicase separates the two DNA strands at the replication fork so polymerases can copy them.',
      },
      {
        id: 'qs-4',
        prompt: 'What are the direct outputs of photosynthesis light-dependent reactions needed for the Calvin cycle?',
        options: ['Glucose and CO2', 'ATP and NADPH', 'Pyruvate and NADH', 'Lactic acid and O2'],
        correctIndex: 1,
        explanation: 'Light reactions in thylakoids generate ATP and NADPH (plus O2 gas) to power carbon fixation.',
      },
      {
        id: 'qs-5',
        prompt: 'How does an enzyme speed up a biochemical reaction?',
        options: [
          'By raising the temperature of the cell',
          'By adding extra reactants to the solution',
          'By lowering the activation energy barrier',
          'By changing the final free energy of products',
        ],
        correctIndex: 2,
        explanation: 'Catalysts stabilize the transition state, lowering activation energy without being consumed.',
      },
      {
        id: 'qs-6',
        prompt: 'During which phase of meiosis does crossing over increase genetic variation?',
        options: ['Prophase I', 'Metaphase II', 'Anaphase II', 'Telophase I'],
        correctIndex: 0,
        explanation: 'Homologous chromosomes pair up in synapsis and exchange segments during Prophase I.',
      },
    ],
  },
  {
    id: 'quiz-math',
    title: 'Algebra II & Functions Benchmark',
    subject: 'Mathematics',
    description: 'Practice quadratics, logarithms, trigonometry, and linear equations.',
    questions: [
      {
        id: 'qm-1',
        prompt: 'If the discriminant (b^2 - 4ac) of a quadratic equation is negative, what does that indicate?',
        options: [
          'Two distinct rational roots',
          'One repeated real root',
          'Two complex conjugate roots and no x-intercepts',
          'The parabola opens downward',
        ],
        correctIndex: 2,
        explanation: 'Taking the square root of a negative discriminant produces imaginary components (a ± bi).',
      },
      {
        id: 'qm-2',
        prompt: 'Simplify log_2(8) + log_2(4):',
        options: ['3', '5', '6', '12'],
        correctIndex: 1,
        explanation: 'log_2(8) = 3 and log_2(4) = 2, or log_2(8 * 4) = log_2(32) = 5.',
      },
      {
        id: 'qm-3',
        prompt: 'What is the slope of a line perpendicular to y = (2/5)x - 7?',
        options: ['2/5', '-2/5', '5/2', '-5/2'],
        correctIndex: 3,
        explanation: 'Perpendicular slopes are negative reciprocals: -(5/2).',
      },
      {
        id: 'qm-4',
        prompt: 'On the unit circle, what is the exact value of sin^2(37°) + cos^2(37°)?',
        options: ['0', '0.5', '1', 'sqrt(2)/2'],
        correctIndex: 2,
        explanation: 'By the Pythagorean identity, sin^2(theta) + cos^2(theta) = 1 for every angle theta.',
      },
      {
        id: 'qm-5',
        prompt: 'Solve for x: 3^(2x - 1) = 27',
        options: ['x = 1', 'x = 2', 'x = 3', 'x = 4'],
        correctIndex: 1,
        explanation: '27 = 3^3, so 2x - 1 = 3 -> 2x = 4 -> x = 2.',
      },
    ],
  },
  {
    id: 'quiz-history',
    title: 'US History & Civics Review',
    subject: 'Social Studies',
    description: 'Foundational Supreme Court cases, amendments, and American political eras.',
    questions: [
      {
        id: 'qh-1',
        prompt: 'Which Supreme Court case established the principle of judicial review in 1803?',
        options: [
          'McCulloch v. Maryland',
          'Marbury v. Madison',
          'Gibbons v. Ogden',
          'Brown v. Board of Education',
        ],
        correctIndex: 1,
        explanation: 'Marbury v. Madison affirmed that federal courts may declare laws unconstitutional.',
      },
      {
        id: 'qh-2',
        prompt: 'Which Reconstruction Amendment guarantees citizenship and "equal protection of the laws"?',
        options: ['12th Amendment', '13th Amendment', '14th Amendment', '16th Amendment'],
        correctIndex: 2,
        explanation: 'Ratified in 1868, the 14th Amendment established birthright citizenship, due process, and equal protection.',
      },
      {
        id: 'qh-3',
        prompt: 'What was the main objective of the Marshall Plan (1948)?',
        options: [
          'Rebuild Western European economies and curb communist influence',
          'Divide Berlin into military zones',
          'Establish domestic Social Security pensions',
          'Negotiate tariff reductions in Asia',
        ],
        correctIndex: 0,
        explanation: 'US economic aid helped stabilize Western Europe post-WWII and resist Soviet expansion.',
      },
      {
        id: 'qh-4',
        prompt: 'Under the US Constitution, which branch has the power to declare war and override a presidential veto?',
        options: ['Executive Branch', 'Legislative Branch (Congress)', 'Judicial Branch', 'State Governors'],
        correctIndex: 1,
        explanation: 'Article I grants Congress the power to declare war and override vetoes with a two-thirds vote.',
      },
    ],
  },
  {
    id: 'quiz-ela',
    title: 'ELA Rhetoric & Literature Check',
    subject: 'ELA',
    description: 'Rhetorical appeals, literary devices, and close-reading concepts.',
    questions: [
      {
        id: 'qe-1',
        prompt: 'A speaker cites peer-reviewed hospital statistics and clear cause-and-effect data. Which rhetorical appeal dominates?',
        options: ['Pathos', 'Logos', 'Oxymoron', 'Hyperbole'],
        correctIndex: 1,
        explanation: 'Logos persuades using data, logical reasoning, and factual evidence.',
      },
      {
        id: 'qe-2',
        prompt: 'When the audience knows a character is walking into an ambush while the character believes they are safe, what device is used?',
        options: ['Verbal irony', 'Dramatic irony', 'Metaphor', 'Alliteration'],
        correctIndex: 1,
        explanation: 'Dramatic irony occurs when the audience possesses crucial knowledge hidden from a character.',
      },
      {
        id: 'qe-3',
        prompt: 'What is the difference between a story\'s tone and its mood?',
        options: [
          'Tone is the setting; mood is the plot',
          'Tone is the author\'s attitude; mood is the feeling evoked in the reader',
          'Tone applies only to poetry; mood applies only to essays',
          'They are identical literary terms',
        ],
        correctIndex: 1,
        explanation: 'Writers express tone through word choice and perspective, creating a mood experienced by the audience.',
      },
      {
        id: 'qe-4',
        prompt: 'Repeating the opening words "Now is the time..." across three consecutive sentences is an example of:',
        options: ['Anaphora', 'Euphemism', 'Foreshadowing', 'Paradox'],
        correctIndex: 0,
        explanation: 'Anaphora repeats a starting word or phrase across successive clauses for emphasis and rhythm.',
      },
    ],
  },
  {
    id: 'quiz-italian',
    title: 'Italian I Checkpoint Quiz',
    subject: 'Italian',
    description: 'Everyday phrases, essere/avere conjugations, and question words.',
    questions: [
      {
        id: 'qi-1',
        prompt: 'How do you conjugate "avere" (to have) for "noi" (we)?',
        options: ['siamo', 'abbiamo', 'avete', 'hanno'],
        correctIndex: 1,
        explanation: 'The present indicative of avere for noi is "abbiamo".',
      },
      {
        id: 'qi-2',
        prompt: 'Which Italian question word means both "why?" and "because"?',
        options: ['Dove', 'Quando', 'Perché', 'Come'],
        correctIndex: 2,
        explanation: '"Perché" is used both in questions ("Why?") and answers ("Because...").',
      },
      {
        id: 'qi-3',
        prompt: 'Complete the sentence: "Loro ___ studenti di biologia."',
        options: ['sei', 'è', 'siamo', 'sono'],
        correctIndex: 3,
        explanation: 'For loro (they), "essere" conjugates to "sono".',
      },
      {
        id: 'qi-4',
        prompt: 'What is the polite way to say "You\'re welcome" in Italian?',
        options: ['Grazie', 'Prego', 'Scusa', 'Buonasera'],
        correctIndex: 1,
        explanation: '"Prego" means "You\'re welcome" (and also "Please, go ahead").',
      },
    ],
  },
];

export function extractCardsFromArticle(article) {
  if (!article || !article.content) return [];
  const lines = String(article.content).split('\n');
  const extracted = [];
  const boldRegex = /\*\*([^*]{2,60})\*\*[:\-\s]+(.{8,200})/;

  lines.forEach((line, idx) => {
    const match = line.trim().match(boldRegex);
    if (match) {
      extracted.push({
        id: `art-${article.id}-${idx}`,
        term: match[1].trim(),
        definition: match[2].replace(/\*\*/g, '').trim(),
        hint: `From ${article.category || 'Study Guide'}: ${article.title}`,
      });
    }
  });
  return extracted.slice(0, 16);
}
