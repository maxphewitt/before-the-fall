/**
 * Rosary data + linear step generator.
 *
 * All prayer texts are centuries-old, public-domain, traditional Catholic
 * versions. Mystery descriptions are brief factual summaries of the
 * scripture events (no novel meditations) so we stay inside what
 * Father Murphy would consider safe DRAFT v1 content. Real meditations
 * land in a follow-up session once they're priest-reviewed.
 *
 * Day-of-week pairing follows the traditional schedule:
 *   Sun: Glorious
 *   Mon: Joyful
 *   Tue: Sorrowful
 *   Wed: Glorious
 *   Thu: Luminous
 *   Fri: Sorrowful
 *   Sat: Joyful
 */

export type MysterySet = "joyful" | "sorrowful" | "glorious" | "luminous";

export type Decade = {
  number: 1 | 2 | 3 | 4 | 5;
  name: string;
  scriptureRef: string;
  summary: string;
};

export type Mystery = {
  slug: MysterySet;
  name: string;
  subtitle: string;
  days: string[]; // human-readable, e.g. ["Monday", "Saturday"]
  decades: Decade[];
};

// ─── Prayer texts (traditional, public domain) ──────────────────────────

export const PRAYERS = {
  signOfTheCross:
    "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
  apostlesCreed:
    "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
  ourFather:
    "Our Father, who art in heaven, hallowed be thy name; thy kingdom come, thy will be done on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
  hailMary:
    "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
  gloryBe:
    "Glory be to the Father, and to the Son, and to the Holy Spirit; as it was in the beginning, is now, and ever shall be, world without end. Amen.",
  fatima:
    "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to heaven, especially those in most need of thy mercy. Amen.",
  hailHolyQueen:
    "Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this valley of tears. Turn, then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God, that we may be made worthy of the promises of Christ. Amen.",
  finalPrayer:
    "O God, whose Only-Begotten Son, by his life, death, and resurrection, has purchased for us the rewards of eternal life; grant, we beseech thee, that meditating upon these mysteries of the most holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise; through the same Christ our Lord. Amen.",
} as const;

// ─── Mysteries ──────────────────────────────────────────────────────────

