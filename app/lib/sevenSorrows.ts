/**
 * The Seven Sorrows Rosary — data + step generator.
 *
 * Structure follows the devotion as promoted from Kibeho (source Max
 * specified: centrefordivinemercy.org "How to Pray the Seven Sorrows
 * Rosary", checked 2026-07-28):
 *   Sign of the Cross → Opening (offering) Prayer → Act of Contrition →
 *   3 Hail Marys → antiphon → seven sorrows (each: announcement w/
 *   scripture → 1 Our Father → 7 Hail Marys → antiphon) → Queen of
 *   Martyrs prayer → threefold invocation → Sign of the Cross.
 *
 * Scripture note: the source quotes the NABRE, which is COPYRIGHTED —
 * per the app's rule we keep brief factual summaries + Douay-Rheims
 * references instead. The offering prayer, antiphon, Queen of Martyrs
 * prayer, and invocation are the widely circulated Kibeho devotional
 * texts — flag for Fr. Murphy/copyright review with the rest (they
 * circulate freely across devotional sites, but verify before launch).
 *
 * Reuses RosaryStep so walkers stay interchangeable ("decade" = sorrow
 * 1-7, beadIndex 0-6). Text-first walker only for now — a 3D chaplet
 * model can slot in later the same way the main rosary's GLB did.
 */

import { PRAYERS, type RosaryStep } from "./rosary";

export type Sorrow = {
  number: number; // 1-7
  name: string;
  scriptureRef: string;
  summary: string;
};

export const SEVEN_SORROWS: Sorrow[] = [
  {
    number: 1,
    name: "The Prophecy of Simeon",
    scriptureRef: "Luke 2:34–35",
    summary:
      "Simeon blesses the Child and tells Mary that this Child is set for the fall and the resurrection of many — and that a sword shall pierce her own soul, that the thoughts of many hearts may be revealed.",
  },
  {
    number: 2,
    name: "The Flight into Egypt",
    scriptureRef: "Matthew 2:13–14",
    summary:
      "Warned that Herod seeks the Child to destroy him, Joseph rises by night and takes Jesus and his Mother into exile in Egypt — refugees fleeing under cover of dark.",
  },
  {
    number: 3,
    name: "The Loss of the Child Jesus in the Temple",
    scriptureRef: "Luke 2:43–46",
    summary:
      "The boy Jesus remains behind in Jerusalem, and Mary and Joseph, not knowing, seek him sorrowing for three days before finding him in the temple among the doctors.",
  },
  {
    number: 4,
    name: "Mary Meets Jesus on His Way to Calvary",
    scriptureRef: "Luke 23:27–29",
    summary:
      "A great multitude follows Jesus to Calvary, among them women who mourn and lament him. He turns to them: Daughters of Jerusalem, weep not over me, but weep for yourselves and for your children. His Mother meets him beneath the weight of the cross.",
  },
  {
    number: 5,
    name: "Mary Stands at the Foot of the Cross",
    scriptureRef: "John 19:25–27",
    summary:
      "There stood by the cross of Jesus his Mother. Seeing her and the disciple whom he loved, Jesus says: Woman, behold thy son — then to the disciple: Behold thy mother.",
  },
  {
    number: 6,
    name: "Jesus Is Taken Down from the Cross",
    scriptureRef: "John 19:32–34",
    summary:
      "Finding Jesus already dead, the soldiers do not break his legs, but one opens his side with a lance, and immediately there comes out blood and water. Taken down from the cross, his body is given back to his Mother — the image the Church holds in the Pietà.",
  },
  {
    number: 7,
    name: "The Burial of Jesus",
    scriptureRef: "John 19:41–42",
    summary:
      "In the place where he was crucified there is a garden, and in the garden a new tomb where no one had yet been laid. Mary watches as her Son is wrapped in linen and buried there, and the stone is set in place.",
  },
];

const OPENING_PRAYER =
  "My God, I offer You this Rosary for Your glory, so I can honor Your Holy Mother, the Blessed Virgin, so I can share and meditate upon her suffering. I humbly beg You to give me true repentance for all my sins. Give me wisdom and humility, so that I may receive all the indulgences contained in this prayer.";

const ACT_OF_CONTRITION =
  "O my God, I am heartily sorry for having offended You, and I detest all my sins because I dread the loss of Heaven and the pains of hell; but most of all because they offend You, my God, You Who are all good and deserving of all my love. I firmly resolve, with the help of Your grace, to confess my sins, to do penance, and to amend my life. Amen.";

/** Prayed after the opening Hail Marys and after every sorrow's septet. */
const ANTIPHON =
  "Most Merciful Mother, remind us always about the Sorrows of your Son, Jesus.";

const QUEEN_OF_MARTYRS =
  "Queen of Martyrs, your heart suffered so much. I beg you, by the merits of the tears you shed in these terrible and sorrowful times, to obtain for me and all the sinners of the world the grace of complete sincerity and repentance. Amen.";

const CLOSING_INVOCATION =
  "Mary, who was conceived without sin and who suffered for us, pray for us.";

/**
 * The full linear sequence, matching the devotion's published order:
 * Sign of the Cross → Opening Prayer → Act of Contrition → 3 Hail Marys
 * → antiphon → 7 × (announcement → Our Father → 7 Hail Marys → antiphon)
 * → Queen of Martyrs → invocation ×3 → Sign of the Cross = 82 steps.
 */
export function generateSevenSorrows(): RosaryStep[] {
  const steps: RosaryStep[] = [];

  // ── Opening ──
  steps.push({ kind: "prayer", name: "Sign of the Cross", body: PRAYERS.signOfTheCross, section: "opening" });
  steps.push({ kind: "prayer", name: "Opening Prayer", body: OPENING_PRAYER, section: "opening" });
  steps.push({ kind: "prayer", name: "Act of Contrition", body: ACT_OF_CONTRITION, section: "opening" });
  for (let i = 0; i < 3; i++) {
    steps.push({
      kind: "prayer",
      name: "Hail Mary",
      body: PRAYERS.hailMary,
      section: "opening",
      openingHailIndex: i,
    });
  }
  steps.push({ kind: "prayer", name: "Antiphon", body: ANTIPHON, section: "opening" });

  // ── The seven sorrows ──
  for (const s of SEVEN_SORROWS) {
    steps.push({
      kind: "meditation",
      name: s.name,
      scriptureRef: s.scriptureRef,
      summary: s.summary,
      section: "decade",
      decade: s.number,
    });
    steps.push({ kind: "prayer", name: "Our Father", body: PRAYERS.ourFather, section: "decade", decade: s.number });
    for (let i = 0; i < 7; i++) {
      steps.push({
        kind: "prayer",
        name: "Hail Mary",
        body: PRAYERS.hailMary,
        section: "decade",
        decade: s.number,
        beadIndex: i,
      });
    }
    steps.push({ kind: "prayer", name: "Antiphon", body: ANTIPHON, section: "decade", decade: s.number });
  }

  // ── Closing ──
  steps.push({ kind: "prayer", name: "Queen of Martyrs", body: QUEEN_OF_MARTYRS, section: "closing" });
  for (let i = 0; i < 3; i++) {
    steps.push({
      kind: "prayer",
      name: `Invocation (${i + 1} of 3)`,
      body: CLOSING_INVOCATION,
      section: "closing",
    });
  }
  steps.push({ kind: "prayer", name: "Sign of the Cross", body: PRAYERS.signOfTheCross, section: "closing" });

  return steps;
}