export const MYSTERIES: Mystery[] = [
  {
    slug: "joyful",
    name: "The Joyful Mysteries",
    subtitle: "The mysteries of the Incarnation and the hidden life of Christ.",
    days: ["Monday", "Saturday"],
    decades: [
      {
        number: 1,
        name: "The Annunciation",
        scriptureRef: "Luke 1:26–38",
        summary:
          "The angel Gabriel comes to Mary in Nazareth and announces that she will conceive and bear the Son of God. Mary consents: \"Behold, I am the handmaid of the Lord. May it be done to me according to your word.\"",
      },
      {
        number: 2,
        name: "The Visitation",
        scriptureRef: "Luke 1:39–56",
        summary:
          "Mary travels to visit her cousin Elizabeth, who is herself with child. At Mary's greeting, the child leaps in Elizabeth's womb, and Mary sings the Magnificat in praise of God.",
      },
      {
        number: 3,
        name: "The Nativity",
        scriptureRef: "Luke 2:1–20",
        summary:
          "Jesus is born in Bethlehem and laid in a manger because there is no place in the inn. Shepherds, told by angels, come to see the newborn child.",
      },
      {
        number: 4,
        name: "The Presentation",
        scriptureRef: "Luke 2:22–38",
        summary:
          "Mary and Joseph present the child Jesus in the Temple in Jerusalem. Simeon, who had been waiting for the consolation of Israel, takes Jesus in his arms and gives thanks.",
      },
      {
        number: 5,
        name: "The Finding in the Temple",
        scriptureRef: "Luke 2:41–52",
        summary:
          "After traveling to Jerusalem for the Passover, the twelve-year-old Jesus is found after three days in the Temple, sitting among the teachers, listening and asking questions.",
      },
    ],
  },
  {
    slug: "sorrowful",
    name: "The Sorrowful Mysteries",
    subtitle: "The mysteries of Christ's Passion.",
    days: ["Tuesday", "Friday"],
    decades: [
      {
        number: 1,
        name: "The Agony in the Garden",
        scriptureRef: "Matthew 26:36–46",
        summary:
          "In Gethsemane, Jesus prays before his arrest. He sweats blood. He says, \"Father, if it is possible, let this cup pass from me — yet not as I will, but as you will.\"",
      },
      {
        number: 2,
        name: "The Scourging at the Pillar",
        scriptureRef: "Matthew 27:26",
        summary:
          "Pontius Pilate hands Jesus over to be scourged before his crucifixion.",
      },
      {
        number: 3,
        name: "The Crowning with Thorns",
        scriptureRef: "Matthew 27:27–31",
        summary:
          "The soldiers strip Jesus, place a scarlet cloak on him, weave a crown of thorns, and mock him as \"King of the Jews.\"",
      },
      {
        number: 4,
        name: "The Carrying of the Cross",
        scriptureRef: "Luke 23:26–32",
        summary:
          "Jesus carries his cross toward Golgotha. Simon of Cyrene is compelled to help him bear it.",
      },
      {
        number: 5,
        name: "The Crucifixion",
        scriptureRef: "Luke 23:33–46",
        summary:
          "Jesus is crucified between two criminals. From the cross he prays, \"Father, forgive them, for they know not what they do,\" and gives up his spirit.",
      },
    ],
  },
  {
    slug: "glorious",
    name: "The Glorious Mysteries",
    subtitle: "The mysteries of the Resurrection and the glory of God.",
    days: ["Sunday", "Wednesday"],
    decades: [
      {
        number: 1,
        name: "The Resurrection",
        scriptureRef: "Mark 16:1–7",
        summary:
          "On the third day, the women come to anoint Jesus' body and find the tomb empty. An angel tells them: \"He is risen. He is not here.\"",
      },
      {
        number: 2,
        name: "The Ascension",
        scriptureRef: "Luke 24:50–53",
        summary:
          "Jesus blesses his disciples and is taken up into heaven.",
      },
      {
        number: 3,
        name: "The Descent of the Holy Spirit",
        scriptureRef: "Acts 2:1–4",
        summary:
          "On Pentecost, the Holy Spirit descends upon Mary and the apostles like a rush of wind and tongues of fire. They begin to speak in other tongues.",
      },
      {
        number: 4,
        name: "The Assumption",
        scriptureRef: "Tradition; cf. Revelation 12:1",
        summary:
          "At the end of her earthly life, Mary is assumed body and soul into heaven.",
      },
      {
        number: 5,
        name: "The Coronation of Mary",
        scriptureRef: "Tradition; cf. Revelation 12:1",
        summary:
          "Mary is crowned Queen of Heaven by her Son.",
      },
    ],
  },
  {
    slug: "luminous",
    name: "The Luminous Mysteries",
    subtitle: "The mysteries of light, from the public ministry of Christ.",
    days: ["Thursday"],
    decades: [
      {
        number: 1,
        name: "The Baptism in the Jordan",
        scriptureRef: "Matthew 3:13–17",
        summary:
          "Jesus is baptized by John in the Jordan. The Spirit descends as a dove. A voice from heaven says, \"This is my beloved Son, with whom I am well pleased.\"",
      },
      {
        number: 2,
        name: "The Wedding at Cana",
        scriptureRef: "John 2:1–12",
        summary:
          "At his mother's request, Jesus turns water into wine at a wedding in Cana — his first public sign.",
      },
      {
        number: 3,
        name: "The Proclamation of the Kingdom",
        scriptureRef: "Mark 1:14–15",
        summary:
          "Jesus begins to preach: \"The time is fulfilled, and the kingdom of God is at hand. Repent, and believe in the gospel.\"",
      },
      {
        number: 4,
        name: "The Transfiguration",
        scriptureRef: "Matthew 17:1–8",
        summary:
          "On a high mountain, Jesus is transfigured before Peter, James, and John. His face shines like the sun. Moses and Elijah appear with him.",
      },
      {
        number: 5,
        name: "The Institution of the Eucharist",
        scriptureRef: "Matthew 26:26–28",
        summary:
          "At the Last Supper, Jesus takes bread and wine, blesses them, and gives them to his disciples saying: \"This is my body... this is my blood.\"",
      },
    ],
  },
];

export function getMysteryBySlug(slug: string): Mystery | undefined {
  return MYSTERIES.find((m) => m.slug === slug);
}

// ─── Day-of-week recommendation ─────────────────────────────────────────

const DAY_TO_MYSTERY: Record<number, MysterySet> = {
  0: "glorious", // Sunday
  1: "joyful", // Monday
  2: "sorrowful", // Tuesday
  3: "glorious", // Wednesday
  4: "luminous", // Thursday
  5: "sorrowful", // Friday
  6: "joyful", // Saturday
};

export function todaysMysterySlug(): MysterySet {
  return DAY_TO_MYSTERY[new Date().getDay()];
}

// ─── Step generator ─────────────────────────────────────────────────────

export type RosaryStep =
  | {
      kind: "prayer";
      name: string;
      body: string;
      section: "opening" | "decade" | "closing";
      decade?: number;
      // For Hail Marys within a decade: 0–9. The bead counter UI uses this.
      beadIndex?: number;
      // For the 3 opening Hail Marys: 0–2.
      openingHailIndex?: number;
    }
  | {
      kind: "meditation";
      name: string; // e.g., "The Annunciation"
      scriptureRef: string;
      summary: string;
      section: "decade";
      decade: number;
    };

/**
 * Emit the full linear sequence of steps for one Rosary, given a mystery.
 * Total steps: 7 opening + 5 × 14 decade + 2 closing = 79.
 */
export function generateRosary(mystery: Mystery): RosaryStep[] {
  const steps: RosaryStep[] = [];

  // ── Opening ──
  steps.push({ kind: "prayer", name: "Sign of the Cross", body: PRAYERS.signOfTheCross, section: "opening" });
  steps.push({ kind: "prayer", name: "Apostles' Creed", body: PRAYERS.apostlesCreed, section: "opening" });
  steps.push({ kind: "prayer", name: "Our Father", body: PRAYERS.ourFather, section: "opening" });
  for (let i = 0; i < 3; i++) {
    steps.push({
      kind: "prayer",
      name: "Hail Mary",
      body: PRAYERS.hailMary,
      section: "opening",
      openingHailIndex: i,
    });
  }
  steps.push({ kind: "prayer", name: "Glory Be", body: PRAYERS.gloryBe, section: "opening" });

  // ── Decades ──
  for (const decade of mystery.decades) {
    // Meditation (announcing the mystery)
    steps.push({
      kind: "meditation",
      name: decade.name,
      scriptureRef: decade.scriptureRef,
      summary: decade.summary,
      section: "decade",
      decade: decade.number,
    });
    // Our Father
    steps.push({
      kind: "prayer",
      name: "Our Father",
      body: PRAYERS.ourFather,
      section: "decade",
      decade: decade.number,
    });
    // 10 Hail Marys
    for (let i = 0; i < 10; i++) {
      steps.push({
        kind: "prayer",
        name: "Hail Mary",
        body: PRAYERS.hailMary,
        section: "decade",
        decade: decade.number,
        beadIndex: i,
      });
    }
    // Glory Be
    steps.push({
      kind: "prayer",
      name: "Glory Be",
      body: PRAYERS.gloryBe,
      section: "decade",
      decade: decade.number,
    });
    // Fatima Prayer
    steps.push({
      kind: "prayer",
      name: "Fatima Prayer",
      body: PRAYERS.fatima,
      section: "decade",
      decade: decade.number,
    });
  }

  // ── Closing ──
  steps.push({ kind: "prayer", name: "Hail, Holy Queen", body: PRAYERS.hailHolyQueen, section: "closing" });
  steps.push({ kind: "prayer", name: "Closing Prayer", body: PRAYERS.finalPrayer, section: "closing" });

  return steps;
}
