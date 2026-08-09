/**
 * Monthly devotions (2026-07-07) — the Church's traditional dedication for each
 * month, surfaced in Walk Together as a "pray with the whole Church this month"
 * rhythm: a teaching from His Word (Douay-Rheims, public domain), a public-domain
 * prayer, the paired community novena, and a short teaching QUIZ (with a communal
 * leaderboard — knowledge game only, never prayer/streaks).
 *
 * All Scripture is Douay-Rheims (public domain). All prayers are traditional
 * public-domain texts. Content is DRAFT v1, pending Fr. Murphy review. Sources:
 * drbo.org (DR), usccb.org, fisheaters.com (traditional dedication cycle).
 */

export type QuizQuestion = {
  q: string;
  options: string[];
  /** index of the correct option */
  answer: number;
};

/** A Scripture passage in the learning module. Text is World English Bible
 * (public domain, modern book names). NABRE could be licensed later.
 * `context` (optional) is a short 2-3 sentence tie-in shown on the page right
 * after the verse, explaining how it connects to the month's theme. */
export type ModuleScripture = { ref: string; text: string; context?: string };

/** One session ("page") of the month's learning module: Scriptures to read, a
 * multi-paragraph teaching, a short prayer, a fuller closing prayer tied to the
 * month's devotion, and that session's daily quiz. */
export type ModuleSession = {
  n: number;
  title: string;
  scriptures: ModuleScripture[];
  teaching: string[];
  prayer?: string;
  /** Fuller original prayer shown as the session's final page, weaving the
   * month's devotion and this session's theme together. */
  closingPrayer?: string;
  quiz: QuizQuestion[];
};

export type MonthlyDevotion = {
  month: number; // 1-12
  title: string;
  monthLabel: string;
  scriptureRef: string;
  scriptureText: string;
  teaching: string;
  prayerLabel: string;
  prayer: string;
  /** Paired novena in the library, if a good match exists. */
  novenaId?: string;
  quiz: QuizQuestion[];
  /** Rich multi-session learning module. If absent, one session is derived
   * from the summary fields (so every month has a module). */
  sessions?: ModuleSession[];
};

export const MONTHLY_DEVOTIONS: MonthlyDevotion[] = [
  {
    month: 7,
    title: "The Most Precious Blood of Jesus",
    monthLabel: "July — The Most Precious Blood of Jesus",
    scriptureRef: "Revelation 12:11 (World English Bible)",
    scriptureText:
      "They overcame him because of the Lamb's blood, and because of the word of their testimony. They didn't love their life, even to death.",
    teaching:
      "July honors the Precious Blood — the cost already paid for you. When shame says 'you are too far gone,' Scripture answers that we are redeemed not by silver or gold but by the Blood of Christ. Notice how Apocalypse describes overcoming: by the Blood of the Lamb, and by the word of their testimony. Your honest story, joined to His mercy, is part of how the battle is won.",
    prayerLabel: "The Precious Blood aspiration (traditional)",
    prayer:
      "Eternal Father, I offer Thee the Precious Blood of Jesus Christ in atonement for my sins, in supplication for the holy souls in purgatory, and for the needs of holy Church.",
    novenaId: "divine-mercy",
    quiz: [
      { q: "In July, the Church especially honors…", options: ["The Precious Blood of Jesus", "The Holy Rosary", "St. Joseph", "The Holy Souls"], answer: 0 },
      { q: "In Apocalypse 12:11, the faithful overcame by the Blood of the Lamb and by…", options: ["the word of their testimony", "the strength of their hands", "the wisdom of the world", "their riches"], answer: 0 },
      { q: "St. Peter says we were redeemed not with silver or gold, but with…", options: ["the precious Blood of Christ", "great effort", "the law", "the angels"], answer: 0 },
      { q: "At the Last Supper Jesus said, 'This is my blood of the new testament, which shall be shed for many unto…'", options: ["remission of sins", "earthly reward", "a sign", "judgment"], answer: 0 },
    ],
    sessions: [
      {
        n: 1,
        title: "The Blood of the Lamb",
        scriptures: [
          {
            ref: "Leviticus 17:11",
            text: "For the life of the flesh is in the blood. I have given it to you on the altar to make atonement for your souls; for it is the blood that makes atonement by reason of the life.",
            context: "Long before Calvary, God taught Israel that life itself is carried in the blood, and that atonement costs a life. July's devotion to the Precious Blood begins here: the altar of Leviticus was a rehearsal, preparing the world for the one offering that could truly answer for sin.",
          },
          {
            ref: "1 Peter 1:18-19",
            text: "knowing that you were redeemed, not with corruptible things, with silver or gold, from the useless way of life handed down from your fathers, but with precious blood, as of a lamb without blemish or spot, the blood of Christ.",
            context: "Peter names the currency of your redemption: not silver or gold, but the Blood of Christ, precious beyond measure. This is the heart of the month's theme — your worth was set by what God was willing to pay, and He paid the most costly thing in existence.",
          },
          {
            ref: "Hebrews 9:22",
            text: "According to the law, nearly everything is cleansed with blood, and apart from shedding of blood there is no remission.",
            context: "Hebrews states the sober rule beneath the whole story: without the shedding of blood there is no forgiveness. The Precious Blood is not a decoration on the faith but its price — the measure of how seriously God takes both sin and you.",
          },
        ],
        teaching: [
          "From the beginning of Israel's worship, God taught a truth that runs like a scarlet thread through all of Scripture: life is in the blood, and it is blood that makes atonement. In Leviticus the blood of the sacrifice was poured out on the altar because a life given stood in the place of the life owed. These offerings were never magic; they were a long rehearsal, teaching a people to wait for a life that could truly answer for sin.",
          "The Catholic tradition sees every one of those altars pointing forward to Calvary, where the true Lamb was offered once for all. Saint Peter tells us plainly that we were not ransomed with silver or gold, but with the precious blood of Christ, a lamb without blemish or spot. The word precious means costly beyond measure; the Church devotes the month of July to this Most Precious Blood precisely because it is the price of our souls, poured out freely and not grudgingly.",
          "The letter to the Hebrews states the sober logic underneath it all: without the shedding of blood there is no remission of sin. This is not a God who is bloodthirsty, but a reality about how deep the wound of sin goes and how far love was willing to reach to heal it. The Blood is the measure of how seriously God takes both our sin and our worth.",
          "For anyone carrying shame, or the weary sense that they are damaged goods, this first truth is meant to land gently and firmly: you were bought at the highest price in existence. God did not redeem you with something cheap or leftover. He gave the very life of His Son, which means your life was judged worth that much, and no failure since can lower a price that was already paid in full.",
        ],
        prayer: "Eternal Father, I offer You the Most Precious Blood of Jesus, in atonement for my sins and for the needs of all the world.",
        closingPrayer: "Eternal Father, from the first altars of Israel You taught that life is carried in the blood, and that a life given could stand in the place of a life owed. On Calvary You gave the life of Your own Son for mine. I was not bought with silver or gold, but with the Precious Blood of the Lamb without blemish; when shame tells me I am worth little, remind me of the price You paid. Receive my thanks for a love that costly, and keep me close to the Cross where it was poured out. Amen.",
        quiz: [
          { q: "According to Leviticus 17:11, why does blood make atonement?", options: ["Because it is red like fire", "Because the life of the flesh is in the blood", "Because it is offered at night", "Because the priest commands it"], answer: 1 },
          { q: "In 1 Peter 1:18-19, what were we NOT redeemed with?", options: ["The precious blood of Christ", "A lamb without blemish", "Corruptible things such as silver or gold", "The life handed down from our fathers"], answer: 2 },
          { q: "What does Hebrews 9:22 say is required for remission of sin?", options: ["The shedding of blood", "A long fast", "The passing of many years", "A gift of gold"], answer: 0 },
          { q: "Why does the Church call this the 'Precious' Blood?", options: ["Because it is rare in nature", "Because it is costly beyond measure, the price of our souls", "Because it is difficult to describe", "Because only priests may speak of it"], answer: 1 },
        ],
      },
      {
        n: 2,
        title: "A Price Already Paid",
        scriptures: [
          {
            ref: "Ephesians 1:7",
            text: "in whom we have our redemption through his blood, the forgiveness of our trespasses, according to the riches of his grace,",
            context: "Paul puts the month's theme in the past tense: we have redemption through His Blood. The ransom is not pending or partial — forgiveness flows from a payment already made, out of riches of grace that do not run out.",
          },
          {
            ref: "Colossians 1:13-14",
            text: "who delivered us out of the power of darkness, and translated us into the Kingdom of the Son of his love, in whom we have our redemption, the forgiveness of our sins.",
            context: "Here the Blood works as a rescue and a change of address — out of darkness, into the Kingdom of the Son. For anyone who feels stuck in an old story, this verse says the decisive move has already been made for you.",
          },
          {
            ref: "Isaiah 1:18",
            text: "Come now, and let us reason together, says Yahweh: Though your sins are as scarlet, they shall be as white as snow. Though they are red like crimson, they shall be as wool.",
            context: "Centuries before the Cross, God invites people still red with sin to come and talk with Him — not once they have fixed themselves. The promise of scarlet made white as snow is exactly what the Precious Blood accomplishes: the stain is not hidden, it is washed.",
          },
        ],
        teaching: [
          "One of the cruelest lies the human heart can believe is that 'I am too far gone.' It whispers loudest to those who have fallen many times, who have relapsed after promising themselves it was the last time, who feel their record is too long to ever be clean. Saint Paul answers that lie not with a pep talk but with a fact: in Christ we have redemption through His Blood, the forgiveness of our trespasses.",
          "Redemption is a purchase word. To redeem is to buy back what was lost or enslaved, and Paul says this has already happened through the Blood. This is why despair over old sins, however understandable, misreads the situation: the ransom is not still being negotiated, it has been paid. Your freedom does not depend on your producing a payment you cannot afford; it depends on receiving what Christ has already spent everything to give.",
          "In Colossians the same Blood is described as a rescue and a change of address. God delivered us out of the power of darkness and carried us into the Kingdom of His beloved Son. For someone caught in the pull of addiction or compulsion, this matters: you are not asked to climb out of the pit by your own strength alone, but to let yourself be carried by One who has already come down into it for you.",
          "Isaiah dares to picture what the Blood does to a stained conscience. Though your sins are as scarlet, they shall be as white as snow. Notice that God says come and reason together, not come once you have fixed yourself. The invitation is extended to people still red with crimson, and the promise is that the very Blood which is scarlet is what makes the soul white.",
          "None of this is a claim that grace erases consequences, or that healing from addiction happens instantly, or that we may stop seeking help and honest effort. The Church has never taught cheap forgiveness. But it does teach that mercy is real, that Confession applies this Blood to specific sins by name, and that no number of falls can exhaust a mercy that was infinite before you ever sinned.",
        ],
        prayer: "Blood of Christ, price of our salvation, save us.",
        closingPrayer: "Lord Jesus Christ, Your Blood has already paid the ransom I could never afford. When the old lie returns that I am too far gone, let me hear Your answer instead: redeemed, forgiven, carried out of darkness into Your Kingdom. Wash what is scarlet in me until it is whiter than snow, and give me the humility to receive what I cannot earn — mercy for the past, help for today, and hope for whatever comes next. Amen.",
        quiz: [
          { q: "According to Ephesians 1:7, our redemption and forgiveness come through what?", options: ["Our own good works", "His blood", "The passing of time", "The riches of gold"], answer: 1 },
          { q: "In Colossians 1:13, what did God deliver us out of?", options: ["The Kingdom of the Son", "Our daily labors", "The power of darkness", "The riches of grace"], answer: 2 },
          { q: "How does Isaiah 1:18 describe what happens to sins that are 'as scarlet'?", options: ["They shall be as white as snow", "They shall be hidden away", "They shall be counted again", "They shall remain crimson"], answer: 0 },
          { q: "What does the teaching say about the lie 'I am too far gone'?", options: ["It is usually accurate for repeat sins", "The ransom has already been paid, so it misreads the situation", "It can only be answered by trying harder", "It is best ignored without response"], answer: 1 },
        ],
      },
      {
        n: 3,
        title: "Overcoming by the Blood",
        scriptures: [
          {
            ref: "Revelation 12:11",
            text: "They overcame him because of the Lamb's blood, and because of the word of their testimony. They didn't love their life, even to death.",
            context: "This is July's battle verse: victory over the accuser comes because of the Lamb's Blood first, and then the honest word of testimony. You do not out-argue shame — you point to the Blood, and you tell the truth about mercy received.",
          },
          {
            ref: "Revelation 7:14",
            text: "These are those who came out of the great tribulation. They washed their robes, and made them white in the Lamb's blood.",
            context: "John sees a multitude who came through the great tribulation, their robes washed white in Blood that whitens instead of stains. A hard season does not disqualify you from this crowd — it is precisely what the Blood carried them through.",
          },
          {
            ref: "1 John 1:7",
            text: "But if we walk in the light, as he is in the light, we have fellowship with one another, and the blood of Jesus Christ, his Son, cleanses us from all sin.",
            context: "John moves the Blood from a past event into the present tense: as we walk in the light, it keeps on cleansing us. The Precious Blood is not a one-time transaction but an ongoing washing for people still on the road.",
          },
        ],
        teaching: [
          "Revelation gives us the single verse that has strengthened persecuted and struggling Christians for two thousand years: they overcame him because of the Lamb's blood, and because of the word of their testimony. Victory in the Christian life is never described as something we generate on our own. It comes because of the Blood first, and then because of testimony, the honest word about what that Blood has done.",
          "This order is pastorally important for anyone fighting despair or a besetting sin. The accuser in this chapter is precisely the voice that catalogues your failures and calls it the truth. He is overcome not by your winning an argument about your own worthiness, but by pointing to the Blood, and then by telling the truth of your own story of mercy received.",
          "In chapter seven John sees a great multitude who came out of the great tribulation and washed their robes white in the Lamb's blood. It is a striking image: blood that whitens rather than stains. These are not people who avoided the tribulation; they came through it, and what cleansed them was the same Blood offered to us. Your hardest season is not proof you are outside this multitude.",
          "Saint John's first letter keeps this from becoming abstract by grounding it in daily walking: if we walk in the light, the blood of Jesus cleanses us from all sin. Cleansing is spoken of in the present tense, an ongoing washing for people still on the road. This is mercy as a way of living, not a single transaction, and it stands directly against despair, which insists nothing can be washed clean.",
        ],
        prayer: "Blessed be his most Precious Blood.",
        closingPrayer: "Lamb of God, when the accuser catalogues my failures and calls it the truth, teach me to answer him not with my own record but with Yours. I overcome by Your Blood and by the honest word of my testimony: that You have shown mercy to me, and are showing it still. Wash my robe in the Blood that whitens what it touches, and as I walk in Your light, go on cleansing me day by day, until despair has nothing left to say. Amen.",
        quiz: [
          { q: "According to Revelation 12:11, they overcame him by the Lamb's blood and what else?", options: ["The strength of their hands", "The word of their testimony", "The wisdom of their leaders", "The passing of the tribulation"], answer: 1 },
          { q: "In Revelation 7:14, how did the great multitude make their robes white?", options: ["By washing them in the Lamb's blood", "By avoiding all tribulation", "By their own righteousness", "By waiting many years"], answer: 0 },
          { q: "What does 1 John 1:7 say cleanses us from all sin as we walk in the light?", options: ["Our own effort", "The community's approval", "The blood of Jesus Christ", "The great tribulation"], answer: 2 },
          { q: "What is the pastoral point about the order in Revelation 12:11?", options: ["Testimony must come before the Blood", "Victory comes because of the Blood first, then honest testimony", "We overcome by winning an argument about our worthiness", "The accuser is defeated by ignoring him"], answer: 1 },
        ],
      },
      {
        n: 4,
        title: "The Cup of the New Covenant",
        scriptures: [
          {
            ref: "Matthew 26:27-28",
            text: "He took the cup, gave thanks, and gave to them, saying, 'All of you drink it, for this is my blood of the new covenant, which is poured out for many for the remission of sins.'",
            context: "At the Last Supper Jesus places the month's theme into a cup and hands it to His friends: the Blood of the new covenant, poured out for the remission of sins. What Calvary paid for us, the Eucharist now gives to us.",
          },
          {
            ref: "John 6:56",
            text: "He who eats my flesh and drinks my blood lives in me, and I in him.",
            context: "Jesus promises a mutual indwelling to those who receive His Blood: he lives in me, and I in him. The Blood that redeems us from afar also draws us into the closest belonging that exists.",
          },
          {
            ref: "1 Corinthians 10:16",
            text: "The cup of blessing which we bless, isn't it a sharing of the blood of Christ? The bread which we break, isn't it a sharing of the body of Christ?",
            context: "Paul calls the cup of blessing a real sharing in the Blood of Christ. The Blood that bought you also gathers you — the price of your soul becomes a family meal, where the one who felt like an outsider is a welcomed guest.",
          },
        ],
        teaching: [
          "On the night before He died, Jesus took the cup, gave thanks, and said, this is my blood of the new covenant, which is poured out for many for the remission of sins. The Church hears in these words the institution of the Eucharist, in which the same Precious Blood shed on the Cross is truly given to us. The Blood is not only something offered long ago for us; it is something offered now to us, into our very hands and hearts.",
          "In John chapter six Jesus speaks with a bluntness that scandalized His hearers: whoever drinks my blood lives in me, and I in him. The Catholic faith takes Him at His word. This is why the Eucharist is called Communion, a mutual indwelling, the closest belonging that exists: the redeemed one and the Redeemer abiding in each other.",
          "Saint Paul asks the Corinthians whether the cup of blessing is not a sharing in the blood of Christ. The word for sharing means communion and participation. For a person who has felt like an outsider, unworthy of a place at any table, this is the heart of the good news: the Blood that redeems is also the Blood that gathers, making the isolated one a welcomed guest at a family meal.",
          "Notice that Jesus gave thanks over the cup; the very word Eucharist means thanksgiving. The proper response to being redeemed at such a cost is not endless anxious striving but gratitude, the quiet astonishment of one who did not earn the seat they have been given. Gratitude reorders a wounded heart, turning attention away from the shame of what we lack toward the generosity of what we have received.",
        ],
        prayer: "Blessed be his most Precious Blood, poured out for us.",
        closingPrayer: "Lord Jesus, at the Last Supper You took the cup, gave thanks, and handed Your own Blood to Your friends. Thank You for a Blood that does not only ransom me from afar but gathers me to Your table, welcomes me though I have felt like an outsider, and makes Your home in me as I abide in You. Teach me Your Eucharistic heart: to answer so great a gift not with anxious striving but with gratitude. Blessed be Your most Precious Blood, now and for ever. Amen.",
        quiz: [
          { q: "In Matthew 26:28, Jesus says His blood of the new covenant is poured out for many for what?", options: ["The keeping of the law", "The remission of sins", "A sign to the nations", "The strength of the disciples"], answer: 1 },
          { q: "According to John 6:56, what happens for the one who eats His flesh and drinks His blood?", options: ["He lives in me, and I in him", "He is set apart from the community", "He must wait for the last day alone", "He receives only earthly life"], answer: 0 },
          { q: "In 1 Corinthians 10:16, the cup of blessing is a sharing in what?", options: ["The blood of Christ", "The riches of the Corinthians", "The old covenant", "The bread of angels"], answer: 0 },
          { q: "What does the word 'Eucharist' mean, as noted in the teaching?", options: ["Sacrifice", "Communion of saints", "Thanksgiving", "Covenant"], answer: 2 },
        ],
      },
    ],
  },
  {
    month: 1,
    title: "The Holy Name of Jesus",
    monthLabel: "January — The Holy Name of Jesus",
    scriptureRef: "Philippians 2:10 (World English Bible)",
    scriptureText: "That at the name of Jesus every knee should bow, of those in heaven, those on earth, and those under the earth.",
    teaching: "When the mind is racing with panic or a craving pulls hard, you do not need a long speech to pray. The Holy Name of Jesus is a single, short anchor you can whisper again and again until the storm loosens its grip. Every time the thought spirals away, you can gently return to that one Name.",
    prayerLabel: "A Holy Name aspiration",
    prayer: "Blessed be the Name of the Lord, now and for ever.",
    novenaId: "holy-spirit",
    quiz: [
      { q: "In January, the Church especially honors…", options: ["The Holy Name of Jesus", "The Sacred Heart of Jesus", "St. Joseph", "The Blessed Virgin Mary"], answer: 0 },
      { q: "According to Philippians 2:10, at the name of Jesus every knee should bow in how many realms?", options: ["Only in heaven", "Heaven and earth only", "Heaven, earth, and under the earth", "Only among the angels"], answer: 2 },
      { q: "Why is the Holy Name described as an anchor in times of panic or craving?", options: ["It is a long formal prayer to recite", "It is a short word you can return to again and again", "It must be said aloud in church only", "It replaces the need for any other prayer"], answer: 1 },
    ],
    sessions: [
      {
        n: 1,
        title: "The Name That Saves",
        scriptures: [
          {
            ref: "Matthew 1:21",
            text: "She shall give birth to a son. You shall call his name Jesus, for it is he who shall save his people from their sins.",
            context: "The angel does not leave the child's mission vague: he is to be named Jesus because he will save his people from their sins. January's devotion begins here — the Holy Name is not a label but a promise, spoken before his birth, that sin would not have the last word over his people.",
          },
          {
            ref: "Luke 1:31",
            text: "Behold, you will conceive in your womb, and give birth to a son, and will call his name 'Jesus.'",
            context: "Before Mary has seen or understood anything of what is coming, heaven has already chosen her Son's Name. The Name the Church honors this month was God's own idea, announced by an angel, carrying God's own intention inside it.",
          },
          {
            ref: "Luke 2:21",
            text: "When eight days were fulfilled for the circumcision of the child, his name was called Jesus, which was given by the angel before he was conceived in the womb.",
            context: "On the eighth day the Name given by heaven is spoken aloud over the child, at the very moment his blood is first shed. The Church remembers this naming at the start of January, which is why the whole month is given to the Holy Name.",
          },
        ],
        teaching: [
          "In Scripture a name is never just a label; it carries a calling and a mission inside it. When the angel tells Joseph what the child is to be called, he also gives the reason: you shall call his name Jesus, for it is he who shall save his people from their sins. The Name means 'Yahweh saves,' so that every time it is spoken, the whole gospel is spoken in miniature. January is the month the Church sets aside to honor this Name, because the Name holds the mission.",
          "Notice that the Name did not come from Mary or Joseph. Luke records that it was announced by the angel before the child was even conceived, and given formally on the eighth day, when the infant's blood was first shed at his circumcision. From the beginning, the Name and the saving of his people belong together. The Church's devotion to the Holy Name, preached with great love by saints such as Bernardine of Siena, grew from this simple fact: God named His Son after what He intended to do for us.",
          "This matters for anyone who feels defined by their worst chapter — a diagnosis, a record, a relapse, a season they cannot undo. The Name of Jesus declares what God is doing, and what He addresses is precisely sin and its wreckage. This Name was not chosen for people who have everything together; it was chosen for people who have something they need to be saved from. To speak it honestly is to admit the need and to welcome the Rescuer in the same breath.",
          "So the devotion of this month can begin very simply: speak the Name, slowly and with reverence. This is not a magic word or a technique; it is a Person, and saying his Name is turning toward him. The old custom of bowing the head slightly at the Name of Jesus, and of refusing to use it carelessly or in anger, is part of the same devotion — treating as holy the word that carries our salvation.",
        ],
        prayer: "Blessed be the Name of the Lord, now and for ever.",
        closingPrayer: "Lord Jesus, your Name was spoken by an angel before you were born, and it carries the whole reason you came: to save your people from their sins. I confess that I am one of those people, and I am glad your Name was chosen with someone like me in mind. Teach me this month to speak your Name slowly and with reverence, never carelessly, and to let it remind me of what you intend to do in my life. When I am tempted to be defined by my worst chapter, let your Name have the last word instead. Amen.",
        quiz: [
          { q: "According to Matthew 1:21, why is the child to be called Jesus?", options: ["Because it was a family name", "Because the priests chose it", "Because it is he who shall save his people from their sins", "Because it means 'prince of peace'"], answer: 2 },
          { q: "In Luke 1:31, who announces the Name before the child is conceived?", options: ["Joseph", "The angel speaking to Mary", "Simeon in the temple", "The shepherds"], answer: 1 },
          { q: "According to Luke 2:21, when was the child formally named Jesus?", options: ["At the circumcision, when eight days were fulfilled", "At his baptism in the Jordan", "When the wise men arrived", "At the wedding in Cana"], answer: 0 },
          { q: "How does the teaching describe speaking the Holy Name?", options: ["As a magic word that guarantees results", "As a formula only priests may use", "As a replacement for all other prayer", "As turning toward a Person, spoken with reverence"], answer: 3 },
        ],
      },
      {
        n: 2,
        title: "The Name Above Every Name",
        scriptures: [
          {
            ref: "Philippians 2:9-11",
            text: "Therefore God also highly exalted him, and gave to him the name which is above every name; that at the name of Jesus every knee should bow, of those in heaven, those on earth, and those under the earth, and that every tongue should confess that Jesus Christ is Lord, to the glory of God the Father.",
            context: "This is January's headline text: the Name of Jesus is set above every name, and every knee in every realm must bow to it. Whatever powers seem to rule your life — fear, craving, shame — none of them outrank this Name.",
          },
          {
            ref: "Acts 4:12",
            text: "There is salvation in none other, for neither is there any other name under heaven, that is given among men, by which we must be saved!",
            context: "Peter, standing before the very court that condemned Jesus, stakes everything on one Name. The month's devotion is not sentimental fondness for a word; it is the Church's conviction that rescue comes through this Name and no other.",
          },
          {
            ref: "Psalm 8:1",
            text: "Yahweh, our Lord, how majestic is your name in all the earth, who has set your glory above the heavens!",
            context: "Long before Bethlehem, Israel sang of the majesty of God's Name filling the whole earth. The Church hears in this psalm a preparation for the Name of Jesus, in which that ancient majesty came close enough to be whispered by the weakest voice.",
          },
        ],
        teaching: [
          "Saint Paul quotes what many scholars believe was one of the Church's earliest hymns: Christ humbled himself, obedient even to death on a cross, and therefore God highly exalted him and gave him the name which is above every name. The exaltation follows the humiliation. The Name of Jesus was glorified not in spite of the Cross but through it, which means this Name knows suffering from the inside.",
          "Paul then names three realms — heaven, earth, and under the earth — and says every knee in all of them must bow at the name of Jesus. Nothing is left out of that list. The powers that feel absolute in a dark season, whether fear, compulsion, resentment, or despair, are not above this Name; they are among the things that must eventually kneel to it. That is a fact about reality, not a mood we must work ourselves into feeling.",
          "Peter says it with complete plainness before the council in Jerusalem: there is no other name under heaven given among men by which we must be saved. The Church has never taught that human effort, therapy, medicine, or community are worthless — they are gifts to be used gratefully. But she has always taught that salvation itself, the deepest rescue of a human soul, comes through Jesus alone, and so his Name is where our confidence finally rests.",
          "Psalm 8 marvels that the majestic Name of the Lord fills all the earth. In Jesus, that majesty came near enough to be spoken by anyone — a child, a dying man, a person mid-panic who can manage only one word. When everything else about your life feels small or ruined, you still share in something immense every time you say his Name with faith: a majesty set above the heavens, now placed gently within reach.",
        ],
        prayer: "May the Name of the Lord be blessed, from this time forward and forever more.",
        closingPrayer: "Lord Jesus Christ, your Father has exalted you and given you the Name above every name, and one day every knee in heaven, on earth, and under the earth will bow to it. I bring you the names that have felt bigger than yours in my life — my fears, my cravings, my failures, the words others have spoken over me — and I set them all beneath your Name where they belong. There is no other name by which I can be saved, and I do not need another. Let my knee bow gladly now, so that my heart learns to rest where my rescue is. Amen.",
        quiz: [
          { q: "According to Philippians 2:9-11, why did God highly exalt Jesus and give him the name above every name?", options: ["Because he humbled himself and was obedient, even to death", "Because the crowds demanded it", "Because the apostles voted for it", "Because he asked the angels for it"], answer: 0 },
          { q: "Philippians 2:10 says every knee should bow in which realms?", options: ["Heaven only", "Earth and sea", "Heaven, earth, and under the earth", "Wherever the Church has spread"], answer: 2 },
          { q: "In Acts 4:12, what does Peter say about the name of Jesus?", options: ["It is one of several saving names", "It is no other name under heaven given among men by which we must be saved", "It should be kept secret from the council", "It saves only those who never fall"], answer: 1 },
          { q: "What does the teaching say about powers like fear, compulsion, and despair?", options: ["They are equal in rank to the Holy Name", "They can never be brought to kneel", "They must be defeated before we may pray", "They are among the things that must eventually bow to the Name"], answer: 3 },
        ],
      },
      {
        n: 3,
        title: "A Strong Tower in the Storm",
        scriptures: [
          {
            ref: "Proverbs 18:10",
            text: "Yahweh's name is a strong tower: the righteous run to him, and are safe.",
            context: "The proverb pictures the Name of God as a fortress you run into when the enemy is at your heels. This month's devotion is exactly that practical: when panic or craving is closing in, the Holy Name is a door you can reach in a single breath.",
          },
          {
            ref: "Psalm 116:3-4",
            text: "The cords of death surrounded me, the pains of Sheol got a hold of me. I found trouble and sorrow. Then I called on Yahweh's name: 'Yahweh, I beg you, deliver my soul.'",
            context: "The psalmist does not pretend his crisis was small; he was tangled in cords of death and sorrow when he called on the Name. His whole prayer in that moment was one line, which is permission for yours to be that short too.",
          },
          {
            ref: "Romans 10:13",
            text: "For, 'Whoever will call on the name of the Lord will be saved.'",
            context: "Paul makes the promise as wide as the word 'whoever' — no record, relapse, or history is listed as an exception. Calling on the Name is the one door January's devotion keeps pointing to, and it is never locked from God's side.",
          },
        ],
        teaching: [
          "Proverbs gives the Holy Name devotion its most practical picture: the Name of the Lord is a strong tower, and the righteous run to it and are safe. Notice what the righteous person does in this verse — not stand in the open field and out-fight the enemy, but run. There is no shame in the running; running to the right place is the very thing Scripture calls wisdom. When a craving pulls hard or panic starts to rise, the first move is not to win the argument in your head but to get inside the tower.",
          "Psalm 116 shows what that looks like from the inside of a crisis. The psalmist says the cords of death had surrounded him and sorrow had taken hold — and then his entire prayer is one line: Yahweh, I beg you, deliver my soul. Scripture itself models the shortest kind of prayer, prayed from the worst kind of moment. You do not need composure, eloquence, or a quiet room; you need one Name and the honesty to say it.",
          "This is the ancient instinct behind the Jesus Prayer, treasured for centuries especially in the Christian East: 'Lord Jesus Christ, Son of God, have mercy on me, a sinner,' repeated slowly, breath by breath. Each repetition is another step back into the tower. The repetition is not vain because it is not empty; it is the same trust renewed each time the mind spirals away and gently returns.",
          "Be careful to hear this rightly: the Holy Name is not a technique that guarantees a feeling, and it does not replace the doctor, the sponsor, the counselor, or the friend God has given you. Grace ordinarily works through those helps rather than around them. But under and within all of them, whoever calls on the name of the Lord will be saved — and 'whoever' has no asterisk. The tower door is never locked from God's side, no matter how many times you have had to run to it.",
        ],
        prayer: "Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
        closingPrayer: "Lord Jesus, your Name is a strong tower, and tonight I am done pretending I can hold the open field alone. When the cords tighten — the racing thoughts, the pull of old habits, the sorrow that shows up uninvited — teach me to run, not to a bottle or a screen or my own spinning mind, but to you. My prayer may only be one word some days; let that word be your Name, and let it be enough to get me through the door. Keep the tower open to me every hour of this month, and make my feet quick to find it. Amen.",
        quiz: [
          { q: "In Proverbs 18:10, what do the righteous do with the strong tower of Yahweh's name?", options: ["They defend it with weapons", "They admire it from a distance", "They run to him and are safe", "They build it themselves"], answer: 2 },
          { q: "In Psalm 116, what was the psalmist's entire prayer when the cords of death surrounded him?", options: ["Yahweh, I beg you, deliver my soul", "A long recitation of the law", "A song of triumph", "A vow to never sin again"], answer: 0 },
          { q: "What caution does the teaching give about the Holy Name?", options: ["It should only be prayed in church", "It is not a technique guaranteeing a feeling, and does not replace the helps God has given", "It works only after long practice", "It must be prayed in Latin"], answer: 1 },
          { q: "According to Romans 10:13, who will be saved by calling on the name of the Lord?", options: ["Those without any record of failure", "Only the righteous of Israel", "Those who pray at fixed hours", "Whoever calls on the name of the Lord"], answer: 3 },
        ],
      },
      {
        n: 4,
        title: "Everything in His Name",
        scriptures: [
          {
            ref: "John 16:23-24",
            text: "In that day you will ask me no questions. Most certainly I tell you, whatever you may ask of the Father in my name, he will give it to you. Until now, you have asked nothing in my name. Ask, and you will receive, that your joy may be made full.",
            context: "On the night before he died, Jesus opened his own Name to his friends as their way to the Father. Asking in his Name means asking inside his heart and his will — and the promised end of such asking is not obligation but joy made full.",
          },
          {
            ref: "Acts 3:6",
            text: "But Peter said, 'I have no silver or gold, but what I have, that I give you. In the name of Jesus Christ of Nazareth, get up and walk!'",
            context: "Peter meets a man who has been unable to walk his whole life, and gives him the only treasure he has: the Name. The Church still has no better gift to offer a wounded world, and the Name still lifts people to their feet.",
          },
          {
            ref: "Colossians 3:17",
            text: "Whatever you do, in word or in deed, do all in the name of the Lord Jesus, giving thanks to God the Father, through him.",
            context: "Paul widens the devotion from moments of crisis to the whole fabric of a day: everything, in word or deed, can be done in the Name. January's devotion is complete when the Name is not only your emergency prayer but the quiet signature over your ordinary life.",
          },
        ],
        teaching: [
          "At the Last Supper, Jesus gave his friends a standing invitation: whatever you ask of the Father in my name, he will give it to you. To ask in his Name is not to add a formula to the end of a prayer; it is to ask from inside his friendship, wanting what he wants, trusting the Father as he does. That is why the promise ends with joy made full rather than a list of guaranteed outcomes. God answers every such prayer, though not always in the form or on the schedule we imagined, and the Church has never promised otherwise.",
          "In Acts, Peter meets a man lame from birth who asks for money, and Peter answers with striking honesty: I have no silver or gold, but what I have, that I give you. Then he gives the Name, and the man stands. The Church has often been poor in silver and gold, and each of us comes to others with empty pockets in one way or another. But no one who carries the Name of Jesus comes empty-handed to a suffering person.",
          "Saint Paul then stretches the devotion across the whole of ordinary life: whatever you do, in word or in deed, do all in the name of the Lord Jesus. Washing dishes, answering an email, keeping a hard appointment, staying sober one more evening — all of it can be signed with the Name and offered with thanksgiving. A life in recovery is built mostly of unglamorous hours, and this verse dignifies every one of them.",
          "So the month of the Holy Name ends where it began, but wider. The Name that saves, the Name above every name, the Name that is a tower in the storm, is finally meant to become the atmosphere of an entire life. You will still have days when the Name is only a gasp in the dark, and that is enough; but grace is patient, and slowly the Name becomes less like an emergency cord and more like the air a household breathes. Blessed be the Name of the Lord, now and for ever.",
        ],
        prayer: "Blessed be the most holy Name of Jesus, now and for ever.",
        closingPrayer: "Father, I come to you in the Name of Jesus, the Name you exalted above every name and gave to us as our way home. I have little silver or gold to show for my life some days, but I carry a treasure I did not earn: the Name of your Son, spoken over me and welcomed in me. Teach me to ask in that Name with trust, to work and speak and rest in that Name with thanksgiving, and to hand that Name gently to others who are still sitting where I once sat. May everything I do this month, in word or in deed, be done in the Name of the Lord Jesus, until my joy is made full. Amen.",
        quiz: [
          { q: "In John 16:24, why does Jesus tell the disciples to ask in his name?", options: ["So that they may prove their loyalty", "That their joy may be made full", "So that questions will multiply", "To earn the Father's attention"], answer: 1 },
          { q: "In Acts 3:6, what does Peter say he does NOT have?", options: ["Faith and hope", "The Name of Jesus", "A word for the man", "Silver or gold"], answer: 3 },
          { q: "According to Colossians 3:17, how much of life should be done in the name of the Lord Jesus?", options: ["Whatever you do, in word or in deed", "Only prayer and worship", "Only works of charity", "Only what is done in church"], answer: 0 },
          { q: "What does the teaching say about prayers asked in Jesus' Name?", options: ["They guarantee the exact outcome we imagined", "They are only heard from the sinless", "God answers them, though not always in the form or schedule we expected", "They require many words to be valid"], answer: 2 },
        ],
      },
    ],
  },
  {
    month: 2,
    title: "The Holy Family",
    monthLabel: "February — The Holy Family",
    scriptureRef: "Luke 2:51 (World English Bible)",
    scriptureText: "He went down with them and came to Nazareth. He was subject to them.",
    teaching: "If your own family has left wounds, or you feel unseen and ordinary, look to the hidden years at Nazareth. God chose to spend most of his earthly life in quiet obedience and unremarkable days, not in spectacle. Your hidden struggles and unnoticed faithfulness are not wasted; they are the very ground where he chose to dwell.",
    prayerLabel: "A prayer to the Holy Family",
    prayer: "Jesus, Mary, and Joseph, I give you my heart and my soul. Jesus, Mary, and Joseph, assist me in my last agony. Jesus, Mary, and Joseph, may I breathe forth my soul in peace with you.",
    novenaId: "st-joseph",
    quiz: [
      { q: "In February, the Church especially honors…", options: ["St. Joseph", "The Holy Family", "The Holy Eucharist", "The Holy Name of Jesus"], answer: 1 },
      { q: "According to Luke 2:51, to what town did Jesus go down with Mary and Joseph?", options: ["Bethlehem", "Jerusalem", "Nazareth", "Capernaum"], answer: 2 },
      { q: "What does the verse say about how Jesus lived with Mary and Joseph?", options: ["He was subject to them", "He taught in the temple daily", "He lived apart from them", "He ruled over them"], answer: 0 },
      { q: "What comfort does the hidden life at Nazareth offer to those who feel unseen?", options: ["That God only values public greatness", "That ordinary, hidden faithfulness is where God chose to dwell", "That family wounds can never heal", "That struggles are always punishments"], answer: 1 },
    ],
    sessions: [
      {
        n: 1,
        title: "God Chose a Family",
        scriptures: [
          {
            ref: "Galatians 4:4-5",
            text: "But when the fullness of the time came, God sent out his Son, born to a woman, born under the law, that he might redeem those who were under the law, that we might receive the adoption of children.",
            context: "When God finally entered history, he did not descend as a spectacle; he was born to a woman, into a household, under the ordinary obligations of a family. February's devotion begins with this astonishing choice — and with its purpose, that we might be adopted as children ourselves.",
          },
          {
            ref: "Luke 2:6-7",
            text: "While they were there, the day had come for her to give birth. She gave birth to her firstborn son. She wrapped him in bands of cloth, and laid him in a feeding trough, because there was no room for them in the inn.",
            context: "The Holy Family's first night together was spent in borrowed shelter, with a feeding trough for a crib, because no room was made for them. From its very first hour, this family knew what it is to be poor, displaced, and overlooked.",
          },
          {
            ref: "Isaiah 9:6",
            text: "For to us a child is born. To us a son is given; and the government will be on his shoulders. His name will be called Wonderful, Counselor, Mighty God, Everlasting Father, Prince of Peace.",
            context: "Isaiah piles royal titles onto a child — Wonderful, Counselor, Mighty God — and yet the whole promise arrives as something as small and dependent as a newborn. The greatness of God chose to be carried, fed, and raised inside a family.",
          },
        ],
        teaching: [
          "Saint Paul says that when the fullness of time came, God sent his Son, born to a woman, born under the law. He could have arrived any way he wished — in fire, in glory, full-grown and untouchable. Instead the eternal Son entered the world the way every one of us did: through a mother, into a family, dependent on others for everything. The Church devotes February to the Holy Family because this choice was not incidental to our salvation; it was part of it.",
          "Luke lets us see how that family began: a birth far from home, a feeding trough for a bed, and a door that did not open for them. The Holy Family was holy without being comfortable, secure, or well-received. If your own beginnings were marked by poverty, instability, or being unwanted somewhere, you share more with this family than the paintings usually suggest.",
          "Isaiah had promised a child on whose shoulders the government would rest, called Wonderful, Counselor, Mighty God, Everlasting Father, Prince of Peace. The staggering thing is that all those titles came wrapped in bands of cloth, entrusted to a young mother and a working man. God judged an ordinary human family a fit dwelling for the Prince of Peace, which quietly dignifies every household, including complicated ones.",
          "And Paul names the purpose behind it all: that we might receive the adoption of children. God did not merely visit a family; he opened his own. Whatever your family of origin gave you or failed to give you, adoption means your deepest identity is received, not inherited — you are a wanted child in the household of God. That is the foundation this month will build on, one session at a time.",
        ],
        prayer: "Jesus, Mary, and Joseph, I give you my heart and my soul.",
        closingPrayer: "Lord Jesus, in the fullness of time you were born to a woman and laid in a feeding trough, choosing a poor and crowded-out family as the doorway of your coming. Thank you for entering the world from below, where so many of us actually live. Look kindly on the family I came from, with all it gave me and all it could not give, and heal what still aches there. And since you came so that I might receive the adoption of children, teach me to live as one who is wanted in your Father's house. Jesus, Mary, and Joseph, make your home in me. Amen.",
        quiz: [
          { q: "According to Galatians 4:4-5, why did God send his Son, born to a woman and under the law?", options: ["To establish an earthly kingdom immediately", "That we might receive the adoption of children", "To abolish family life", "To reward the righteous only"], answer: 1 },
          { q: "In Luke 2:7, where was the newborn Jesus laid, and why?", options: ["In a feeding trough, because there was no room for them in the inn", "In the inn, because room was found", "In the temple, as the law required", "In a royal cradle sent by the magi"], answer: 0 },
          { q: "Which of these is among the names given to the child in Isaiah 9:6?", options: ["Lion of Judah", "Son of Thunder", "Prince of Peace", "Good Shepherd"], answer: 2 },
          { q: "What does the teaching say the Holy Family's first night shows?", options: ["That holiness guarantees comfort and welcome", "That God avoids poverty", "That paintings of the Nativity are always accurate", "That this family was holy without being comfortable, secure, or well-received"], answer: 3 },
        ],
      },
      {
        n: 2,
        title: "The Hidden Years of Nazareth",
        scriptures: [
          {
            ref: "Luke 2:51",
            text: "And he went down with them, and came to Nazareth. He was subject to them, and his mother kept all these sayings in her heart.",
            context: "This is February's headline verse: the Son of God went home and was subject to Mary and Joseph. Almost all of his earthly life was spent in this hidden obedience, which means the unseen and unremarkable parts of your life are not beneath God's interest — they were his own chosen way of living.",
          },
          {
            ref: "Luke 2:52",
            text: "And Jesus increased in wisdom and stature, and in favor with God and men.",
            context: "Luke compresses roughly two decades into one sentence about slow, steady growth. Growth that no one applauds and no one records is still real growth — Nazareth is the proof.",
          },
          {
            ref: "John 1:46",
            text: "Nathanael said to him, 'Can any good thing come out of Nazareth?' Philip said to him, 'Come and see.'",
            context: "Nazareth was the kind of town people sneered at, and Nathanael says out loud what many assumed. God deliberately placed his family somewhere easy to dismiss, so no one could ever say their address or reputation put them outside his reach.",
          },
        ],
        teaching: [
          "Of the roughly thirty-three years Jesus spent on earth, about thirty were spent in Nazareth doing things no one thought worth writing down. Luke sums up those decades in a single line: he went down with them, came to Nazareth, and was subject to them. The Church has long marveled at this 'hidden life' — the eternal Word choosing years of chores, meals, work, and obedience in a small house. If God spent nine-tenths of his earthly life being ordinary, then ordinary is not the opposite of holy.",
          "He was subject to them: the One whom angels obey placed himself under the authority of a village carpenter and a young mother. This was not wasted time or a delay before the real mission; the Church teaches that these silent years belong to the mystery of our redemption too. Obedience, patience, and hidden faithfulness were being lived perfectly long before a single miracle was performed.",
          "Luke adds that Jesus increased in wisdom and stature, and in favor with God and men. Real growth in Nazareth was slow, unspectacular, and mostly invisible — one year very much like the last. Anyone in recovery knows this rhythm: progress that no one applauds, measured in quiet days rather than dramatic moments. Nazareth says that this kind of growth is not second-rate; it is the kind the Son of God himself chose.",
          "And Nazareth itself was nothing special — Nathanael's sneer, can any good thing come out of Nazareth, tells you what the neighbors thought. If you feel your life is too small, your town too forgettable, your story too unimpressive for God to be doing anything in it, the hidden years answer you directly. The greatest life ever lived looked, for thirty years, exactly like nothing was happening. Philip's reply is the only rebuttal needed: come and see.",
        ],
        prayer: "Jesus of Nazareth, hidden and faithful, make my hidden days holy.",
        closingPrayer: "Lord Jesus, you went down to Nazareth and were subject to Mary and Joseph, and for thirty years your holiness looked like ordinary days in an ordinary town. I confess that I often despise the smallness of my own life — the unnoticed efforts, the repeated routines, the growth too slow for anyone to see. Teach me what you taught in silence at Nazareth: that hidden faithfulness is not wasted, and that you are at work in years no one will ever write about. With Mary, let me keep these things in my heart rather than demand that they be seen. Amen.",
        quiz: [
          { q: "According to Luke 2:51, what did Jesus do when he came to Nazareth with Mary and Joseph?", options: ["He began teaching in the synagogue", "He worked his first miracle", "He was subject to them", "He departed for Jerusalem"], answer: 2 },
          { q: "In Luke 2:51, what did his mother do with all these sayings?", options: ["She kept them in her heart", "She wrote them on a scroll", "She told them to the neighbors", "She questioned the elders about them"], answer: 0 },
          { q: "Luke 2:52 says Jesus increased in wisdom and stature, and in favor with whom?", options: ["The scribes and Pharisees", "The Romans and Greeks", "The angels only", "God and men"], answer: 3 },
          { q: "What is the teaching's point about Nazareth's poor reputation in John 1:46?", options: ["Nathanael was right to dismiss it", "God placed his family somewhere easy to dismiss, so no address puts anyone outside his reach", "Jesus left Nazareth as soon as possible in shame", "Only impressive places can produce holiness"], answer: 1 },
        ],
      },
      {
        n: 3,
        title: "A Family Acquainted with Sorrow",
        scriptures: [
          {
            ref: "Luke 2:34-35",
            text: "and Simeon blessed them, and said to Mary, his mother, 'Behold, this child is set for the falling and the rising of many in Israel, and for a sign which is spoken against. Yes, a sword will pierce through your own soul, that the thoughts of many hearts may be revealed.'",
            context: "On what should have been a purely joyful day, Simeon tells Mary that a sword will pierce her soul. The Holy Family lived from its earliest days with a sorrow foretold, which means holiness and heartache can share the same house.",
          },
          {
            ref: "Luke 2:48",
            text: "When they saw him, they were astonished, and his mother said to him, 'Son, why have you treated us this way? Behold, your father and I were anxiously looking for you.'",
            context: "Mary and Joseph searched three days for their missing son, and Mary names the feeling without embarrassment: we were anxiously looking for you. Even the holiest parents who ever lived knew the ache of fear for someone they loved.",
          },
          {
            ref: "Psalm 34:18",
            text: "Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.",
            context: "The psalm locates God not far from the brokenhearted but near them, closest precisely where it hurts most. February's devotion holds this promise beside the Holy Family's sorrows: God does not merely observe grieving households, he draws near to them.",
          },
        ],
        teaching: [
          "We sometimes imagine the Holy Family living inside a soft glow where nothing painful could enter. The Gospels say otherwise. Forty days after Jesus' birth, the old man Simeon blessed them and then turned to Mary with a hard word: a sword will pierce through your own soul. The holiest family in history began its life together carrying a sorrow that had been announced in advance and could not be avoided, only lived through with God.",
          "Years later, when Jesus was twelve, Mary and Joseph lost track of him for three days — and any parent knows what three days of searching does to a heart. Mary's words when they found him are strikingly honest: your father and I were anxiously looking for you. The Church holds Mary to be full of grace, and yet Scripture records her anxiety without any embarrassment. Feeling fear for someone you love is not a failure of faith; it is what love feels like when it cannot see.",
          "This matters for anyone who carries wounds from family life, or who lies awake over a child, a parent, a sibling, or a marriage. The Holy Family is not a rebuke to your complicated household; it is a companion inside it. Jesus, Mary, and Joseph knew displacement, poverty, misunderstanding, searching, and grief — Joseph, tradition holds, died before Jesus' public ministry, leaving a widow and a son who mourned him. There is no sorrow in your family that this family would look at without recognition.",
          "Underneath all of it stands the psalm's promise: the Lord is near to those who have a broken heart, and saves those who have a crushed spirit. Near — not watching from a distance, not waiting until you compose yourself. Grief and anxiety do not disqualify a home from God's presence; they are often the very rooms where he chooses to sit down. You may bring your family to him exactly as it is, swords and searching and all.",
        ],
        prayer: "Jesus, Mary, and Joseph, stay with every home that is hurting tonight.",
        closingPrayer: "Jesus, Mary, and Joseph, holy family and sorrowing family, you knew the sword that was foretold, the three days of anxious searching, and the grief of a household that death visited. I bring you my own family — the wounds we have given and received, the ones I am afraid for, the empty places at our table. Do not let me believe the lie that pain means God has left the house. Draw near to us as the Lord is near to the brokenhearted, and save what is crushed in us. Keep us close to you until every sword is finally turned to peace. Amen.",
        quiz: [
          { q: "In Luke 2:35, what does Simeon tell Mary will pierce through her own soul?", options: ["A thorn", "A spear", "A flame", "A sword"], answer: 3 },
          { q: "In Luke 2:48, how does Mary describe the search for the twelve-year-old Jesus?", options: ["Your father and I were anxiously looking for you", "We knew where you were all along", "We waited calmly at home", "We sent servants to find you"], answer: 0 },
          { q: "According to Psalm 34:18, to whom is Yahweh near?", options: ["Those who have earned his favor", "Those who have a broken heart", "Those who hide their sorrow", "Those who never doubt"], answer: 1 },
          { q: "What does the teaching say about Mary's anxiety in Luke 2:48?", options: ["It shows she lacked faith", "Scripture omits it out of respect", "Feeling fear for someone you love is not a failure of faith", "It was corrected by Joseph"], answer: 2 },
        ],
      },
      {
        n: 4,
        title: "Set in a Family",
        scriptures: [
          {
            ref: "Psalm 68:5-6",
            text: "A father of the fatherless, and a defender of the widows, is God in his holy habitation. God sets the lonely in families. He brings out the prisoners with singing, but the rebellious dwell in a sun-scorched land.",
            context: "The psalm names God by what he does for the unprotected: father of the fatherless, defender of widows, the one who sets the lonely in families. If February's devotion stirred grief over the family you lost or never had, this verse is God's answer — belonging is something he actively gives.",
          },
          {
            ref: "Mark 3:34-35",
            text: "Looking around at those who sat around him, he said, 'Behold, my mother and my brothers! For whoever does the will of God, the same is my brother, and my sister, and mother.'",
            context: "Jesus looks at the circle of ordinary people around him and calls them his family. He is not dismissing Mary, who did God's will more perfectly than anyone, but throwing the doors of his household open to whoever will walk in.",
          },
          {
            ref: "Ephesians 2:19",
            text: "So then you are no longer strangers and foreigners, but you are fellow citizens with the saints, and of the household of God,",
            context: "Paul tells people who once stood entirely outside that they are now members of the household of God. The month of the Holy Family ends here: the family of Nazareth has become a home with your name on the door.",
          },
        ],
        teaching: [
          "Not everyone reaches the end of a month about the Holy Family with warm memories stirred. For some, the word family means absence, loss, or harm. Psalm 68 seems written for exactly those readers: God names himself a father of the fatherless and a defender of widows, and then comes one of the most tender lines in the psalter — God sets the lonely in families. Belonging, in Scripture, is not a lucky inheritance some receive and others simply lack; it is something God actively gives.",
          "Jesus made that concrete in a crowded room. Looking at the ordinary, imperfect people gathered around him, he said: behold, my mother and my brothers — whoever does the will of God is my brother, and sister, and mother. He was not diminishing Mary, who did the Father's will more completely than any creature; he was revealing that the family of Nazareth was never meant to stay three members large. The Holy Family is the seed of a household that has been growing for two thousand years.",
          "Saint Paul tells converts who had spent their whole lives as outsiders: you are no longer strangers and foreigners, but fellow citizens with the saints, and of the household of God. In the Church — in the parish down the road, in the communion of saints, in companions who walk with you through recovery — that household takes on faces and names. Isolation is one of the oldest tools of despair and addiction alike, and God's answer to it is not merely comfort but kinship.",
          "None of this erases what a wounded family history cost you, and joining God's household does not require pretending the past was fine. Grace does not rewrite the record; it writes a longer story. The same psalm that sets the lonely in families says God brings out the prisoners with singing — and many have found that walking out of an old bondage goes easier in company. Jesus, Mary, and Joseph are not a picture on a wall; they are kin who wait for you at the door.",
        ],
        prayer: "Jesus, Mary, and Joseph, count me among your own.",
        closingPrayer: "Father of the fatherless and defender of the widow, you see every way I have been lonely, and you are the God who sets the lonely in families. Thank you for the household of Nazareth, and for opening it wider than three, until there was room in it for me. Where family has wounded me, heal me; where I have wounded my family, forgive me and help me mend what can be mended. Set me among brothers and sisters who will walk with me, and make me a brother or sister worth walking beside. Jesus, Mary, and Joseph, I give you my heart and my soul, now and at the last. Amen.",
        quiz: [
          { q: "According to Psalm 68:6, what does God do for the lonely?", options: ["He sets them in families", "He teaches them to enjoy solitude", "He hides them away", "He tests them with silence"], answer: 0 },
          { q: "In Mark 3:35, who does Jesus say is his brother, sister, and mother?", options: ["Only his relatives from Nazareth", "The twelve apostles alone", "Whoever does the will of God", "The scribes who questioned him"], answer: 2 },
          { q: "In Ephesians 2:19, believers are no longer strangers and foreigners but members of what?", options: ["The court of the temple", "The synagogue of Jerusalem", "The house of Caesar", "The household of God"], answer: 3 },
          { q: "What does the teaching say joining God's household requires regarding a painful family past?", options: ["Pretending the past was fine", "It does not require pretending the past was fine; grace writes a longer story", "Cutting off all former relationships", "Forgetting the past entirely before belonging"], answer: 1 },
        ],
      },
    ],
  },
  {
    month: 3,
    title: "St. Joseph",
    monthLabel: "March — St. Joseph",
    scriptureRef: "Matthew 1:20 (World English Bible)",
    scriptureText: "Joseph, son of David, don't be afraid to take to yourself Mary as your wife.",
    teaching: "When responsibility feels crushing and anxiety keeps you awake, remember Joseph, who was handed an impossible situation and simply trusted. He did not have all the answers, yet he acted in quiet faith one step at a time. As patron of providers and of a peaceful death, he reminds you that God provides even when the road ahead is unclear.",
    prayerLabel: "A prayer to St. Joseph",
    prayer: "St. Joseph, foster father of Jesus and true spouse of Mary, pray for us.",
    novenaId: "st-joseph",
    quiz: [
      { q: "In March, the Church especially honors…", options: ["The Blessed Virgin Mary", "The Sacred Heart of Jesus", "St. Joseph", "The Holy Family"], answer: 2 },
      { q: "In Matthew 1:20, the angel addresses Joseph as son of whom?", options: ["Abraham", "David", "Jacob", "Isaac"], answer: 1 },
      { q: "What does the angel tell Joseph not to be afraid to do?", options: ["To flee to Egypt", "To take Mary as his wife", "To return to Nazareth", "To speak to the priests"], answer: 1 },
      { q: "How does the teaching describe Joseph's response to an overwhelming situation?", options: ["He demanded certainty first", "He acted in quiet trust one step at a time", "He refused the responsibility", "He waited passively for a sign"], answer: 1 },
    ],
    sessions: [
      {
        n: 1,
        title: "A Just Man in the Dark",
        scriptures: [
          {
            ref: "Matthew 1:19",
            text: "Joseph, her husband, being a righteous man, and not willing to make her a public example, intended to put her away secretly.",
            context: "Before the angel ever spoke, Joseph faced a situation he could not understand with facts that seemed to allow no good outcome. Scripture calls him righteous precisely here — and his righteousness showed itself as a refusal to shame the person he could not yet explain.",
          },
          {
            ref: "Matthew 1:20",
            text: "But when he thought about these things, behold, an angel of the Lord appeared to him in a dream, saying, Joseph, son of David, don't be afraid to take to yourself Mary, your wife, for that which is conceived in her is of the Holy Spirit.",
            context: "This is March's headline verse: God meets Joseph inside his fear and addresses it directly — don't be afraid. The reassurance comes while Joseph is still turning the problem over in the dark, not after he has figured everything out.",
          },
          {
            ref: "Matthew 1:24",
            text: "Joseph arose from his sleep, and did as the angel of the Lord commanded him, and took his wife to himself;",
            context: "Joseph's answer to heaven is not a recorded speech but a recorded action: he arose and did. The whole devotion to St. Joseph rests on this pattern — quiet, prompt obedience from a man the Gospels never quote.",
          },
        ],
        teaching: [
          "The Gospel introduces Joseph at the worst moment of his life. The woman he loved was expecting a child he knew was not his, and every explanation available to him was heartbreaking. Matthew calls him a righteous man in that very sentence — and notice what his righteousness looked like: not willing to make her a public example, he resolved to end things quietly. Before Joseph knew any of God's plan, he had already decided that whatever happened, Mary would not be shamed.",
          "Then, while he thought about these things, the angel came — in a dream, in the dark, in the middle of the turmoil. The first words are the ones March keeps returning to: Joseph, son of David, don't be afraid. God did not wait for Joseph to reason his way to peace before speaking; He met him inside the fear. That is worth holding onto if anxiety keeps you awake turning over a situation you cannot solve: the dark hours are not out of God's reach, and He has a habit of arriving in them.",
          "Notice also that the angel did not hand Joseph the whole future. He was given one instruction — take Mary as your wife — and enough truth to take that one step. Joseph woke up still without answers to a hundred reasonable questions, and Scripture records his response in five plain words: he did as the angel commanded. The Gospels never preserve a single sentence Joseph spoke; his whole recorded life is obedience in action.",
          "The Church honors Joseph in March as a model for everyone carrying responsibility that feels too heavy and questions that have no quick answers. Faith, in Joseph's style, is not the absence of fear or the possession of certainty; it is doing the next right thing with the light you have been given. Recovery often works the same way — not the whole road at once, but one honest step, taken today, in trust. You do not need the full map to rise in the morning and begin.",
        ],
        prayer: "St. Joseph, foster father of Jesus and true spouse of Mary, pray for us.",
        closingPrayer: "St. Joseph, just man of Nazareth, you know what it is to lie awake in the dark with a problem too big for you and no answer in sight. Ask for me the grace that was given to you: to hear God say 'do not be afraid' inside the fear itself, and to rise and do the one thing I can see to do today. Teach me your kindness, which refused to shame another even before understanding came, and your silence, which trusted more than it spoke. Good St. Joseph, take my anxieties to Jesus, whom you carried in your own arms. Amen.",
        quiz: [
          { q: "In Matthew 1:19, how did Joseph's righteousness first show itself?", options: ["He demanded a public explanation", "He was not willing to make Mary a public example", "He appealed to the priests for judgment", "He left Nazareth immediately"], answer: 1 },
          { q: "In Matthew 1:20, when did the angel appear to Joseph?", options: ["While he was working in the shop", "After he had made peace with the situation", "While he thought about these things, in a dream", "At the temple during a feast"], answer: 2 },
          { q: "How does the angel address Joseph in Matthew 1:20?", options: ["Son of David", "Son of Abraham", "Servant of the Most High", "Carpenter of Nazareth"], answer: 0 },
          { q: "According to the teaching, what is faith 'in Joseph's style'?", options: ["The absence of all fear", "Possessing certainty before acting", "Waiting until the whole road is visible", "Doing the next right thing with the light you have been given"], answer: 3 },
        ],
      },
      {
        n: 2,
        title: "He Arose by Night",
        scriptures: [
          {
            ref: "Matthew 2:13-14",
            text: "Now when they had departed, behold, an angel of the Lord appeared to Joseph in a dream, saying, 'Arise and take the young child and his mother, and flee into Egypt, and stay there until I tell you, for Herod will seek the young child to destroy him.' He arose and took the young child and his mother by night, and departed into Egypt,",
            context: "Warned in the night, Joseph does not wait for morning: he rises and carries his family to safety in the dark. March honors him as protector because protection was his daily work — decisive, unglamorous, and immediate.",
          },
          {
            ref: "Matthew 2:19-21",
            text: "But when Herod was dead, behold, an angel of the Lord appeared in a dream to Joseph in Egypt, saying, 'Arise and take the young child and his mother, and go into the land of Israel, for those who sought the young child's life are dead.' He arose and took the young child and his mother, and came into the land of Israel.",
            context: "The word Joseph was given in Egypt was 'stay there until I tell you' — an open-ended wait in a foreign land with no schedule attached. When the word to return finally came, he obeyed as promptly as he had fled, having kept faith through the whole unmeasured middle.",
          },
          {
            ref: "Psalm 121:3-4",
            text: "He will not allow your foot to be moved. He who keeps you will not slumber. Behold, he who keeps Israel will neither slumber nor sleep.",
            context: "The psalm promises a Keeper who never sleeps, watching even when we cannot. Joseph, who rose by night to guard the child, is a human echo of that watchfulness — and a reminder that when your strength runs out, God's watch does not.",
          },
        ],
        teaching: [
          "Twice more the angel comes to Joseph, and both times the message begins the same way: arise. Herod is hunting the child, so Joseph rises that very night, takes the young child and his mother, and walks his family into a foreign country with whatever they could carry. There is no recorded hesitation and no recorded complaint. The Church calls Joseph the protector of the Holy Family — and of the whole Church — because protecting is simply what he did, promptly and without drama, every time it was asked of him.",
          "Look closely at the instruction he received: stay there until I tell you. No date, no duration, no explanation of how they would live in Egypt in the meantime. Joseph had to keep his family fed and safe through a wait whose length only God knew. Many hard seasons have exactly this shape — an exile with no posted end date, whether it is early recovery, a long treatment, unemployment, or waiting on a broken relationship. Joseph's witness is that such seasons can be lived faithfully one day at a time, provided for by a God whose silence is not absence.",
          "When the word finally came that it was safe, Joseph rose and returned as readily as he had fled. His obedience worked in both directions — into the hardship and out of it — because it was anchored not in his ability to predict events but in the One who spoke. That is a freedom worth wanting: to be able to move when God says move and stay when God says stay, without needing to control the calendar.",
          "Psalm 121 explains where such steadiness ultimately rests: he who keeps you will not slumber. Joseph rose by night because the Keeper of Israel had been watching while he slept. Every parent, caregiver, and provider eventually meets the limit of their own vigilance — you cannot stay awake over everyone you love forever. The comfort of this psalm, and of Joseph's whole life, is that your watch is held inside a greater one that never blinks.",
        ],
        prayer: "St. Joseph, guardian of the Redeemer, watch over those I love.",
        closingPrayer: "St. Joseph, protector of the Holy Family, you rose in the night and carried Jesus and Mary to safety, and you kept them through a long exile with no end date given to you. I bring you the people I am trying to protect and provide for, and the fears that stand watch with me through the night. Ask the Lord to teach me your readiness — to move when he says move, to stay when he says stay, and to trust his providing through the unmeasured middle. And when my vigilance runs out, remind me that he who keeps us neither slumbers nor sleeps. Amen.",
        quiz: [
          { q: "In Matthew 2:13-14, when did Joseph depart for Egypt after the angel's warning?", options: ["He arose and left by night", "After Herod's soldiers arrived", "The following week", "After consulting the elders"], answer: 0 },
          { q: "How long was Joseph told to stay in Egypt?", options: ["Forty days", "Until the child was grown", "Until I tell you — no end date was given", "Three years"], answer: 2 },
          { q: "According to Psalm 121:3-4, what does he who keeps Israel never do?", options: ["Speak in dreams", "Slumber nor sleep", "Allow any hardship", "Leave the holy land"], answer: 1 },
          { q: "What does the teaching say about seasons with 'no posted end date'?", options: ["They are signs of God's absence", "They should be escaped as fast as possible", "They only happen to the unfaithful", "They can be lived faithfully one day at a time, provided for by God"], answer: 3 },
        ],
      },
      {
        n: 3,
        title: "The Carpenter's House",
        scriptures: [
          {
            ref: "Matthew 13:55",
            text: "Isn't this the carpenter's son? Isn't his mother called Mary, and his brothers, James, Joses, Simon, and Judas?",
            context: "When Jesus' hometown wants to dismiss him, they reach for Joseph's trade: the carpenter's son. Joseph was so thoroughly a working man that his workbench became his identity — and the Son of God was known for years by the trade Joseph taught him.",
          },
          {
            ref: "Colossians 3:23",
            text: "And whatever you do, work heartily, as for the Lord, and not for men,",
            context: "Paul lifts ordinary labor into worship: work done heartily is done for the Lord himself. This was the hidden liturgy of the workshop at Nazareth, where the day's honest tasks were offered to God long before any sermon was preached.",
          },
          {
            ref: "Psalm 90:17",
            text: "Let the favor of the Lord our God be on us; establish the work of our hands for us; yes, establish the work of our hands.",
            context: "The psalm asks God to give lasting worth to what our hands make, since nothing we build stands without him. It is a fitting prayer for March, the month of the saint whose hands built, repaired, provided, and held the child Jesus.",
          },
        ],
        teaching: [
          "When the people of Nazareth were offended by Jesus' wisdom, their dismissal tells us something precious: isn't this the carpenter's son? Joseph was so identified with his work that it became his name in the village, and Jesus was known by it too — Mark's Gospel even calls Jesus himself the carpenter. For years, the hands that would later be nailed to wood learned to measure, saw, and join it, taught by Joseph at a workbench in an unremarkable town. God did not consider a tradesman's house beneath him; he grew up in one.",
          "This is why the Church holds up Joseph as the patron of workers. Most of his sanctity was practiced not in visions, which were rare, but in decades of ordinary labor — fair dealing, finished jobs, a family fed. Saint Paul gives the principle that Joseph's workshop lived out: whatever you do, work heartily, as for the Lord, and not for men. Work offered that way stops being mere survival and becomes a quiet form of prayer.",
          "For many people rebuilding a life, ordinary work carries a healing weight: the structure of a schedule, the dignity of being useful, the honesty of a task completed. The tradition has long observed that steady, purposeful work supports the soul's recovery of order, though it is no cure-all and it must not become another place to hide. The goal is Joseph's balance — diligent hands, and a heart that knows its worth was settled before any work began. You are not valuable because you produce; you produce because you are already loved and have something to give.",
          "Psalm 90 gathers all of this into a workman's prayer: establish the work of our hands. We ask God to give our labor a permanence we cannot give it ourselves, because buildings fall and projects fade, but what is offered to God is kept by God. Joseph's greatest work was not made of wood at all; it was a Boy raised, a wife cherished, a family held together. If you can only manage small, faithful work right now, remember whose childhood was built out of exactly that.",
        ],
        prayer: "St. Joseph the Worker, teach my hands to serve and my heart to rest.",
        closingPrayer: "Lord Jesus, you were known in Nazareth as the carpenter's son, and you learned your trade from Joseph's patient hands. Bless the work in front of me — the job I go to, the tasks I would rather avoid, the slow daily labor of rebuilding my life. Teach me to work heartily as for you and not for men, without making my work the measure of my worth, since you settled my worth long before I produced anything. With St. Joseph the Worker interceding for me, establish the work of my hands, and keep my heart at rest in yours. Amen.",
        quiz: [
          { q: "In Matthew 13:55, how do the people of Nazareth identify Jesus?", options: ["The rabbi's student", "The shepherd's boy", "The carpenter's son", "The fisherman's nephew"], answer: 2 },
          { q: "According to Colossians 3:23, how and for whom should we work?", options: ["Heartily, as for the Lord, and not for men", "Quickly, to please the master", "Sparingly, to preserve strength", "Publicly, to be seen and praised"], answer: 0 },
          { q: "What does Psalm 90:17 ask God to do?", options: ["Multiply our riches", "Remove all labor from us", "Judge the work of our enemies", "Establish the work of our hands"], answer: 3 },
          { q: "What balance does the teaching draw about work and worth?", options: ["Worth is earned through steady production", "You are already loved; you produce because you have something to give, not to become valuable", "Work should be avoided during recovery", "Only religious work counts as prayer"], answer: 1 },
        ],
      },
      {
        n: 4,
        title: "The Provider's Trust",
        scriptures: [
          {
            ref: "Matthew 6:31-33",
            text: "Therefore don't be anxious, saying, 'What will we eat?', 'What will we drink?' or, 'With what will we be clothed?' For the Gentiles seek after all these things; for your heavenly Father knows that you need all these things. But seek first God's Kingdom, and his righteousness; and all these things will be given to you as well.",
            context: "Jesus names the exact worries that keep providers awake — food, drink, clothing — and answers them with a Father who already knows. These are words Jesus grew up watching Joseph live: seek first the Kingdom, and trust the rest to God's knowledge of your need.",
          },
          {
            ref: "Philippians 4:6-7",
            text: "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.",
            context: "Paul does not say anxious thoughts never come; he says bring every one of them to God, with thanks attached. The promised result is not a solved calendar but a guarded heart — peace standing sentry where worry used to pace.",
          },
          {
            ref: "Psalm 127:1-2",
            text: "Unless Yahweh builds the house, they labor in vain who build it. Unless Yahweh watches over the city, the watchman guards it in vain. It is vain for you to rise up early, to stay up late, eating the bread of toil; for he gives sleep to his loved ones.",
            context: "The psalm gently dismantles the provider's illusion that everything depends on staying up worrying: unless Yahweh builds the house, the builders labor in vain. Its tenderest line touches the sleepless directly — God gives sleep to his loved ones, and Joseph the builder slept soundly enough for angels to reach him.",
          },
        ],
        teaching: [
          "Jesus' teaching on providence in the Sermon on the Mount was not composed in a palace. He spoke as a man who had been raised by a provider — who had watched Joseph face lean months, tax demands, an exile, and a move, and keep trusting. Don't be anxious about what you will eat or drink or wear, Jesus says, for your heavenly Father knows that you need all these things. The remedy for the provider's fear is not pretending needs are small; it is remembering that the Father's knowledge of them is complete.",
          "Seek first God's Kingdom, and his righteousness, and all these things will be given to you as well. This is an ordering of loves, not a business arrangement; it does not promise wealth, and faithful people still know real hardship. What it promises is a Father who does not forget his children while they are busy about his will. Joseph is the Church's picture of this: a man who put God's instructions first every time, and whose family — through flight, exile, and poverty — was never abandoned.",
          "Saint Paul gives the anxious heart something to do: in nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. Notice he assumes the worries will come; the instruction is about where to carry them. And the promise that follows is precise — not that every problem resolves, but that the peace of God will guard your hearts and your thoughts, like a sentry posted at the door where panic used to walk in freely.",
          "Psalm 127 speaks to the provider's deepest temptation, the belief that everything will collapse unless we hold it up by worrying: unless Yahweh builds the house, they labor in vain who build it, and it is vain to rise up early and stay up late eating the bread of toil, for he gives sleep to his loved ones. Joseph, the builder and the dreamer, embodied both halves — diligent by day, and trusting enough to sleep, which is where God met him. The Church also calls Joseph the patron of a peaceful death, because a life of entrusting each day to God ripens into the grace of entrusting the last one. Ask him this month for a provider's diligence, and a beloved's sleep.",
        ],
        prayer: "St. Joseph, provider for the Holy Family, pray for us who carry much.",
        closingPrayer: "Heavenly Father, you know the needs I carry before I name them — the bills, the people depending on me, the nights when worry rises earlier than the sun. You fed and kept the Holy Family through the hands of St. Joseph, a working man who sought your Kingdom first and trusted you with the rest. Give me his diligence without his burdens becoming my god, and let your peace stand guard over my heart and my thoughts in Christ Jesus. Build my house, Lord, so that my labor is not in vain, and give your beloved sleep. St. Joseph, provider and patron of a peaceful death, walk with me to the end. Amen.",
        quiz: [
          { q: "In Matthew 6:32, why does Jesus say we need not be anxious about food, drink, and clothing?", options: ["Because these needs are unimportant", "Because worry speeds their arrival", "Because your heavenly Father knows that you need all these things", "Because the Gentiles will provide them"], answer: 2 },
          { q: "According to Philippians 4:6-7, what will the peace of God do?", options: ["Guard your hearts and your thoughts in Christ Jesus", "Remove every difficulty from your path", "Guarantee answers within days", "Replace the need for petition"], answer: 0 },
          { q: "According to Psalm 127:1, what happens if Yahweh does not build the house?", options: ["The house is built more slowly", "Those who build it labor in vain", "The builders must hire watchmen", "The house stands by human skill"], answer: 1 },
          { q: "What does the teaching say Philippians 4:6-7 actually promises?", options: ["That every problem will resolve quickly", "That the anxious will never worry again", "That providers will grow wealthy", "Not that every problem resolves, but that God's peace will guard heart and thoughts"], answer: 3 },
        ],
      },
    ],
  },
  {
    month: 4,
    title: "The Holy Eucharist",
    monthLabel: "April — The Blessed Sacrament",
    scriptureRef: "John 6:35 (World English Bible)",
    scriptureText: "I am the bread of life. Whoever comes to me will not be hungry.",
    teaching: "When you feel empty or hopeless, the answer to that deep spiritual hunger is not to perform better but simply to come. Jesus offers himself as the bread of life, real presence rather than another demand you must meet. In this Easter season of mercy, you are invited to approach and receive exactly as you are.",
    prayerLabel: "A Eucharistic aspiration",
    prayer: "O Sacrament most Holy, O Sacrament Divine, all praise and all thanksgiving be every moment Thine.",
    novenaId: "divine-mercy",
    quiz: [
      { q: "In April, the Church especially honors…", options: ["The Holy Eucharist", "St. Joseph", "The Holy Name of Jesus", "The Holy Family"], answer: 0 },
      { q: "In John 6:35, Jesus calls himself the…", options: ["Light of the world", "Bread of life", "Good shepherd", "True vine"], answer: 1 },
      { q: "According to the verse, what happens to the one who comes to Jesus?", options: ["He shall not hunger", "He shall be tested", "He shall wait in darkness", "He shall earn his reward"], answer: 0 },
      { q: "What does the teaching say is the response to spiritual emptiness?", options: ["To perform better and earn worthiness", "To come and receive, presence not performance", "To wait until you feel deserving", "To rely only on your own strength"], answer: 1 },
    ],
    sessions: [
      {
        n: 1,
        title: "Bread from Heaven",
        scriptures: [
          {
            ref: "Exodus 16:4",
            text: "Then Yahweh said to Moses, Behold, I will rain bread from the sky for you, and the people shall go out and gather a day's portion every day, that I may test them, whether they will walk in my law, or not.",
            context: "In the wilderness God fed a complaining, frightened people with bread they did not bake and could not earn, one day's portion at a time. April's devotion to the Blessed Sacrament begins here, because the manna was a rehearsal for a greater bread from heaven.",
          },
          {
            ref: "Psalm 78:24-25",
            text: "He rained down manna on them to eat, and gave them food from the sky. Man ate the bread of angels. He sent them food to the full.",
            context: "The psalmist looks back on the manna with wonder: ordinary people ate the bread of angels, sent to the full from God's own hand. The Church hears in this line a whisper of the Eucharist, where God feeds His people with something greater still.",
          },
          {
            ref: "John 6:32-33",
            text: "Jesus therefore said to them, 'Most certainly, I tell you, it wasn't Moses who gave you the bread out of heaven, but my Father gives you the true bread out of heaven. For the bread of God is that which comes down out of heaven, and gives life to the world.'",
            context: "Jesus tells the crowd that the manna was never the point: the Father gives the true bread out of heaven now, in the present tense. The bread of God is not a thing but a Person, come down to give life to the world.",
          },
        ],
        teaching: [
          "When Israel was hungry in the wilderness, God did not send instructions for finding food; He rained bread from the sky. The manna came with one unusual rule: gather a day's portion every day, and no more. God was teaching a people fresh out of slavery that they could trust Him for tomorrow because He had fed them today. Dependence, not stockpiling, was the lesson of the manna.",
          "The psalms never got over this. Psalm 78 remembers the manna with astonishment: man ate the bread of angels, food sent to the full from God's own hand, and sent to people who had done little but complain. That detail matters for anyone who feels they must earn God's care before receiving it. The manna fell on the grumblers; God's feeding of His people has never waited for them to deserve it.",
          "Centuries later a crowd asked Jesus for bread like the manna, and He answered that the manna had only been the rehearsal. It was not Moses who gave you the bread out of heaven, He said, but my Father gives you the true bread — present tense, here and now. The bread of God is not a thing but a Person, the One who comes down from heaven and gives life to the world. The Church devotes April, in the heart of the Easter season, to this Blessed Sacrament.",
          "If you are carrying a hunger that nothing has filled — and many who struggle with addiction, anxiety, or despair know that hunger well — the manna offers a gentle first lesson. God provides for today, today. You are not asked to secure next year's strength tonight, only to receive this day's portion: this day's mercy, this day's help, this day's bread. Tomorrow's portion will fall tomorrow.",
        ],
        prayer: "O Sacrament most Holy, O Sacrament Divine, all praise and all thanksgiving be every moment Thine.",
        closingPrayer: "Father in heaven, You rained bread from the sky on a people who could do nothing to earn it, and You taught them to gather only a day's portion at a time. Teach me that same trust: not grace stockpiled for a lifetime, but Your help received fresh each morning. When I am anxious about every tomorrow at once, remind me that the manna was always enough, and always new. Prepare my heart, in this month of the Blessed Sacrament, to receive the true Bread that comes down from heaven and gives life to the world. Amen.",
        quiz: [
          { q: "In Exodus 16:4, how much manna were the people told to gather each day?", options: ["Enough for the whole week", "A day's portion every day", "As much as they could carry", "A double portion every day"], answer: 1 },
          { q: "What does Psalm 78:25 call the manna?", options: ["The bread of sorrow", "The bread of the strong", "The bread of angels", "The bread of the earth"], answer: 2 },
          { q: "In John 6:32-33, who gives the true bread out of heaven?", options: ["The Father", "Moses", "The prophets", "The crowd"], answer: 0 },
          { q: "According to the teaching, what was the lesson of gathering manna one day at a time?", options: ["That food must be hidden away", "That the people deserved their hunger", "That God feeds only the obedient", "To depend on God for today rather than stockpiling strength for every tomorrow"], answer: 3 },
        ],
      },
      {
        n: 2,
        title: "I Am the Bread of Life",
        scriptures: [
          {
            ref: "John 6:35",
            text: "Jesus said to them, I am the bread of life. He who comes to me will not be hungry, and he who believes in me will never be thirsty.",
            context: "This is April's headline verse: Jesus does not merely offer bread, He says that He is it. The deepest hunger and thirst of the heart are answered not by performing better but by coming to Him.",
          },
          {
            ref: "John 6:51",
            text: "I am the living bread which came down out of heaven. If anyone eats of this bread, he will live forever. Yes, the bread which I will give for the life of the world is my flesh.",
            context: "Jesus presses the promise to its costly depth: the living bread is His own flesh, given for the life of the world. In the Blessed Sacrament, the gift of Calvary becomes food for people too tired to walk on their own.",
          },
          {
            ref: "John 6:68",
            text: "Simon Peter answered him, Lord, to whom would we go? You have the words of eternal life.",
            context: "When this teaching proved hard, many disciples left, and Jesus asked the Twelve if they would go too. Peter's answer is the prayer of everyone who has run out of other options: to whom else would we go?",
          },
        ],
        teaching: [
          "Jesus makes a claim no mere teacher could make: I am the bread of life. He does not say He will explain where the bread is, or set out conditions for earning it; He says that He Himself is the food the human heart is starving for. The hunger and thirst He names are the deep kind — the ache of emptiness that we try to quiet with a hundred things that cannot hold it.",
          "Then He presses further, past the point of comfort: the bread that I will give for the life of the world is my flesh. The Catholic Church has always taken these words at their word. In the Eucharist, the gift of Calvary becomes food; the Lord who gave Himself for us gives Himself to us. This is why the Blessed Sacrament is not a symbol to admire from a distance but a Presence to receive.",
          "The Gospel is honest about what happened next: many of His disciples found the teaching too hard and walked away, and Jesus let them go rather than soften a word of it. Then He turned to the Twelve and asked if they would leave too. Peter's reply is one of the most human prayers in Scripture: Lord, to whom would we go? You have the words of eternal life. It is the prayer of a man who has run out of alternatives and found that this was not a defeat but a doorway.",
          "Perhaps you come to this month's devotion the same way — not triumphant, just out of other options. That is an honorable way to arrive. The Bread of Life is not a prize for the strong but food for the weak, what an ancient Christian writer called the medicine of immortality. Receiving it does not remove every struggle overnight, and it never replaces the honest work of recovery or the help of others; but it feeds a part of you that nothing else can reach.",
        ],
        prayer: "Jesus, Bread of Life, come to me and feed my hungry soul.",
        closingPrayer: "Lord Jesus, Bread of Life, You know the hunger underneath my hungers, the ache I have tried to fill in so many ways that could not hold it. You do not ask me to perform better before I come; You ask me simply to come. When Your teaching is hard and part of me wants to walk away, give me Peter's honesty: Lord, to whom would I go? You have the words of eternal life. Feed me with Yourself in the Blessed Sacrament, and let that food do quietly in me what nothing else has done. Amen.",
        quiz: [
          { q: "In John 6:35, what does Jesus promise to the one who comes to him?", options: ["He will never be tested", "He will receive earthly plenty", "He will not be hungry", "He will see signs and wonders"], answer: 2 },
          { q: "In John 6:51, what does Jesus say the living bread is?", options: ["His flesh, given for the life of the world", "The manna of Moses", "A parable about faith", "The bread of the Passover only"], answer: 0 },
          { q: "How did many disciples respond to this hard teaching, according to the session?", options: ["They asked for more bread", "They wrote it down carefully", "They argued with Peter", "They walked away, and Jesus did not soften his words"], answer: 3 },
          { q: "What is Peter's answer in John 6:68?", options: ["'Show us a sign from heaven'", "'Lord, to whom would we go? You have the words of eternal life'", "'This teaching is too hard for us'", "'Let us return to Moses'"], answer: 1 },
        ],
      },
      {
        n: 3,
        title: "Do This in Memory of Me",
        scriptures: [
          {
            ref: "Luke 22:19-20",
            text: "He took bread, and when he had given thanks, he broke, and gave it to them, saying, 'This is my body which is given for you. Do this in memory of me.' Likewise, he took the cup after supper, saying, This cup is the new covenant in my blood, which is poured out for you.",
            context: "On the night of His betrayal, Jesus placed His own Body and Blood into the hands of friends He knew would fail Him. The Eucharist was instituted in the middle of human weakness, which is why weakness has never disqualified anyone from it.",
          },
          {
            ref: "1 Corinthians 11:26",
            text: "For as often as you eat this bread and drink this cup, you proclaim the Lord's death until he comes.",
            context: "Paul says every Eucharist proclaims the Lord's death until He comes — the past gift and the future hope held together in one cup. The Mass is where a wounded present is set between those two certainties.",
          },
          {
            ref: "Luke 24:30-31",
            text: "When he had sat down at the table with them, he took the bread and gave thanks. Breaking it, he gave it to them. Their eyes were opened, and they recognized him, and he vanished out of their sight.",
            context: "The grieving disciples at Emmaus could not recognize the risen Jesus until He took bread, gave thanks, and broke it. Ever since, the Church has known Him in the breaking of the bread, even when feelings insist He is absent.",
          },
        ],
        teaching: [
          "Saint Luke sets the scene with terrible tenderness: on the night He was betrayed, Jesus took bread, gave thanks, broke it, and said, this is my body which is given for you. He knew Judas had already sold Him and that Peter would deny Him before morning. Knowing all of it, He did not withdraw from His weak friends; He gave them the greatest gift He had. The Eucharist was born in the middle of human failure, which means your failures do not disqualify you from it.",
          "Do this in memory of me, He said, and the Church has obeyed ever since. Saint Paul told the Corinthians that as often as we eat this bread and drink this cup, we proclaim the Lord's death until He comes. In Catholic understanding this memorial is not mere remembering, the way we recall a distant event; the Mass makes the one sacrifice of the Cross present to us, so that its grace can touch this day's wounds.",
          "The Emmaus story shows what that presence can do with grief. Two disciples walked away from Jerusalem with their hopes buried, so heavy-hearted that they did not recognize the risen Jesus walking beside them. Only at table, when He took the bread, gave thanks, and broke it, were their eyes opened. Sorrow can blind us to a companionship that has been there the whole road.",
          "This is a quiet encouragement for anyone who prays and feels nothing, or sits at Mass numb with grief or depression and wonders whether God has left. The disciples' feelings told them Jesus was dead; the breaking of the bread told them the truth. Feelings are real and worth bringing honestly to God, but they are not the final word on His presence. He is known in the breaking of bread even on the days we cannot sense Him — especially then.",
        ],
        prayer: "Blessed, praised, and adored be Jesus Christ in the most Holy Sacrament of the altar.",
        closingPrayer: "Lord Jesus, on the night You were betrayed You did not withdraw from weak and frightened friends; You gave them Your own Body and Blood and told them to do this in memory of You. Meet me the way You met the two on the road to Emmaus, when grief had made them blind to You walking beside them. Stay with me when evening comes, take the bread, and open my eyes. Until You come again, let every Mass proclaim to my doubting heart that Your death was for me and Your life is with me. Amen.",
        quiz: [
          { q: "In Luke 22:19, what command does Jesus give after breaking the bread?", options: ["'Do this in memory of me'", "'Watch and pray'", "'Tell no one'", "'Go and make disciples'"], answer: 0 },
          { q: "In Luke 22:20, what does Jesus call the cup?", options: ["The cup of Elijah", "The cup of testing", "The sign of Jonah", "The new covenant in my blood"], answer: 3 },
          { q: "According to 1 Corinthians 11:26, what do we proclaim as often as we eat this bread and drink this cup?", options: ["The wisdom of the apostles", "The Lord's death until he comes", "The law of Moses", "Our own worthiness"], answer: 1 },
          { q: "In Luke 24:30-31, when did the disciples recognize the risen Jesus?", options: ["When he preached in the synagogue", "When he calmed the storm", "When he took bread, gave thanks, and broke it", "When he appeared in the temple"], answer: 2 },
        ],
      },
      {
        n: 4,
        title: "Taste and See",
        scriptures: [
          {
            ref: "Psalm 34:8",
            text: "Oh taste and see that Yahweh is good. Blessed is the man who takes refuge in him.",
            context: "The psalm invites experience rather than argument: taste and see that Yahweh is good. The Blessed Sacrament is where that invitation becomes literal, and where the one who takes refuge is called blessed.",
          },
          {
            ref: "Matthew 28:20",
            text: "teaching them to observe all things that I commanded you. Behold, I am with you always, even to the end of the age. Amen.",
            context: "Jesus' parting promise has no expiration date: I am with you always, even to the end of the age. Catholics find one fulfillment of these words in the tabernacle, where His Eucharistic presence remains near.",
          },
          {
            ref: "Revelation 3:20",
            text: "Behold, I stand at the door and knock. If anyone hears my voice and opens the door, then I will come in to him, and will dine with him, and he with me.",
            context: "The Lord of the Eucharist does not force the door; He stands, knocks, and waits to dine with whoever opens. Adoration is simply answering that knock and letting Him keep you company.",
          },
        ],
        teaching: [
          "Taste and see that Yahweh is good, sings Psalm 34 — an invitation not to master an argument but to have an experience. Some truths can only be learned the way food is learned: by receiving. The same psalm calls blessed the one who takes refuge in Him, and the Blessed Sacrament is exactly that kind of refuge, a shelter to rest in rather than a test to pass.",
          "Before ascending, Jesus made a promise with no expiration date: behold, I am with you always, even to the end of the age. Catholics have always found one fulfillment of those words in the tabernacle, where the Eucharistic Lord remains present in every Catholic church. This is the devotion of adoration: simply coming to sit, kneel, or rest in that Presence. Many restless and anxious hearts have found in that silence a steadiness they could not manufacture alone.",
          "Revelation gives the tenderest picture of how this Lord behaves: He stands at the door and knocks. He does not break the door down, and He does not leave; He waits for the sound of your voice and the turn of your hand. If anyone opens, He comes in — not to inspect the house, but to dine with them, friend with friend. Consent, not perfection, is what He waits for.",
          "You do not need eloquent words to keep company with the Blessed Sacrament; you do not, strictly, need words at all. Bring the restlessness, the craving, the grief, and simply stay a while — being present is itself prayer. Adoration is no substitute for the sacraments, for wise counsel, or for the daily work of getting well, but it is a place where that work can breathe. He has been waiting at the door longer than you have been afraid to open it.",
        ],
        prayer: "My Lord and my God!",
        closingPrayer: "Lord Jesus, hidden in the Blessed Sacrament, You stand at the door and knock, and You will not force Your way in. Here is my yes: come in and dine with me, though the house of my heart is not in order. Teach me to sit quietly in Your presence, tasting and seeing that You are good, saying nothing more eloquent than my Lord and my God. Stay with me always, even to the end of the age, and make Your nearness my refuge. Amen.",
        quiz: [
          { q: "Psalm 34:8 invites us to do what?", options: ["Sing and shout", "Fast and mourn", "Watch and wait", "Taste and see that Yahweh is good"], answer: 3 },
          { q: "In Matthew 28:20, how long does Jesus promise to be with us?", options: ["Until the apostles die", "Always, even to the end of the age", "Until the temple falls", "For forty days"], answer: 1 },
          { q: "In Revelation 3:20, what does Jesus do at the door?", options: ["He breaks it open", "He waits in silence and then leaves", "He stands and knocks, and comes in to dine if anyone opens", "He posts a guard outside"], answer: 2 },
          { q: "What does the teaching say about praying before the Blessed Sacrament?", options: ["No eloquent words are needed; simply being present is itself prayer", "Only long formal prayers count", "It is reserved for priests and religious", "It requires perfect concentration"], answer: 0 },
        ],
      },
    ],
  },
  {
    month: 5,
    title: "The Blessed Virgin Mary",
    monthLabel: "May — The Blessed Virgin Mary",
    scriptureRef: "Luke 1:38 (World English Bible)",
    scriptureText: "Behold, the servant of the Lord; let it be done to me according to your word.",
    teaching: "When you are trying to let go of control and cannot see how things will turn out, Mary shows you what surrender looks like. Her yes was spoken before she understood the whole path, trusting God with an unknown outcome. You can borrow her words when your own trust runs thin and place the future in gentler hands.",
    prayerLabel: "The Memorare (opening)",
    prayer: "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession, was left unaided.",
    novenaId: "undoer-of-knots",
    quiz: [
      { q: "In May, the Church especially honors…", options: ["The Sacred Heart of Jesus", "The Blessed Virgin Mary", "The Holy Eucharist", "St. Joseph"], answer: 1 },
      { q: "In Luke 1:38, how does Mary describe herself?", options: ["The mother of the King", "The handmaid of the Lord", "The daughter of David", "The servant of the temple"], answer: 1 },
      { q: "What does Mary ask in her response to the angel?", options: ["That she be spared the task", "That it be done to her according to God's word", "That she be given a sign", "That she return home first"], answer: 1 },
      { q: "Why is Mary's yes held up as a model of surrender?", options: ["She knew every detail of what would happen", "She trusted before she could see the outcome", "She acted only after full certainty", "She refused until conditions were met"], answer: 1 },
    ],
    sessions: [
      {
        n: 1,
        title: "The Woman Promised",
        scriptures: [
          {
            ref: "Genesis 3:15",
            text: "I will put hostility between you and the woman, and between your offspring and her offspring. He will bruise your head, and you will bruise his heel.",
            context: "In the very hour of the fall, before any word of consequence reaches Adam and Eve, God promises a woman whose offspring will crush the serpent's head. The Church has always seen Mary in this first flicker of hope: sin was never allowed the last word.",
          },
          {
            ref: "Luke 1:28",
            text: "Having come in, the angel said to her, 'Rejoice, you highly favored one! The Lord is with you. Blessed are you among women!'",
            context: "The angel's greeting names what grace had already done: Mary is the highly favored one, and the Lord is with her. May's devotion begins not with Mary's achievements but with God's initiative toward her.",
          },
          {
            ref: "Luke 1:30-31",
            text: "The angel said to her, Don't be afraid, Mary, for you have found favor with God. Behold, you will conceive in your womb, and give birth to a son, and will call his name 'Jesus.'",
            context: "The first thing heaven addresses is Mary's fear, and the remedy offered is a fact rather than a feeling: she has found favor with God. The promised son bears the name Jesus, which means Yahweh saves.",
          },
        ],
        teaching: [
          "The story of Mary begins not in Nazareth but in Eden, in the worst hour the human race has ever known. Before God speaks a single word of consequence to Adam and Eve, He makes a promise to the serpent's face: hostility between you and the woman, between your offspring and hers — and her offspring will bruise your head. The Church has long called this verse the first gospel, hope announced in the ruins. From the very beginning, sin was never allowed the last word.",
          "Centuries of waiting followed, and then an angel came into a small house in an unremarkable town. His greeting tells us what grace had already accomplished: rejoice, you highly favored one, the Lord is with you. Catholics believe Mary was prepared for her calling by a singular grace of God, won for her by her Son. May's devotion honors her not for what she achieved on her own, but for what God delighted to do in her.",
          "Notice what the angel addresses first: Mary's fear. Don't be afraid, Mary, for you have found favor with God. Heaven does not scold her for being troubled; it steadies her with a fact that does not depend on her feelings. Then comes the promise of a son whose name, Jesus, means Yahweh saves — the offspring of the woman, come at last to keep Eden's promise.",
          "If the opening chapters of your own story feel ruined — by what was done to you, or by what you have done — Genesis 3:15 is for you. God is the kind of author who writes the rescue into the wreckage itself, and He does not abandon a story He has promised to redeem. Fear may speak to you first, as it spoke first in Nazareth; let don't be afraid speak second, and louder. The God who kept His oldest promise through Mary can be trusted with the promises He is keeping in you.",
        ],
        prayer: "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women.",
        closingPrayer: "Father of mercies, in the very hour of the fall You promised a woman whose child would crush the serpent's head, and in the fullness of time You kept that promise through Mary. Thank You that my story, too, is never only its worst chapter. When fear speaks first, let Your word to Mary reach me as well: do not be afraid, you have found favor with God. Teach me this May to trust the God who writes rescue into ruined beginnings, and to welcome the Savior her yes brought into the world. Amen.",
        quiz: [
          { q: "In Genesis 3:15, what will the woman's offspring do to the serpent?", options: ["Flee from his head", "Make peace with him", "Bruise his head", "Build a wall against him"], answer: 2 },
          { q: "In Luke 1:28, how does the angel greet Mary?", options: ["'Rejoice, you highly favored one! The Lord is with you'", "'Hail, Queen of Heaven'", "'Blessed are you who mourn'", "'Fear not, daughter of David'"], answer: 0 },
          { q: "In Luke 1:30, what reason does the angel give Mary not to be afraid?", options: ["Joseph will protect her", "The people will honor her", "She will see no sorrow", "She has found favor with God"], answer: 3 },
          { q: "According to the teaching, when was the promise of Genesis 3:15 spoken?", options: ["After Israel entered the promised land", "In the very hour of the fall", "At the Annunciation", "During the exile"], answer: 1 },
        ],
      },
      {
        n: 2,
        title: "The Handmaid's Yes",
        scriptures: [
          {
            ref: "Luke 1:38",
            text: "Mary said, 'Behold, the servant of the Lord; let it be done to me according to your word.' The angel departed from her.",
            context: "This is May's headline verse: Mary's whole answer to an unimaginable request is trust — behold, the servant of the Lord. She says yes before she can see how any of it will turn out.",
          },
          {
            ref: "Luke 1:45",
            text: "Blessed is she who believed, for there will be a fulfillment of the things which have been spoken to her from the Lord!",
            context: "Elizabeth names the root of Mary's blessedness: she believed that what God spoke would be fulfilled. Faith here is not certainty about details but confidence in the One who promised.",
          },
          {
            ref: "Luke 1:46-48",
            text: "Mary said, My soul magnifies the Lord. My spirit has rejoiced in God my Savior, for he has looked at the humble state of his servant. For behold, from now on, all generations will call me blessed.",
            context: "Mary's yes blossoms into the Magnificat, the song of a soul that has handed itself over. She calls herself God's servant in a humble state, and finds there not humiliation but joy.",
          },
        ],
        teaching: [
          "Mary's answer to the angel is one sentence, and the Church has never stopped pondering it: behold, the servant of the Lord; let it be done to me according to your word. She was told the what — a son, conceived by the Holy Spirit — but almost nothing of the how, and nothing at all about Egypt, or the sword, or Calvary. Her yes was not signed after reading every page. That is what trust looks like when the outcome is hidden.",
          "It helps to be honest about what that yes could have cost her. An unexplained pregnancy in her town could mean disgrace and abandonment; Joseph himself needed an angel before he understood. Mary consented anyway, not because the risk was small but because the One asking was faithful. Surrender in the biblical sense is never passivity; it is the bravest form of action, handing the outcome to God while giving Him your whole cooperation.",
          "Elizabeth, filled with the Holy Spirit, names the root of it all: blessed is she who believed, for there will be a fulfillment of the things spoken to her from the Lord. And on the far side of surrender, Mary does not collapse; she sings. My soul magnifies the Lord, my spirit has rejoiced in God my Savior. Joy, it turns out, lives downstream of trust.",
          "For anyone who is white-knuckling life — trying to control an addiction, a diagnosis, another person, an unknown future — Mary offers words to borrow when your own trust runs thin: let it be done to me according to your word. You do not have to mean them perfectly to pray them honestly. Her yes was given one day at a time, renewed at Cana and at the cross, and yours can be too. Surrender is not a single heroic moment but a daily handing-over, and the God who received her yes receives yours gently.",
        ],
        prayer: "Behold the handmaid of the Lord; be it done unto me according to thy word.",
        closingPrayer: "Lord God, Mary answered You with a yes she could not see the end of: behold, the servant of the Lord; let it be done to me according to your word. When my own trust runs thin, let me borrow her words one day at a time. Undo the knots I have tied by grasping for control, and teach me that surrender to You is not defeat but the beginning of a song. May my soul, like hers, learn to magnify the Lord even from a humble state. Amen.",
        quiz: [
          { q: "In Luke 1:38, how does Mary describe herself?", options: ["The queen of Israel", "The servant of the Lord", "The daughter of Zion", "The mother of kings"], answer: 1 },
          { q: "In Luke 1:45, why does Elizabeth call Mary blessed?", options: ["Because she is of David's line", "Because she traveled to the hill country", "Because she kept silent", "Because she believed what the Lord had spoken would be fulfilled"], answer: 3 },
          { q: "In the Magnificat, what does Mary say her soul does?", options: ["Magnifies the Lord", "Trembles before the Lord", "Questions the promise", "Boasts in her strength"], answer: 0 },
          { q: "What does the teaching say Mary's yes required?", options: ["Full knowledge of the whole path", "A sign from the priests", "Trust before she could see how things would turn out", "The approval of Nazareth"], answer: 2 },
        ],
      },
      {
        n: 3,
        title: "Whatever He Says to You, Do It",
        scriptures: [
          {
            ref: "John 2:3",
            text: "When the wine ran out, Jesus' mother said to him, 'They have no wine.'",
            context: "Mary notices the quiet embarrassment of a young couple before anyone else does, and she brings the lack straight to Jesus. Her prayer is a model of intercession: she does not lecture or fix, she simply tells Him the need.",
          },
          {
            ref: "John 2:5",
            text: "His mother said to the servants, 'Whatever he says to you, do it.'",
            context: "These are the last recorded words of Mary in Scripture, and they point entirely away from herself. All true Marian devotion ends where she points — at her Son.",
          },
          {
            ref: "Luke 2:19",
            text: "But Mary kept all these sayings, pondering them in her heart.",
            context: "Mary's interior life was made of keeping and pondering, holding what she could not yet understand in her heart before God. She shows a way to carry confusion that is neither denial nor despair.",
          },
        ],
        teaching: [
          "At a wedding in Cana, Mary notices what no one else has: the wine is running out, and with it a young couple's honor. Her whole prayer is four words — they have no wine. She does not tell Jesus what to do or when to do it; she simply places the emptiness in front of Him and trusts Him with the rest. It is one of the purest lessons in prayer the Gospels contain.",
          "Many of us know what it is to run dry in public: patience gone, strength gone, sobriety threatened, hope down to the dregs. Mary's example says the empty jar is not something to hide from Jesus but the very thing to bring Him. At Cana He filled the vessels to the brim, and John calls it the beginning of His signs. What He asks from us first is not a solution, only honesty about the lack.",
          "Then come Mary's last recorded words in all of Scripture, spoken to the servants and to every generation since: whatever he says to you, do it. Everything true in Marian devotion is inside that sentence, because she always points away from herself to her Son. The servants did not receive the whole plan; they were told to fill jars with water, one ordinary task at a time. Obedience in small steps is how the miracle arrived.",
          "Luke adds the interior portrait: Mary kept all these sayings, pondering them in her heart. Pondering is not the anxious circling our minds fall into; it is holding what we cannot understand in God's presence instead of spinning it alone. When answers are slow and the next step is unclear, you can do what she did. Bring the need plainly, do the small thing He has already made clear, and hold the rest with Him in your heart.",
        ],
        prayer: "Mary, Help of Christians, pray for us.",
        closingPrayer: "Lord Jesus, at Cana Your mother saw the wine running out before anyone else and simply told You the need. I bring You my own empty jars — the strength, the patience, the hope that have run dry — and I say with her: they have no wine. Give me the grace to follow her last recorded words and do whatever You tell me, one small step at a time. And when I cannot understand what You are doing, teach me to keep and ponder it in my heart with her, instead of spinning alone. Amen.",
        quiz: [
          { q: "In John 2:3, what does Mary say to Jesus at Cana?", options: ["'Make more wine for us'", "'The feast is ended'", "'Send the servants away'", "'They have no wine'"], answer: 3 },
          { q: "What are Mary's last recorded words in Scripture (John 2:5)?", options: ["'Whatever he says to you, do it'", "'My soul magnifies the Lord'", "'Behold, your mother'", "'Let it be done to me'"], answer: 0 },
          { q: "According to Luke 2:19, what did Mary do with all these sayings?", options: ["She announced them in the temple", "She kept them, pondering them in her heart", "She wrote them for the apostles", "She questioned the shepherds"], answer: 1 },
          { q: "How does the teaching describe Mary's prayer at Cana?", options: ["A long argument with detailed instructions", "A demand for an immediate miracle", "Simply telling Jesus the need and trusting Him with the rest", "A silent hope she never spoke"], answer: 2 },
        ],
      },
      {
        n: 4,
        title: "Behold Your Mother",
        scriptures: [
          {
            ref: "Luke 2:35",
            text: "Yes, a sword will pierce through your own soul, that the thoughts of many hearts may be revealed.",
            context: "Simeon warned Mary from the beginning that love would cost her: a sword would pierce her own soul. Her month is not a devotion to painless serenity but to a faithfulness that stays through grief.",
          },
          {
            ref: "John 19:26-27",
            text: "Therefore when Jesus saw his mother, and the disciple whom he loved standing there, he said to his mother, 'Woman, behold, your son!' Then he said to the disciple, 'Behold, your mother!' From that hour, the disciple took her to his own home.",
            context: "From the cross, Jesus gives His mother to the disciple He loved, and the disciple to her. The Church has always heard her own name in that exchange: Mary is given as mother to all whom Jesus loves.",
          },
          {
            ref: "Revelation 12:1",
            text: "A great sign was seen in heaven: a woman clothed with the sun, and the moon under her feet, and on her head a crown of twelve stars.",
            context: "The woman clothed with the sun shows where Mary's road of swords and surrender ends: crowned and radiant on the side of heaven. What grace began in Nazareth, glory completes.",
          },
        ],
        teaching: [
          "When Mary presented her infant Son in the temple, old Simeon told her the truth no mother wants to hear: a sword will pierce through your own soul. Her life beneath that prophecy was not spared grief but shaped by it. May's devotion is not to a painless serenity; it is to a faithfulness that stays when staying costs everything.",
          "The sword fell fully on Calvary, and she did not run from it. Standing by the cross, Mary heard her dying Son give her away: woman, behold, your son — and to the disciple he loved, behold, your mother. From that hour the disciple took her to his own home. The Church has always heard her own name in that exchange: to all whom Jesus loves, Mary is given as mother.",
          "This matters for anyone who grieves, or who feels unmothered — by loss, by estrangement, by a childhood that failed them. Catholics do not worship Mary; worship belongs to God alone. But we are invited to do what John did: take her into our home, ask her prayers, and let a mother who has stood in the worst of it stand with us. The Memorare exists because centuries of struggling people have fled to her protection and not been left unaided.",
          "Revelation shows where her road of swords finally led: a great sign in heaven, a woman clothed with the sun, the moon under her feet, a crown of twelve stars. Glory, in God's economy, is what faithful suffering becomes. Her crown does not mock our present pain; it promises that pain borne with Christ is not wasted. The mother given to you at the cross now stands on the side of victory, and where she is, her Son intends to bring you too.",
        ],
        prayer: "Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death.",
        closingPrayer: "Lord Jesus, from the cross You looked at Your mother and the disciple You loved, and You gave them to each other. In that hour You gave her to me as well; help me, like John, to take her into my home. When the sword of grief pierces, let me stand with the mother who stayed, and when I feel unmothered and alone, remind me that I am not. Bring me at last to where the woman clothed with the sun already is, rejoicing in the victory of her Son. Amen.",
        quiz: [
          { q: "In Luke 2:35, what did Simeon foretell would pierce Mary's soul?", options: ["A sword", "A crown of thorns", "A spear", "A stone"], answer: 0 },
          { q: "In John 19:26-27, what does Jesus say to the beloved disciple?", options: ["'Woman, behold, your son'", "'Take her to Galilee'", "'Behold, your mother'", "'Remember me in your prayers'"], answer: 2 },
          { q: "What did the disciple do from that hour?", options: ["He returned to his nets", "He took Mary to his own home", "He fled the city", "He went to the tomb"], answer: 1 },
          { q: "In Revelation 12:1, how is the woman in the great sign described?", options: ["Robed in white linen with a palm branch", "Standing on a sea of glass", "Hidden in the wilderness", "Clothed with the sun, the moon under her feet, and a crown of twelve stars"], answer: 3 },
        ],
      },
    ],
  },
  {
    month: 6,
    title: "The Sacred Heart of Jesus",
    monthLabel: "June — The Sacred Heart of Jesus",
    scriptureRef: "Matthew 11:29 (World English Bible)",
    scriptureText: "Learn from me, for I am gentle and lowly in heart, and you will find rest for your souls.",
    teaching: "When shame tells you that you are too much or not enough, the Sacred Heart meets you exactly as you are. Jesus describes himself as meek and humble, offering rest rather than judgment to the weary. This is a love you do not have to earn, a heart open to you even on the days you cannot love yourself.",
    prayerLabel: "A Sacred Heart aspiration",
    prayer: "O Sacred Heart of Jesus, I place my trust in Thee.",
    novenaId: "sacred-heart",
    quiz: [
      { q: "In June, the Church especially honors…", options: ["The Holy Family", "The Blessed Virgin Mary", "The Sacred Heart of Jesus", "The Holy Eucharist"], answer: 2 },
      { q: "In Matthew 11:29, how does Jesus describe his own heart?", options: ["Meek and humble", "Strong and mighty", "Just and severe", "Distant and hidden"], answer: 0 },
      { q: "What does Jesus promise to those who learn from him?", options: ["Wealth and honor", "Rest for their souls", "Freedom from all trials", "Immediate answers"], answer: 1 },
      { q: "What does the teaching say about the love of the Sacred Heart?", options: ["It must be earned through effort", "It is offered only to the sinless", "It meets you as you are and is not earned", "It withdraws in times of shame"], answer: 2 },
    ],
    sessions: [
      {
        n: 1,
        title: "Come to Me and Rest",
        scriptures: [
          {
            ref: "Matthew 11:28",
            text: "Come to me, all you who labor and are heavily burdened, and I will give you rest.",
            context: "The Sacred Heart's invitation is addressed to the worn out, not the accomplished: come to me, all you who labor and are heavily burdened. Rest is promised as a gift from Jesus Himself, not a reward for finishing.",
          },
          {
            ref: "Matthew 11:29",
            text: "Take my yoke upon you, and learn from me, for I am gentle and humble in heart; and you will find rest for your souls.",
            context: "This is June's headline verse, the only place in the Gospels where Jesus describes His own heart: gentle and humble. Devotion to the Sacred Heart is simply taking Him at His word about what He is like.",
          },
          {
            ref: "Hosea 11:4",
            text: "I drew them with cords of a man, with ties of love; and I was to them like those who lift up the yoke on their necks; and I bent down to him and I fed him.",
            context: "Centuries before Bethlehem, God described His way of drawing people: cords of a man, ties of love, bending down to feed. The Sacred Heart is the oldest disposition of God toward His children, now beating in a human breast.",
          },
        ],
        teaching: [
          "June belongs to the Sacred Heart of Jesus, and its charter is an invitation: come to me, all you who labor and are heavily burdened, and I will give you rest. Notice who is invited — not the rested, not the accomplished, but the worn out. Exhaustion is the admission ticket. If you are tired in a way sleep does not fix, this month is addressed to you by name.",
          "Then Jesus does something found nowhere else in the Gospels: He describes His own heart. I am gentle and humble in heart, He says — the very words the Church sets over this month. Of all the things He could have revealed about His inner life, He chose gentleness and lowliness. Devotion to the Sacred Heart is simply taking Him at His word about what He is like.",
          "He does offer a yoke, and honesty requires saying so; following Him is not the absence of all effort. But a yoke, rightly fitted, is what makes a burden carryable — and this one is carried with Him. Hosea heard God describe Himself the same way centuries earlier: I drew them with cords of a man, with ties of love, like one who lifts the yoke and bends down to feed. God's pull on your life has always been tenderness, not force.",
          "Many people carrying shame quietly assume God's heart toward them is disappointed, cold, or finished with them. Jesus' self-description stands against that assumption with the authority of God Himself: gentle, humble, rest-giving. You do not have to feel this for it to be true, and you do not have to finish healing before you come. The invitation is present tense, and it is for the burdened exactly as they are.",
        ],
        prayer: "O Sacred Heart of Jesus, I place my trust in Thee.",
        closingPrayer: "Lord Jesus, gentle and humble in heart, You call the burdened to Yourself and promise rest for their souls. I come to You tired in ways sleep has not fixed, carrying loads I was never meant to carry alone. Fit Your yoke to my shoulders and carry it with me, as You drew Your people of old with cords of a man and ties of love. Teach me this June to believe what You have said about Your own Heart, and to let the worn-out parts of me rest there. Amen.",
        quiz: [
          { q: "In Matthew 11:28, whom does Jesus invite to come to him?", options: ["The strong and the wise", "All who labor and are heavily burdened", "Only the twelve apostles", "Those who have kept the whole law"], answer: 1 },
          { q: "In Matthew 11:29, how does Jesus describe his heart?", options: ["Gentle and humble", "Mighty and exalted", "Hidden and unknowable", "Stern and just"], answer: 0 },
          { q: "What does Jesus promise to those who take his yoke and learn from him?", options: ["Freedom from all labor", "Honor among men", "Immediate understanding", "Rest for their souls"], answer: 3 },
          { q: "In Hosea 11:4, how does God say he drew his people?", options: ["With chains of iron", "With warnings of judgment", "With cords of a man, with ties of love", "With pillars of fire"], answer: 2 },
        ],
      },
      {
        n: 2,
        title: "The Pierced Heart",
        scriptures: [
          {
            ref: "John 19:34",
            text: "However one of the soldiers pierced his side with a spear, and immediately blood and water came out.",
            context: "John insists on what he saw: a spear opened Jesus' side, and blood and water flowed out. The Church has always seen in that opened Heart the wellspring of her sacraments and the proof of a love that held nothing back.",
          },
          {
            ref: "Zechariah 12:10",
            text: "I will pour on David's house, and on the inhabitants of Jerusalem, the spirit of grace and of supplication; and they will look to me whom they have pierced; and they shall mourn for him, as one mourns for his only son, and will grieve bitterly for him, as one grieves for his firstborn.",
            context: "The prophet foresees a strange mercy: those who pierced Him will look at Him and receive not vengeance but a spirit of grace and supplication. The wound we caused becomes the meeting place He chooses.",
          },
          {
            ref: "John 7:37-38",
            text: "Now on the last and greatest day of the feast, Jesus stood and cried out, 'If anyone is thirsty, let him come to me and drink! He who believes in me, as the Scripture has said, from within him will flow rivers of living water.'",
            context: "Jesus stands up on the feast's greatest day and shouts His invitation to the thirsty. For every craving that promises and never delivers, His Heart offers living water instead.",
          },
        ],
        teaching: [
          "On Calvary, after Jesus had died, a soldier drove a spear into His side, and immediately blood and water came out. John, who saw it, insists on the detail, because in that opened side the Church has always seen more than a wound. Christian tradition has long recognized in the blood and water the sacraments of the Eucharist and Baptism, the life of the Church pouring from the side of her Lord. The Sacred Heart is not a soft metaphor; it is a Heart that was actually opened for you.",
          "Zechariah had foreseen the strange grace of that moment: they will look to me whom they have pierced, and they shall mourn as one mourns for an only son. Notice that looking at the pierced one brings not condemnation but a spirit of grace and supplication. God's answer to those who wounded Him is to make the wound itself the meeting place. The place of our worst act became the place of His widest welcome.",
          "Jesus had already promised as much in the temple: if anyone is thirsty, let him come to me and drink, and from within him will flow rivers of living water. Thirst is one of the oldest images for what addiction and anxiety feel like from the inside — a craving that keeps promising and never delivers. The Heart of Christ does not shame the thirsty; it cries out to them in a loud voice on the feast's greatest day.",
          "If you have ever believed your wounds disqualify you from God, the pierced Heart says the opposite: His wounds are the door. You do not approach the Sacred Heart by hiding your damage, but by bringing it to a Heart that kept its scars even in glory. None of this erases the slow human work of healing, and mercy does not undo every earthly consequence. But it does mean there is a place where your thirst is met with living water instead of judgment.",
        ],
        prayer: "Heart of Jesus, fountain of life and holiness, have mercy on us.",
        closingPrayer: "Lord Jesus, Your Heart was opened by a spear, and from it flowed blood and water for the life of the world. I look on the One whom my sins helped pierce, and I find there not condemnation but a spirit of grace. Take my thirst — every craving that promises and never delivers — and answer it with Your living water. Let Your opened side be my refuge, and Your scars my proof that wounds do not disqualify anyone from love. Amen.",
        quiz: [
          { q: "In John 19:34, what came out of Jesus' pierced side?", options: ["Fire and smoke", "Water only", "Blood and water", "Oil and wine"], answer: 2 },
          { q: "In Zechariah 12:10, what will God pour on David's house?", options: ["The spirit of grace and of supplication", "The waters of the flood", "The oil of kings", "The dust of the earth"], answer: 0 },
          { q: "In John 7:37, what does Jesus cry out to the thirsty?", options: ["'Wait for the feast to end'", "'Let him come to me and drink'", "'Draw from Jacob's well'", "'Purify yourselves first'"], answer: 1 },
          { q: "How has the Church long read the opened side of Christ?", options: ["As a detail with no meaning", "As a punishment for the soldier", "As proof the disciples fled", "As the wellspring of the sacraments and an open door into his Heart"], answer: 3 },
        ],
      },
      {
        n: 3,
        title: "He First Loved Us",
        scriptures: [
          {
            ref: "1 John 4:10",
            text: "In this is love, not that we loved God, but that he loved us, and sent his Son as the atoning sacrifice for our sins.",
            context: "John defines love by its direction: it begins in God, not in us, and it was proven by the sending of His Son. The Sacred Heart loved first, which means our love is always an answer and never an audition.",
          },
          {
            ref: "Jeremiah 31:3",
            text: "Yahweh appeared of old to me, saying, Yes, I have loved you with an everlasting love. Therefore I have drawn you with loving kindness.",
            context: "God names His love everlasting — without a starting point and without an expiration. No season of failure interrupts a love that was there before we existed.",
          },
          {
            ref: "Ezekiel 36:26",
            text: "I will also give you a new heart, and I will put a new spirit within you. I will take away the stony heart out of your flesh, and I will give you a heart of flesh.",
            context: "God promises to exchange the stony heart for a heart of flesh, tenderness restored from the inside. The Sacred Heart does not only pity our hardness; it heals it.",
          },
        ],
        teaching: [
          "Saint John gives the definition the whole devotion rests on: in this is love, not that we loved God, but that he loved us, and sent his Son as the atoning sacrifice for our sins. The direction matters enormously. Love, in the Christian story, does not start with our effort and climb toward God; it starts in the Heart of God and comes down to us. Everything else — repentance, change, growth — is a response, never an audition.",
          "Jeremiah heard the same truth spoken with unbearable tenderness: I have loved you with an everlasting love; therefore I have drawn you with loving kindness. Everlasting means there was no moment when this love began, and there will be no moment when it stops. It also means your worst season did not interrupt it. You were loved before your first fall and after your latest one, with a love that predates your existence and outlasts your failures.",
          "But the Sacred Heart does more than feel for us; it remakes us. Through Ezekiel, God promises the deepest kind of healing: I will take away the stony heart out of your flesh, and I will give you a heart of flesh. Hearts grow stony for understandable reasons — repeated pain, self-protection, the numbness that follows shame. God does not scold the stone; He replaces it, patiently, from the inside.",
          "This is why devotion to the Sacred Heart is not sentimentality but transformation. We look at His Heart until our own begins to soften, we receive His love until we have some to give, and we let being loved first become the ground we stand on. That kind of change is usually slow, often invisible from one week to the next, and helped rather than replaced by counselors, communities, and honest friends. Grace works gladly through all of it, and the everlasting love underneath it never moves.",
        ],
        prayer: "Sweet Heart of my Jesus, grant that I may ever love Thee more.",
        closingPrayer: "O Sacred Heart of Jesus, You loved me first — before my first prayer, before my worst fall, with an everlasting love that nothing in my story has interrupted. Let me stop auditioning now and simply receive. Take away what has turned to stone in me through pain and shame, and give me a heart of flesh that can feel, and trust, and love again. Draw me with Your loving kindness, and let my whole healing be an answer to a love already given. Amen.",
        quiz: [
          { q: "According to 1 John 4:10, what is love?", options: ["That we loved God first", "That God loved us and sent his Son as the atoning sacrifice for our sins", "That we kept the commandments", "That we loved one another perfectly"], answer: 1 },
          { q: "In Jeremiah 31:3, how does God describe his love?", options: ["A love that began at Sinai", "A love earned by obedience", "A love for one generation", "An everlasting love that draws with loving kindness"], answer: 3 },
          { q: "In Ezekiel 36:26, what does God promise to give?", options: ["A new heart and a new spirit", "A new land and a new king", "A new law and a new temple", "New wealth and new strength"], answer: 0 },
          { q: "What does the teaching say about where love starts?", options: ["With our resolve to do better", "With proving ourselves trustworthy", "With God, who loved us first, before any effort or repair of ours", "With the approval of others"], answer: 2 },
        ],
      },
      {
        n: 4,
        title: "Rooted in His Love",
        scriptures: [
          {
            ref: "John 15:9",
            text: "Even as the Father has loved me, I also have loved you. Remain in my love.",
            context: "Jesus loves us with the very love the Father has for Him, and gives one instruction: remain in it. The Sacred Heart is not a place to visit but a home to live in.",
          },
          {
            ref: "Ephesians 3:17-19",
            text: "that Christ may dwell in your hearts through faith; to the end that you, being rooted and grounded in love, may be strengthened to comprehend with all the saints what is the width and length and height and depth, and to know Christ's love which surpasses knowledge, that you may be filled with all the fullness of God.",
            context: "Paul prays for hearts rooted and grounded in a love whose width, length, height, and depth outrun all knowledge. A love that cannot be measured is a love that cannot be used up.",
          },
          {
            ref: "Isaiah 49:15-16",
            text: "Can a woman forget her nursing child, that she should not have compassion on the son of her womb? Yes, these may forget, yet I will not forget you! Behold, I have engraved you on the palms of my hands. your walls are continually before me.",
            context: "God answers the fear of being forgotten with the strongest image He has: more faithful than a nursing mother, with our names engraved on the palms of His hands. The wounded hands of Jesus carry that engraving still.",
          },
        ],
        teaching: [
          "On the night before He died, Jesus made a statement that should stop us mid-stride: even as the Father has loved me, I also have loved you. The love within the Trinity — infinite, unbroken, delighted — is the very love with which the Sacred Heart loves you. Then comes the one command of the sentence: remain in my love. Not achieve it, not earn it; remain in what is already yours.",
          "Saint Paul turns this into a prayer for people he knew were struggling: that Christ may dwell in your hearts through faith, that you may be rooted and grounded in love, strengthened to comprehend its width and length and height and depth. He admits in the same breath that this love surpasses knowledge. You will not get to the bottom of it, and that is the point — a love with a bottom could be exhausted, and this one cannot.",
          "Isaiah answers the last fear, the one beneath so much anxiety and despair: what if I am forgotten? Can a woman forget her nursing child? Even if she could, God says, I will not forget you — behold, I have engraved you on the palms of my hands. Engraved, not penciled in; on His hands, where He cannot help but see. The crucified hands of Jesus carry that engraving forever.",
          "To place your trust in the Sacred Heart is not to pretend the road ahead is guaranteed painless. It is to decide where you will live: rooted in a love that precedes you, remains with you, and cannot forget you. Trust like that is built the way roots grow — slowly, mostly unseen, watered by small daily returns to His Heart. This month, let every return, however small and however late in the day, count as remaining in His love.",
        ],
        prayer: "Jesus, meek and humble of heart, make my heart like unto Thine.",
        closingPrayer: "Lord Jesus, You love me with the very love the Father has for You, and You ask only that I remain in it. Root me and ground me in that love; make Your Heart the home I return to in anxious hours, the soil my slow healing grows in. When I fear I have been forgotten, show me my name engraved on the palms of Your hands. O Sacred Heart of Jesus, I place my trust in Thee, today and every day, unto the end. Amen.",
        quiz: [
          { q: "In John 15:9, what does Jesus command after saying he has loved us?", options: ["'Go and tell no one'", "'Climb the mountain'", "'Sell all you have'", "'Remain in my love'"], answer: 3 },
          { q: "In Ephesians 3:17, Paul prays that Christ may dwell where?", options: ["In the temple", "In your hearts through faith", "In the heavens only", "In Jerusalem"], answer: 1 },
          { q: "How does Ephesians 3:19 describe Christ's love?", options: ["It surpasses knowledge", "It is reserved for the saints alone", "It must be earned by comprehension", "It is measured and limited"], answer: 0 },
          { q: "In Isaiah 49:15-16, how does God answer the fear of being forgotten?", options: ["He promises a new city", "He says no one is ever forgotten by anyone", "He says that even if a mother could forget, he will not, for we are engraved on the palms of his hands", "He tells Israel to forget the past"], answer: 2 },
        ],
      },
    ],
  },
  {
    month: 8,
    title: "The Immaculate Heart of Mary",
    monthLabel: "August — The Immaculate Heart of Mary",
    scriptureRef: "Luke 2:19 (World English Bible)",
    scriptureText: "But Mary kept all these sayings, pondering them in her heart.",
    teaching: "When your thoughts race and circle the same worry a hundred times, remember that Mary did not panic at all she did not understand. She pondered, holding the hard things quietly and prayerfully in her heart. You can bring the same restless thoughts to her Immaculate Heart and let them be held there instead of spinning alone.",
    prayerLabel: "An Immaculate Heart aspiration",
    prayer: "Sweet Heart of Mary, be my salvation.",
    novenaId: "immaculate-heart",
    quiz: [
      { q: "In August, the Church especially honors…", options: ["The Immaculate Heart of Mary", "The Holy Rosary", "Our Lady of Sorrows", "The Holy Souls in Purgatory"], answer: 0 },
      { q: "According to Luke 2:19, what did Mary do with all these words?", options: ["She wrote them down", "She kept them, pondering them in her heart", "She told them to the apostles", "She forgot them"], answer: 1 },
      { q: "The teaching contrasts Mary's response to hard things with which reaction?", options: ["Anger", "Panic", "Laughter", "Silence"], answer: 1 },
      { q: "The aspiration asks the Sweet Heart of Mary to be what?", options: ["My glory", "My comfort", "My salvation", "My teacher"], answer: 2 },
    ],
    sessions: [
      {
        n: 1,
        title: "The Heart That Ponders",
        scriptures: [
          {
            ref: "Luke 2:19",
            text: "But Mary kept all these sayings, pondering them in her heart.",
            context: "This is August's headline verse: shepherds have just burst in with words from angels, and Mary's response is not panic but pondering. The Immaculate Heart is first of all a heart that holds what it cannot yet understand, quietly and in God's presence.",
          },
          {
            ref: "Luke 2:51",
            text: "And he went down with them, and came to Nazareth. He was subject to them, and his mother kept all these sayings in her heart.",
            context: "Years later, after the fright of losing Jesus in Jerusalem, Luke repeats the same phrase: his mother kept all these sayings in her heart. Pondering was not a one-time reaction for Mary but a lifelong habit, the steady interior life the Church honors this month.",
          },
          {
            ref: "Psalm 131:2",
            text: "Surely I have stilled and quieted my soul, like a weaned child with his mother, like a weaned child is my soul within me.",
            context: "The psalmist describes a soul stilled and quieted like a child resting against its mother. That is the invitation of the Immaculate Heart devotion: a place where a racing mind can learn, little by little, to rest.",
          },
        ],
        teaching: [
          "August is devoted to the Immaculate Heart of Mary, and Saint Luke gives us its clearest window: twice he tells us that Mary kept all these sayings in her heart. The night of Bethlehem was full of things she could not have fully understood, and the loss of her Son in Jerusalem was three days of real anguish. In both cases her response was neither to suppress what happened nor to spin on it endlessly, but to ponder, to hold it before God until its meaning could ripen.",
          "There is a difference worth noticing between pondering and rumination. Rumination circles the same fear or the same regret again and again, going nowhere; it leaves us more exhausted and more alone than it found us. Pondering, as Mary practiced it, holds the same hard material but holds it in God's presence, the way a person might carry a question to a trusted friend instead of arguing with themselves in an empty room.",
          "The Church calls Mary's heart Immaculate because God preserved her from sin from the first moment of her existence, by a singular grace flowing from her Son's redemption. This does not make her distant from us; it makes her the clearest picture of what a human heart looks like when grace has its full way. Her heart was not spared confusion, fear, or grief, as the Gospels plainly show. What grace gave her was not exemption from suffering but an unbroken way of turning toward God inside it.",
          "If your own thoughts race and circle at night, the devotion of this month is not a demand to think like Mary by willpower. It is an invitation to bring the spinning thoughts to her heart and let them be held there, entrusted to a mother who knows what it is to carry what she cannot resolve. The psalmist's image of a weaned child resting against its mother is not achieved in an evening, and no one is asked to pretend calm they do not feel. But a restless soul can learn stillness the way a child learns it: not by effort, but by being held.",
        ],
        prayer: "Sweet Heart of Mary, be my salvation.",
        closingPrayer: "Immaculate Heart of Mary, you kept the sayings you did not yet understand and pondered them before God. Take the thoughts that race and circle in me tonight, the worries I have turned over a hundred times without rest, and hold them in your heart. Teach me the difference between spinning alone and pondering with God, and when I cannot quiet my own soul, quiet it for me, as a mother stills a child. Keep me near your Son, whom you carried and never ceased to contemplate. Sweet Heart of Mary, be my salvation. Amen.",
        quiz: [
          { q: "According to Luke 2:19, what did Mary do with all these sayings?", options: ["She announced them in the temple", "She kept them, pondering them in her heart", "She asked the shepherds to explain them", "She wrote them in a book"], answer: 1 },
          { q: "In Luke 2:51, after returning to Nazareth, what does Luke say about Mary?", options: ["She questioned Jesus daily", "She told the elders everything", "She kept all these sayings in her heart", "She forgot the sorrow of Jerusalem"], answer: 2 },
          { q: "How does the teaching distinguish pondering from rumination?", options: ["Pondering holds hard things in God's presence; rumination circles alone and goes nowhere", "Pondering is faster than rumination", "Rumination is prayerful; pondering is anxious", "There is no real difference between them"], answer: 0 },
          { q: "In Psalm 131:2, the psalmist compares his quieted soul to what?", options: ["A watchman at dawn", "A tree planted by water", "A ship at anchor", "A weaned child with his mother"], answer: 3 },
        ],
      },
      {
        n: 2,
        title: "The Heart That Trusts",
        scriptures: [
          {
            ref: "Luke 1:45",
            text: "Blessed is she who believed, for there will be a fulfillment of the things which have been spoken to her from the Lord!",
            context: "Elizabeth names the deepest blessedness of Mary's heart: she believed before she could see any of it fulfilled. The Immaculate Heart is a trusting heart, and trust in the dark is exactly where it shines.",
          },
          {
            ref: "Luke 1:46-48",
            text: "Mary said, 'My soul magnifies the Lord. My spirit has rejoiced in God my Savior, for he has looked at the humble state of his servant. For behold, from now on, all generations will call me blessed.'",
            context: "Mary's song rises from a humble state, not from a solved life; she magnifies God while nearly everything ahead is still unknown. Her heart shows that praise does not have to wait until the circumstances improve.",
          },
          {
            ref: "Proverbs 3:5-6",
            text: "Trust in Yahweh with all your heart, and don't lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.",
            context: "Proverbs asks for trust with all your heart precisely where understanding runs out. Mary's Immaculate Heart lived this counsel completely, and this month she lends it to those of us whose trust runs thin.",
          },
        ],
        teaching: [
          "When Elizabeth greets Mary, she does not praise her cousin's strength or cleverness; she praises her faith. Blessed is she who believed, for there will be a fulfillment of the things spoken to her from the Lord. At that moment almost nothing had been fulfilled yet. Mary was carrying a promise she could not verify, walking into a future she could not picture, and Elizabeth calls that trust itself the blessing.",
          "Then Mary sings, and the Magnificat tells us what a trusting heart sounds like. My soul magnifies the Lord, she says, from the humble state of his servant, in a poor town, in circumstances that would have looked precarious to any observer. She does not praise God because everything has worked out; she praises God before anything has worked out. The Immaculate Heart teaches that gratitude and trust are not the fruit of a solved life but a way of standing inside an unsolved one.",
          "Proverbs gives the same counsel to every generation: trust in Yahweh with all your heart, and do not lean on your own understanding. For anyone in recovery, or anyone whose anxiety demands certainty before it will loosen its grip, this is hard counsel, because our own understanding is exactly what we lean on hardest. The invitation is not to stop thinking, but to stop demanding that our thinking secure the future before we take the next right step.",
          "None of this asks you to manufacture a trust you do not feel, and trusting God does not mean outcomes will match our hopes on our schedule. Mary's own trust led her through real poverty, exile, and eventually to the foot of a cross; faith did not spare her the road. But her heart shows that a person can walk an uncertain road without being destroyed by it, held by a faithfulness larger than her own. When your trust runs thin, you are allowed to borrow hers: to ask the Immaculate Heart to believe alongside you until you can believe again.",
        ],
        prayer: "Immaculate Heart of Mary, pray for us.",
        closingPrayer: "Immaculate Heart of Mary, blessed because you believed, look on me when believing is hard. You sang the goodness of God before you could see how any of it would end, and you trusted with all your heart where understanding gave out. I lean so heavily on my own understanding, and it keeps buckling under me; teach me instead to acknowledge God in all my ways and to take the next right step without demanding the whole map. When my trust runs thin, believe alongside me, and carry my small, tired faith inside your great one. Amen.",
        quiz: [
          { q: "In Luke 1:45, why does Elizabeth call Mary blessed?", options: ["Because of her royal ancestry", "Because she had already seen the promise fulfilled", "Because she believed the things spoken to her from the Lord", "Because she traveled a great distance"], answer: 2 },
          { q: "According to Luke 1:46-48, from what state does Mary magnify the Lord?", options: ["The humble state of his servant", "A position of honor in Jerusalem", "The house of the high priest", "A place of great wealth"], answer: 0 },
          { q: "What does Proverbs 3:5-6 tell us not to lean on?", options: ["The counsel of friends", "The strength of others", "The traditions of elders", "Our own understanding"], answer: 3 },
          { q: "What does the teaching say about trust when it runs thin?", options: ["It proves faith was never real", "You can ask Mary to believe alongside you until you can believe again", "It must be fixed by more effort before praying", "It should be hidden from God"], answer: 1 },
        ],
      },
      {
        n: 3,
        title: "A Heart Made New",
        scriptures: [
          {
            ref: "Psalm 51:10",
            text: "Create in me a clean heart, O God. Renew a right spirit within me.",
            context: "David prays this after grave sin, asking not for a patched-up heart but a created one, which only God can give. The Immaculate Heart of Mary is the sign of what God's grace can make of a human heart, and this psalm is how the rest of us ask for our share.",
          },
          {
            ref: "Ezekiel 36:26",
            text: "I will also give you a new heart, and I will put a new spirit within you. I will take away the stony heart out of your flesh, and I will give you a heart of flesh.",
            context: "Through Ezekiel, God promises to do the very thing we cannot do for ourselves: exchange a heart of stone for a heart of flesh. August's devotion holds up Mary's heart not to shame ours, but to show what that promise looks like fulfilled.",
          },
          {
            ref: "Matthew 5:8",
            text: "Blessed are the pure in heart, for they shall see God.",
            context: "Jesus attaches a promise to purity of heart: the pure shall see God. Mary, purest of heart, sees Him most clearly, and she wants nothing more than to bring the rest of us to that same sight.",
          },
        ],
        teaching: [
          "Honoring the Immaculate Heart can stir a quiet ache: her heart is spotless, and mine is not. Anyone carrying shame from addiction, from things done or things suffered, can feel that August's devotion is for someone else. But the Church holds up Mary's heart in exactly the opposite spirit. Her Immaculate Heart is not a rebuke to wounded hearts; it is God's public demonstration of what His grace intends to do with every heart that is given to Him.",
          "Notice where the great heart-prayers of Scripture come from. Psalm fifty-one is David's prayer after his worst sin, and he does not ask God to polish what is there; he asks God to create a clean heart, using the word Scripture reserves for what only God can do. Ezekiel speaks to a people in exile because of their own unfaithfulness, and the promise is not that they will renovate themselves: I will give you a new heart, God says, and take the stony heart out of your flesh. A new heart is asked for and received, never self-made.",
          "Mary was preserved from sin from the first moment of her conception, and we are cleansed and renewed along the way; but it is the same grace of Christ at work in her and in us, hers at the beginning, ours in the middle of the story. This is why the saints have never seen the Immaculate Heart as a closed door. What God did in her wholesale, He is doing in us slowly, through Baptism, Confession, the Eucharist, and the long patient work of conversion. The distance between her heart and ours is not a verdict; it is a direction of travel.",
          "Jesus promises that the pure in heart shall see God, and purity of heart here is not mere sinlessness of record but singleness of desire, a heart no longer divided against itself. Anyone who has fought a compulsion knows what a divided heart feels like from the inside. The renewal God offers does not usually arrive overnight, and grace does not erase every consequence or struggle; but a heart of stone really can become a heart of flesh. Ask for it in David's words, daily, without embarrassment, for God has never once despised a contrite heart that asked.",
        ],
        prayer: "O Mary, conceived without sin, pray for us who have recourse to thee.",
        closingPrayer: "Lord God, who prepared the Immaculate Heart of Mary as a dwelling place for your Son, I come to you with a heart that is not clean and a spirit that is not steady. Create in me a clean heart; take out of me the heart of stone that shame and old habits have hardened, and give me a heart of flesh. Let me look at Mary's heart not as a verdict against mine but as a promise of what your grace can do, in your time, along your patient road. Make my divided heart single, until with the pure in heart I see you. Amen.",
        quiz: [
          { q: "In Psalm 51:10, what does David ask God to do?", options: ["Create in him a clean heart and renew a right spirit", "Give him victory over his enemies", "Restore his kingdom's borders", "Send a prophet to guide him"], answer: 0 },
          { q: "In Ezekiel 36:26, what does God promise to take away?", options: ["The people's exile", "The heart of flesh", "The stony heart", "The new spirit"], answer: 2 },
          { q: "According to the teaching, how does the Church hold up the Immaculate Heart to wounded hearts?", options: ["As a rebuke that exposes their failures", "As a standard reached only by effort", "As proof that most hearts cannot change", "As a demonstration of what grace intends for every heart given to God"], answer: 3 },
          { q: "In Matthew 5:8, what is promised to the pure in heart?", options: ["They shall inherit the earth", "They shall see God", "They shall be called children of God", "They shall obtain mercy"], answer: 1 },
        ],
      },
      {
        n: 4,
        title: "A Mother's Heart for You",
        scriptures: [
          {
            ref: "John 2:5",
            text: "His mother said to the servants, 'Whatever he says to you, do it.'",
            context: "At Cana, Mary notices a need before anyone asks and quietly brings it to Jesus; her only recorded instruction is to point others to Him. The Immaculate Heart never keeps devotion for itself — its whole movement is toward her Son.",
          },
          {
            ref: "Isaiah 66:13",
            text: "As one whom his mother comforts, so will I comfort you. You will be comforted in Jerusalem.",
            context: "God chooses a mother's comfort as the image of His own, the most immediate tenderness most of us ever knew. Devotion to Mary's heart is one of the ways the Church lets that promised comfort become concrete.",
          },
          {
            ref: "Luke 11:27-28",
            text: "It came to pass, as he said these things, a certain woman out of the multitude lifted up her voice, and said to him, 'Blessed is the womb that bore you, and the breasts which nursed you!' But he said, 'On the contrary, blessed are those who hear the word of God, and keep it.'",
            context: "Jesus redirects praise of His mother's body to the deeper blessedness of hearing and keeping God's word — which is precisely what Luke has already shown Mary's heart doing. Far from diminishing her, He names the very thing that makes her heart immaculate and imitable.",
          },
        ],
        teaching: [
          "At the wedding in Cana it is Mary who notices the wine has run out, before the embarrassment becomes public, before anyone thinks to pray about it. She brings the need to Jesus simply by naming it, and then she gives the servants the whole of her spirituality in one line: whatever he says to you, do it. This is the permanent shape of the Immaculate Heart. It notices quietly, it intercedes, and it always, always points to her Son.",
          "This is why the Church has never worried that love for Mary competes with love for Jesus. When the woman in the crowd cries out a blessing on the womb that bore Him, Jesus answers that the deeper blessedness belongs to those who hear the word of God and keep it. He is not brushing His mother aside; He is defining what actually made her great, for Luke has already shown us twice that keeping God's word in her heart is exactly what Mary did. Her privilege is real, but it is her faith the Gospel holds up for imitation, and faith is something we can share.",
          "Isaiah records one of the tenderest promises in Scripture: as one whom his mother comforts, so will I comfort you. God Himself reaches for a mother's comfort as the truest picture of His own. Some of us had mothers whose comfort we still miss, and some of us had mothers who wounded us, which can make this image ache. The promise stands for both: the comfort God intends is the kind a mother's arms were always meant to give, and in giving us Mary, He gives that image a heart and a name.",
          "If shame has taught you to approach God only flinching, the Immaculate Heart is a gentle place to relearn the approach. A mother does not require her child to be impressive, only present, and Mary's heart asks nothing of you except to be brought to Jesus. Come to her as you are, with the addiction, the anxiety, the grief, the unfinished mess, and let her do what she did at Cana: notice what has run out, bring it to her Son, and tell you softly, whatever he says to you, do it.",
        ],
        prayer: "Immaculate Heart of Mary, keep my heart close to Jesus.",
        closingPrayer: "Mary, Mother of Jesus and my mother, your Immaculate Heart noticed at Cana what had run out before anyone asked. You see what has run out in me — patience, courage, sobriety, hope — and you know how to bring an empty vessel to your Son. Comfort me as only a mother can, with the comfort God Himself promised through Isaiah, and do not let my shame keep me at a distance from either of you. Say over my life what you said to the servants, and give me the grace to obey: whatever he says to you, do it. Keep me, through this month and always, close to the Heart of Jesus by way of your own. Amen.",
        quiz: [
          { q: "In John 2:5, what instruction does Mary give the servants at Cana?", options: ["Bring more wine from the village", "Tell no one what has happened", "Whatever he says to you, do it", "Wait until the feast has ended"], answer: 2 },
          { q: "In Isaiah 66:13, God compares His comfort to that of whom?", options: ["A mother comforting her child", "A shepherd guarding his flock", "A king defending his city", "A friend at the gate"], answer: 0 },
          { q: "In Luke 11:28, who does Jesus say are blessed?", options: ["Those who saw His miracles", "The crowds who followed Him", "The rulers of the synagogue", "Those who hear the word of God and keep it"], answer: 3 },
          { q: "According to the teaching, what is the permanent shape of the Immaculate Heart?", options: ["It keeps devotion for itself", "It notices, intercedes, and always points to her Son", "It requires us to be impressive before approaching", "It replaces the need to go to Jesus"], answer: 1 },
        ],
      },
    ],
  },
  {
    month: 9,
    title: "Our Lady of Sorrows",
    monthLabel: "September — Our Lady of Sorrows",
    scriptureRef: "Luke 2:35 (World English Bible)",
    scriptureText: "Yes, a sword will pierce through your own soul.",
    teaching: "Grief can make us feel useless, as if standing by someone in pain accomplishes nothing. But Mary did not fix her Son's suffering or take it away; she stayed beneath the Cross, and her faithful presence in that anguish is honored to this day. When you keep watch over a suffering loved one, or sit in your own sorrow, that steadfast presence is itself something holy.",
    prayerLabel: "A prayer to the Mother of Sorrows",
    prayer: "O Mother of Sorrows, by the anguish and love with which thou didst stand beneath the Cross of Jesus, stand by me in my afflictions.",
    novenaId: "our-lady-of-sorrows",
    quiz: [
      { q: "In September, the Church especially honors…", options: ["The Holy Rosary", "Our Lady of Sorrows", "The Immaculate Conception", "The Immaculate Heart of Mary"], answer: 1 },
      { q: "In Luke 2:35, what is foretold will pierce Mary's own soul?", options: ["A thorn", "A sword", "A spear", "An arrow"], answer: 1 },
      { q: "According to the teaching, what did Mary do beneath the Cross?", options: ["She took away His suffering", "She stayed present in the anguish", "She left in despair", "She rebuked the crowd"], answer: 1 },
      { q: "The prayer asks the Mother of Sorrows to do what?", options: ["Forgive my sins", "Stand by me in my afflictions", "Grant me wealth", "Take away all pain at once"], answer: 1 },
    ],
    sessions: [
      {
        n: 1,
        title: "The Sword Foretold",
        scriptures: [
          {
            ref: "Luke 2:35",
            text: "Yes, a sword will pierce through your own soul, that the thoughts of many hearts may be revealed.",
            context: "This is September's headline verse, spoken by Simeon while Mary held her infant Son in the temple. From the very beginning, her joy and her sorrow were given to her together, and she carried the prophecy of the sword for over thirty years.",
          },
          {
            ref: "Matthew 2:13-14",
            text: "Now when they had departed, behold, an angel of the Lord appeared to Joseph in a dream, saying, 'Arise and take the young child and his mother, and flee into Egypt, and stay there until I tell you, for Herod will seek the young child to destroy him.' He arose and took the young child and his mother by night, and departed into Egypt,",
            context: "The second sorrow follows fast on the first: a night flight into a foreign land because someone powerful wants the child dead. Mary knew displacement, danger, and the fear of losing what she loved most — sorrows familiar to many who carry trauma of their own.",
          },
          {
            ref: "Luke 2:48",
            text: "When they saw him, they were astonished, and his mother said to him, 'Son, why have you treated us this way? Behold, your father and I were anxiously looking for you.'",
            context: "The third sorrow is three days of searching for a lost child, and Mary names the feeling out loud: we were anxiously looking for you. Scripture does not hide her anguish or pretend holiness means the absence of anxiety.",
          },
        ],
        teaching: [
          "September is devoted to Our Lady of Sorrows, and the tradition counts seven sorrows in her life, beginning long before Calvary. The first came in the temple, on a day of celebration, when old Simeon looked at her infant Son and told her a sword would pierce her own soul. Joy and grief were handed to Mary in the same moment, and she was asked to carry a wound that had not yet arrived. Anyone who has lived under a diagnosis, a looming loss, or a dread they cannot name knows something of that weight.",
          "The sorrows that follow are strikingly ordinary in their shape, even when their circumstances are not. A family flees by night because a violent man wants their child dead: that is terror and displacement. A twelve-year-old goes missing for three days in a crowded city: that is the specific anguish every parent's body knows. Mary's own words in the temple are worth hearing slowly — your father and I were anxiously looking for you. The Mother of God says out loud that she was anxious, and Scripture records it without embarrassment.",
          "This matters for anyone who has been told, or has told themselves, that real faith would not feel afraid. Mary was preserved from all sin, yet she fled, she searched, she felt the anguish and said so. Fear and grief are not sins; they are the honest weather of a heart that loves in a dangerous world. What grace gave Mary was not numbness but the capacity to keep walking, keep seeking, and keep trusting God inside the fear rather than waiting for the fear to pass first.",
          "Notice too what Simeon says the sword is for: that the thoughts of many hearts may be revealed. Mary's sorrow was not meaningless pain; it was woven into God's work of bringing hidden things into the light. This is not a claim that suffering is good, or that God sends grief to teach lessons — the Church does not teach that. It is the quieter promise that no sorrow carried with God is ever wasted, and that the pierced heart of Mary has become, for millions, the safest place to bring a pierced heart of their own.",
        ],
        prayer: "O Mother of Sorrows, pray for us.",
        closingPrayer: "Mary, Mother of Sorrows, a sword was promised to you while your arms were full of joy, and you carried that word for years without letting it turn your heart to stone. You know the fear of the night flight, the anguish of searching, the long ache of a grief foretold. Take my own dreads and losses, the ones that arrived and the ones I still brace against, and hold them with me as you held the sayings of God. Teach me that fear is not faithlessness, and that a pierced heart can still walk, still seek, and still trust. Stand by me in my afflictions, now and at every hour. Amen.",
        quiz: [
          { q: "In Luke 2:35, what does Simeon foretell about Mary?", options: ["She will reign as a queen", "A sword will pierce through her own soul", "She will never know grief", "She will return to the temple yearly"], answer: 1 },
          { q: "In Matthew 2:13, why does the angel tell Joseph to flee into Egypt?", options: ["Because a famine was coming", "Because the temple had been closed", "Because the census required it", "Because Herod would seek the young child to destroy him"], answer: 3 },
          { q: "In Luke 2:48, how does Mary describe the search for the twelve-year-old Jesus?", options: ["Your father and I were anxiously looking for you", "We knew where you would be", "We waited calmly at home", "We sent the shepherds to find you"], answer: 0 },
          { q: "What does the teaching say about Mary's fear and anguish?", options: ["They show her faith was weak", "Scripture hides them out of reverence", "They were honest and not sinful; grace helped her keep walking inside them", "They ended after the flight into Egypt"], answer: 2 },
        ],
      },
      {
        n: 2,
        title: "The Way of Sorrow",
        scriptures: [
          {
            ref: "Isaiah 53:3",
            text: "He was despised, and rejected by men; a man of suffering, and acquainted with disease. He was despised as one from whom men hide their face; and we didn't respect him.",
            context: "Isaiah foresees a servant who is not a stranger to suffering but acquainted with it, despised and avoided. Mary's fourth sorrow was meeting this man of sorrows on the road to Calvary and recognizing her own Son.",
          },
          {
            ref: "Luke 23:27-28",
            text: "A great multitude of the people followed him, including women who also mourned and lamented him. But Jesus, turning to them, said, 'Daughters of Jerusalem, don't weep for me, but weep for yourselves and for your children.'",
            context: "On the way of the cross, Jesus is followed by women who mourn openly, and He turns to meet their grief rather than passing it by. Tradition places Mary on this same road, where mother and Son met each other's eyes in the middle of the worst.",
          },
          {
            ref: "Lamentations 1:12",
            text: "Is it nothing to you, all you who pass by? Look, and see if there is any sorrow like my sorrow, which is brought on me, with which Yahweh has afflicted me in the day of his fierce anger.",
            context: "The Church has long placed this cry from Lamentations on the lips of the Sorrowful Mother: is it nothing to you, all you who pass by? It is the voice of every grief that fears being invisible, and this month refuses to pass it by.",
          },
        ],
        teaching: [
          "Centuries before Calvary, Isaiah described the coming servant of God in words that still startle: a man of suffering, acquainted with disease, despised as one from whom men hide their face. We instinctively look away from suffering — from the sick, the addicted, the grieving, sometimes from our own reflection. Isaiah says God's chosen one deliberately took the place of the person everyone looks away from. If you have ever felt like someone people avoid, you are describing the position Christ chose.",
          "The fourth sorrow of Mary is her meeting with Jesus as He carried the cross. The Gospels tell us the road was lined with women who mourned and lamented, and that Jesus, staggering under the beam, still turned toward their grief and spoke to them. He did not tell them their weeping was weakness. Sorrow on that road was met, not managed; seen, not shamed. Tradition holds that somewhere on that same road His mother's eyes found His, and neither could take the pain away, and neither looked away.",
          "The old cry of Lamentations — is it nothing to you, all you who pass by? — is the question every deep grief eventually asks. Much of the pain of sorrow is the fear that it is invisible, that the world will simply walk past. The Church answers that question every September by stopping, deliberately, in front of the Sorrowful Mother, and by extension in front of every sorrowing person. Grief that is witnessed does not stop hurting, but it stops being utterly alone, and that difference can be the difference that carries a person through.",
          "There is a practical word here for how we treat our own pain and other people's. We are not asked to fix what cannot be fixed, and we should be wary of tidy explanations for other people's suffering, which usually comfort the speaker more than the sufferer. We are asked to do what Mary did on that road: to show up, to stay within sight, to let the suffering person be seen without flinching. If your own sorrow feels invisible today, walk this month beside a mother who knows the road, and who does not pass by.",
        ],
        prayer: "Mother of Sorrows, walk the hard road with me.",
        closingPrayer: "Lord Jesus, Man of Sorrows, on the road to Calvary you turned toward the weeping women even while you carried the cross, and your mother's eyes met yours in the middle of the worst. I bring you the grief in me that fears it is invisible, the sorrow that asks whether it is nothing to all who pass by. Do not let me hide my face from those who suffer, and do not let shame convince me to hide my own. Give me the courage of your Sorrowful Mother, who could not take the pain away and would not look away. Stay within sight of me, Lord, as she stayed within sight of you. Amen.",
        quiz: [
          { q: "How does Isaiah 53:3 describe the suffering servant?", options: ["Honored by kings and rulers", "A stranger to grief", "Despised, rejected, a man of suffering acquainted with disease", "Hidden from all human eyes"], answer: 2 },
          { q: "In Luke 23:27-28, what does Jesus do when He sees the mourning women?", options: ["He turns and speaks to them in their grief", "He asks the soldiers to send them home", "He rebukes them for weakness", "He passes by in silence"], answer: 0 },
          { q: "What question from Lamentations 1:12 does the Church place on the lips of the Sorrowful Mother?", options: ["How long, O Lord, will you forget me?", "Where can I flee from your presence?", "Why do the nations rage?", "Is it nothing to you, all you who pass by?"], answer: 3 },
          { q: "According to the teaching, what are we asked to do for those who suffer?", options: ["Offer tidy explanations for their pain", "Show up and stay within sight, letting them be seen without flinching", "Help them move on quickly", "Keep a respectful distance until asked"], answer: 1 },
        ],
      },
      {
        n: 3,
        title: "Standing at the Cross",
        scriptures: [
          {
            ref: "John 19:25-27",
            text: "But there were standing by the cross of Jesus his mother, and his mother's sister, Mary the wife of Clopas, and Mary Magdalene. Therefore when Jesus saw his mother, and the disciple whom he loved standing there, he said to his mother, 'Woman, behold, your son!' Then he said to the disciple, 'Behold, your mother!' From that hour, the disciple took her to his own home.",
            context: "The fifth sorrow is the summit of them all: Mary standing at the cross while her Son dies. Even there, Jesus turns His mother's grief into a gift, giving her to the beloved disciple and, the Church believes, to every one of us.",
          },
          {
            ref: "Psalm 34:18",
            text: "Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.",
            context: "The psalm locates God not far from the brokenhearted but near them, closest exactly where the pain is worst. Calvary proves the verse: God's nearest presence to Mary's broken heart was her Son on the cross beside her.",
          },
          {
            ref: "Romans 12:15",
            text: "Rejoice with those who rejoice. Weep with those who weep.",
            context: "Paul gives the Church its ministry of presence in six words, asking us to enter one another's weeping rather than correct it. Mary at the cross is the first and greatest example of weeping with the One who suffered.",
          },
        ],
        teaching: [
          "John's Gospel records the fifth sorrow with a single, devastating word: standing. There were standing by the cross of Jesus his mother, her sister, and Mary Magdalene. Mary did not collapse, and she did not leave; but neither did she rescue, fix, or stop what was happening, because she could not. She stood. The Church has honored that standing for two thousand years, because it revealed that faithful presence in unbearable pain is itself a form of love as real as any action.",
          "This is a hard mercy for those of us who feel useless beside suffering we cannot fix — a spouse's depression, a child's addiction, a parent's dying, our own long recovery. The instinct is to believe that if we cannot fix it, we are failing. Calvary says otherwise. The most honored human being in Christian history spent the most important afternoon of history unable to fix anything, and her presence there was not wasted; it was the one comfort her Son's human heart could still receive.",
          "Even from the cross, Jesus would not let that presence go unanswered. Seeing His mother and the disciple He loved, He gave them to each other: behold your son; behold your mother. In its plain sense He was providing for a widow about to lose her son; the Church has always heard more, that in the beloved disciple each of us was given to Mary and Mary to us. From that hour, the Gospel says, the disciple took her to his own home. September invites us to do the same — to make room in our home, and our grief, for a mother who knows how to stand.",
          "The psalmist says Yahweh is near to those who have a broken heart, and Calvary is the proof no argument can supply: when the heart of Mary was breaking, God was not distant from her pain but dying inside it, closer than her own breath. Paul's instruction to weep with those who weep is simply this pattern handed on. We are not required to have answers for one another, and we should distrust any voice, inside or out, that says our presence is worthless because it changes nothing. Standing there is not nothing. Sometimes it is everything that love can do, and it is enough.",
        ],
        prayer: "O Mother of Sorrows, by thy anguish beneath the Cross, stand by me in my afflictions.",
        closingPrayer: "Mary, Mother of Sorrows, you stood by the cross when standing was all that love could do, and your Son counted your presence precious enough to answer it with His last strength. Teach me the vocation of staying: with the suffering I cannot fix, with the people I cannot heal, with my own long recovery that will not be hurried. When I feel useless beside pain, remind me that the Lord is near to the broken heart, and that presence is not nothing. Behold, from the cross, your Son gave you to me; let me take you into my home and my grief as the beloved disciple did. Stand by me, Mother, in my afflictions, and keep me standing with you. Amen.",
        quiz: [
          { q: "According to John 19:25, who was standing by the cross of Jesus?", options: ["His mother, his mother's sister, Mary the wife of Clopas, and Mary Magdalene", "Peter, James, and John", "The chief priests and elders", "Only the Roman soldiers"], answer: 0 },
          { q: "In John 19:26-27, what did Jesus say from the cross?", options: ["Come down and save yourselves", "It is not yet the hour", "Woman, behold, your son — and to the disciple, Behold, your mother", "Weep not for me, daughters of Jerusalem"], answer: 2 },
          { q: "According to Psalm 34:18, to whom is Yahweh near?", options: ["Those whose strength never fails", "Those who have a broken heart", "Those who dwell in the temple", "Those who keep every feast"], answer: 1 },
          { q: "What does the teaching say about presence beside suffering we cannot fix?", options: ["It is a polite gesture with little value", "It should be replaced by practical action", "It matters only when the sufferer notices", "It is itself a real form of love, and sometimes everything love can do"], answer: 3 },
        ],
      },
      {
        n: 4,
        title: "Sorrow Is Not the End",
        scriptures: [
          {
            ref: "Matthew 5:4",
            text: "Blessed are those who mourn, for they shall be comforted.",
            context: "Jesus pronounces a blessing over mourners that the world would never write, promising comfort rather than dismissal. Mary, who received her Son's body from the cross and laid Him in the tomb, is the first proof that mourning and blessedness can live in the same heart.",
          },
          {
            ref: "John 16:22",
            text: "Therefore you now have sorrow, but I will see you again, and your heart will rejoice, and no one will take your joy away from you.",
            context: "On the night before He died, Jesus told His friends that their sorrow was real but not final: I will see you again. The sixth and seventh sorrows — receiving His body and burying Him — were lived inside that promise, even when it was hardest to feel.",
          },
          {
            ref: "Revelation 21:4",
            text: "He will wipe away every tear from their eyes. Death will be no more; neither will there be mourning, nor crying, nor pain, any more. The first things have passed away.",
            context: "Scripture's final promise is not that tears never fall but that God Himself will wipe every one away. The Sorrowful Mother, now crowned in joy, is the living witness that this promise holds.",
          },
        ],
        teaching: [
          "The last two sorrows of Mary are the quietest: she received the dead body of her Son from the cross, and she saw Him laid in a tomb. Christian art returns again and again to the Pieta, the mother holding what grief has left her, because every mourner recognizes that posture. There were no words in it, no silver lining, no lesson. Some griefs can only be held, and the Church does not rush Mary past that holding, nor does it rush you.",
          "Yet Jesus had already spoken a strange blessing over exactly this condition: blessed are those who mourn, for they shall be comforted. The world calls mourners unfortunate; Jesus calls them blessed, not because pain is good but because their comfort has been personally guaranteed by God. Mourning, in this light, is not a malfunction of faith. It is love continuing to speak after loss, and it stands nearer to the kingdom than the numbness that refuses to feel anything at all.",
          "On the night before He died, Jesus told His friends: you now have sorrow, but I will see you again, and your heart will rejoice, and no one will take your joy away from you. Notice that He did not deny the sorrow or shorten it; He set a horizon beyond it. Holy Saturday still had to be lived hour by hour, and Mary lived it. Faith did not skip her past the tomb, and it will not skip us past ours; but the tomb was not the end of her story, and it is not the end of yours.",
          "Scripture closes with the promise that God will wipe away every tear, and that mourning and crying and pain will pass away with the first things. This is not a reason to hurry grief, and grief that lingers is not a failure of hope — comfort rarely arrives on our schedule, and wounds close slowly. But the direction of the story is fixed. The woman we call Our Lady of Sorrows is now the woman clothed with joy no one can take, and she waits with all seven wounds healed, ready to keep company with everyone still walking through the sorrowful part.",
        ],
        prayer: "O Mary, Mother of Sorrows and Mother of hope, pray for us.",
        closingPrayer: "Father of all comfort, your servant Mary held the body of her Son and laid Him in the tomb, and she did not stop being blessed when her arms were full of grief. Bless me in my mourning as you blessed her, and do not let me mistake sorrow for the end of the story. Keep before me the promise of your Son: I will see you again, and your heart will rejoice, and no one will take your joy away from you. Until that day, wipe what tears you will, and help me trust you with the ones that remain. Through the prayers of the Sorrowful Mother, bring me and all whom I have lost to the place where death and mourning are no more. Amen.",
        quiz: [
          { q: "In Matthew 5:4, what does Jesus promise those who mourn?", options: ["They shall forget their grief", "They shall be spared further loss", "They shall be comforted", "They shall mourn only a short time"], answer: 2 },
          { q: "In John 16:22, why will the disciples' hearts rejoice?", options: ["Because their sorrow was imaginary", "Because Jesus will see them again, and no one will take their joy away", "Because the world will finally honor them", "Because they will avoid the cross"], answer: 1 },
          { q: "According to Revelation 21:4, what will God do with every tear?", options: ["Wipe it away from their eyes", "Count it in a book", "Turn it into rain", "Leave it as a reminder"], answer: 0 },
          { q: "What does the teaching say about grief that lingers?", options: ["It shows the mourner lacks faith", "It must be resolved before prayer can resume", "It means comfort was refused", "It is not a failure of hope; comfort rarely arrives on our schedule"], answer: 3 },
        ],
      },
    ],
  },
  {
    month: 10,
    title: "The Holy Rosary",
    monthLabel: "October — The Holy Rosary",
    scriptureRef: "Luke 1:28 (World English Bible)",
    scriptureText: "Rejoice, you highly favored one! The Lord is with you. Blessed are you among women!",
    teaching: "When your mind is anxious and restless and words for prayer will not come, the Rosary gives your hands something to hold and your mind a gentle rhythm to rest in. Its quiet repetition is not a burden but a mercy, carrying you when you cannot carry yourself. It fits in a pocket, so wherever the restlessness finds you, a way to pray is already close by.",
    prayerLabel: "The Fatima Prayer",
    prayer: "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those in most need of Thy mercy.",
    novenaId: "st-therese",
    quiz: [
      { q: "In October, the Church especially honors…", options: ["The Holy Souls in Purgatory", "Our Lady of Sorrows", "The Holy Rosary", "The Immaculate Conception"], answer: 2 },
      { q: "In Luke 1:28, how is Mary greeted?", options: ["Full of grace, the Lord is with thee", "Mother of Sorrows", "Queen of Heaven", "Blessed among the apostles"], answer: 0 },
      { q: "According to the teaching, how does the Rosary help an anxious mind?", options: ["It demands perfect words", "Its repetition gives a rhythm to rest in", "It requires a church to pray", "It must be prayed silently only"], answer: 1 },
      { q: "The Fatima Prayer asks Jesus to lead all souls to Heaven, especially those who need what most?", options: ["His justice", "His mercy", "His silence", "His wealth"], answer: 1 },
    ],
    sessions: [
      {
        n: 1,
        title: "Hail Mary, Full of Grace",
        scriptures: [
          {
            ref: "Luke 1:28",
            text: "Having come in, the angel said to her, 'Rejoice, you highly favored one! The Lord is with you. Blessed are you among women!'",
            context: "This is October's headline verse and the first line of the Hail Mary: the words are Gabriel's before they are ours. Every time the Rosary is prayed, this greeting from heaven is taken up again, fifty times over, by ordinary human voices.",
          },
          {
            ref: "Luke 1:42",
            text: "She called out with a loud voice, and said, 'Blessed are you among women, and blessed is the fruit of your womb!'",
            context: "The second half of the Hail Mary's opening comes from Elizabeth, filled with the Holy Spirit at the Visitation. The prayer the Church repeats on its beads is stitched together almost entirely from Scripture itself.",
          },
          {
            ref: "Luke 1:38",
            text: "Mary said, 'Behold, the servant of the Lord; let it be done to me according to your word.' The angel departed from her.",
            context: "The Annunciation, where Mary gives her yes, is the first Joyful Mystery of the Rosary. Each decade begins here for a reason: the whole prayer is a school of saying, slowly and repeatedly, let it be done to me according to your word.",
          },
        ],
        teaching: [
          "October is devoted to the Holy Rosary, and the first thing to know about the Rosary is that its words are not a human invention laid over the Gospel; they are the Gospel, folded into a prayer. Hail Mary, full of grace, the Lord is with thee comes from the angel Gabriel at the Annunciation. Blessed art thou among women, and blessed is the fruit of thy womb comes from Elizabeth at the Visitation, spoken as Luke says with a loud voice and filled with the Holy Spirit. When you pray the Rosary you are borrowing sentences that heaven and Scripture spoke first.",
          "This matters for anyone who struggles to find words for prayer. There are seasons — of grief, of depression, of early recovery — when composing our own prayers feels impossible, and the silence where prayer used to be becomes one more accusation. The Rosary was made for exactly those seasons. It puts proven words in your mouth and beads in your hands, so that prayer can continue even when your own words have run out. You are not failing at prayer by leaning on it; you are being carried.",
          "At the center of the scene stands Mary's answer: behold, the servant of the Lord; let it be done to me according to your word. She said yes without seeing the whole road, and the Church made the Annunciation the first mystery of the Rosary so that we would rehearse that yes over and over across a lifetime of decades. Most of us cannot say a lifelong yes to God in one heroic moment. The Rosary lets us say it in small installments, one Hail Mary at a time, which is generally how real surrender happens anyway.",
          "Notice, finally, that the angel's first word to Mary is rejoice, and his second is that the Lord is with her. The Rosary begins every decade by announcing, to a person who may feel anything but favored, that God's posture toward them is greeting rather than accusation. If shame has trained you to expect condemnation whenever God comes near, let this month retrain the expectation slowly. Fifty times a day, if you pray it, the Rosary will put the other message in your ear: the Lord is with you.",
        ],
        prayer: "Hail Mary, full of grace, the Lord is with thee.",
        closingPrayer: "Father, you sent your angel to a small town with a greeting the world still has not exhausted: rejoice, the Lord is with you. Thank you for the Rosary, which puts those words in my mouth on the days I have no words of my own. Teach me, decade by decade, to make Mary's answer mine — let it be done to me according to your word — not in one heroic moment but in small daily surrenders. When shame tells me your coming means condemnation, let the repeated greeting of the angel retrain my heart. May every bead be a step toward trusting that you are truly with me. Amen.",
        quiz: [
          { q: "In Luke 1:28, what are the angel's words to Mary?", options: ["Do not be afraid, daughter of Zion", "Behold, the servant of the Lord", "Rejoice, you highly favored one! The Lord is with you", "Blessed are those who mourn"], answer: 2 },
          { q: "Where does the second part of the Hail Mary's opening ('blessed is the fruit of your womb') come from?", options: ["Elizabeth's greeting at the Visitation", "Simeon's prophecy in the temple", "The angel's words to Joseph", "Mary's own song"], answer: 0 },
          { q: "Which mystery of the Rosary is the Annunciation?", options: ["The first Sorrowful Mystery", "The last Glorious Mystery", "The second Joyful Mystery", "The first Joyful Mystery"], answer: 3 },
          { q: "According to the teaching, how does the Rosary help when your own words for prayer run out?", options: ["It replaces the need for any other prayer forever", "It puts proven words in your mouth and beads in your hands, carrying you", "It requires you to compose new prayers first", "It works only in a church building"], answer: 1 },
        ],
      },
      {
        n: 2,
        title: "Lord, Teach Us to Pray",
        scriptures: [
          {
            ref: "Luke 11:1",
            text: "When he finished praying in a certain place, one of his disciples said to him, 'Lord, teach us to pray, just as John also taught his disciples.'",
            context: "The disciples watched Jesus pray and realized prayer is something learned, not something we should already know. Every Rosary decade opens with the prayer He gave in answer, so the Rosary is quite literally praying as Jesus taught.",
          },
          {
            ref: "Matthew 6:9-13",
            text: "Pray like this: 'Our Father in heaven, may your name be kept holy. Let your Kingdom come. Let your will be done, as in heaven, so on earth. Give us today our daily bread. Forgive us our debts, as we also forgive our debtors. Bring us not into temptation, but deliver us from the evil one. For yours is the Kingdom, the power, and the glory forever. Amen.'",
            context: "The Our Father is the prayer of Jesus' own composing, and the Rosary returns to it at the head of every decade. Its petitions are strikingly daily — bread for today, forgiveness now, deliverance from the evil one — sized for people who can only manage one day at a time.",
          },
          {
            ref: "Luke 18:1",
            text: "He also spoke a parable to them that they must always pray, and not give up,",
            context: "Jesus explicitly taught persistence in prayer — praying always and not giving up — and told a parable to drive it home. The Rosary's gentle repetition is one of the Church's oldest ways of obeying that instruction with the body as well as the mind.",
          },
        ],
        teaching: [
          "The disciples had prayed all their lives, yet after watching Jesus pray they asked Him something humble: Lord, teach us to pray. It is one of the most freeing sentences in the Gospels, because it means not knowing how to pray is the normal starting point, not a disqualification. Jesus answered with the Our Father, and the Church placed that prayer at the head of every decade of the Rosary. Whoever prays the Rosary is praying, several times over, exactly the words Jesus gave when asked that question.",
          "Some people worry that the Rosary's repetition is the vain repetition Jesus warned against, but the Gospel itself distinguishes empty words from persistent ones. Jesus told a parable precisely so that His disciples would always pray and not give up, and in Gethsemane He Himself prayed the same words a second and third time. Repetition in the Rosary is not an attempt to wear God down; it is the way love lingers. Anyone who has rocked a child or repeated 'I'm here' to a frightened friend knows that saying something again is not saying it emptily.",
          "There is also a mercy in repetition for the restless mind. When thoughts race or circle, a mind cannot usually silence itself on command; but it can be given something steady to return to. The Rosary offers a rhythm for the lips, beads for the fingers, and a mystery for the imagination, engaging the whole person so the mind has somewhere to come home to each time it wanders. Wandering is not failure — every return to the words is itself a small act of prayer, and no one should be discouraged by needing to return often.",
          "Look, too, at the size of the Our Father's petitions. It does not ask for bread for the decade ahead, but for today; not for a life guaranteed free of trials, but for deliverance from the evil one in them; not for a clean record, but for forgiveness that we then hand on to those who owe us. This is prayer sized for people who can only manage one day at a time, which is to say, all of us. Prayed on the beads, morning after morning, it becomes a way of receiving each day singly from the hand of a Father, which is how days are meant to be carried.",
        ],
        prayer: "Thy will be done, on earth as it is in heaven.",
        closingPrayer: "Lord Jesus, your disciples watched you pray and asked you to teach them, and you did not shame them for needing to learn. Teach me too, for I forget how to pray more often than I care to admit. Thank you for the Our Father at the head of every decade, asking only for today's bread, today's forgiveness, today's deliverance — a prayer my one-day-at-a-time life can actually carry. When my mind wanders on the beads, let every return be counted as love, and keep me from giving up. Make the Rosary in my hands what you meant prayer to be: persistent, humble, and daily. Amen.",
        quiz: [
          { q: "In Luke 11:1, what do the disciples ask of Jesus?", options: ["Show us the Father", "Lord, teach us to pray", "Increase our faith", "Send us out two by two"], answer: 1 },
          { q: "According to Matthew 6:11, what do we ask the Father to give us today?", options: ["Wisdom for the future", "Victory over enemies", "A sign from heaven", "Our daily bread"], answer: 3 },
          { q: "In Luke 18:1, why did Jesus speak a parable to them?", options: ["That they must always pray, and not give up", "That they might judge rightly", "That they would fast twice a week", "That they would sell their possessions"], answer: 0 },
          { q: "How does the teaching answer the worry that the Rosary is vain repetition?", options: ["It admits the repetition is empty but useful", "It says only short prayers avoid vanity", "Persistent repetition is how love lingers, as Jesus Himself repeated His prayer in Gethsemane", "It recommends praying the Rosary silently to avoid the problem"], answer: 2 },
        ],
      },
      {
        n: 3,
        title: "Walking the Mysteries",
        scriptures: [
          {
            ref: "Luke 2:7",
            text: "She gave birth to her firstborn son. She wrapped him in bands of cloth, and laid him in a feeding trough, because there was no room for them in the inn.",
            context: "The Nativity, third Joyful Mystery, sets God's arrival in poverty, makeshift shelter, and closed doors. The Rosary asks us to stand inside this scene until it sinks in that there is no circumstance too poor for Christ to be born into it.",
          },
          {
            ref: "Matthew 3:17",
            text: "Behold, a voice out of the heavens said, 'This is my beloved Son, with whom I am well pleased.'",
            context: "The Baptism of the Lord, first Luminous Mystery, opens with the Father's voice naming Jesus beloved before His public work has accomplished anything. Meditating here, the Rosary lets us overhear the kind of word the Father speaks over His children.",
          },
          {
            ref: "Luke 22:41-42",
            text: "He was withdrawn from them about a stone's throw, and he knelt down and prayed, saying, 'Father, if you are willing, remove this cup from me. Nevertheless, not my will, but yours, be done.'",
            context: "The Agony in the Garden, first Sorrowful Mystery, shows Jesus praying honestly for the cup to pass and surrendering anyway. The Rosary brings us back to this olive grove whenever our own will and God's seem hardest to reconcile.",
          },
        ],
        teaching: [
          "The heart of the Rosary is not the counting but the remembering. While the lips repeat the Hail Mary, the mind is meant to dwell inside one scene of the Gospel at a time — the mysteries, Joyful, Luminous, Sorrowful, and Glorious, which together walk the whole arc of Christ's life. This is why the Rosary has been called a compendium of the Gospel. It is Scripture prayed at walking pace, slow enough for the scenes to start speaking to your own life.",
          "Consider what the mysteries actually hold. The Nativity is God born where there was no room, laid in a feeding trough because the doors were closed — a scene for everyone whose circumstances feel too poor or too chaotic for God to enter. At the Baptism, before Jesus has preached a sermon or worked a miracle, the Father's voice declares Him beloved; the mystery invites us to sit under that voice until we believe such a word could be spoken over us in Christ. These are not distant tableaux. They are rooms the Rosary lets us enter.",
          "The Sorrowful Mysteries begin in Gethsemane, and no scene in Scripture is more honest about the space between what we want and what we fear God wants. Jesus asks plainly for the cup to be removed — desire is not hidden or denied — and then hands the outcome over: not my will, but yours, be done. Anyone facing a diagnosis, an amends they dread, a surrender their recovery requires, has knelt in that grove. The Rosary returns us there weekly so that His prayer can slowly become the shape of ours.",
          "This kind of meditation is not a technique that guarantees feelings, and dry decades are normal; the saints prayed plenty of them. The point is exposure: hold your life next to His long enough, mystery by mystery, and the two stories begin to interpret each other. Your poverty meets Bethlehem, your dread meets Gethsemane, your identity meets the voice at the Jordan. Mary, who kept all these things in her heart, is the first person who ever pondered these scenes, and in the Rosary she does what mothers do with a family album: she turns the pages with you.",
        ],
        prayer: "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those in most need of Thy mercy.",
        closingPrayer: "Lord Jesus, in the mysteries of the Rosary you let me walk the whole road of your life at praying pace: the stable where no door was open, the river where the Father called you beloved, the garden where you wanted the cup taken away and trusted anyway. Lay my story alongside yours until the scenes begin to speak to each other. Give me patience with dry decades and a wandering mind, and let your mother turn the pages with me, as she once pondered every one of these things in her heart. Through her prayers, make your life the lens through which I finally understand my own. Amen.",
        quiz: [
          { q: "According to Luke 2:7, where did Mary lay the newborn Jesus, and why?", options: ["In the inn, because room was found", "In the temple, as the law required", "In a shepherd's tent, for warmth", "In a feeding trough, because there was no room for them in the inn"], answer: 3 },
          { q: "In Matthew 3:17, what does the voice from the heavens declare?", options: ["Prepare the way of the Lord", "This is my beloved Son, with whom I am well pleased", "Behold the Lamb of God", "Rise, and do not be afraid"], answer: 1 },
          { q: "In Luke 22:42, how does Jesus end His prayer in the garden?", options: ["Why have you forsaken me?", "Let this hour pass in silence", "Nevertheless, not my will, but yours, be done", "Father, glorify your name before the people"], answer: 2 },
          { q: "What does the teaching say about dry decades where feelings do not come?", options: ["They are normal, and even the saints prayed plenty of them", "They mean the Rosary should be set aside", "They show the mystery was chosen wrongly", "They only happen to beginners"], answer: 0 },
        ],
      },
      {
        n: 4,
        title: "From the Cross to the Crown",
        scriptures: [
          {
            ref: "John 19:30",
            text: "When Jesus therefore had received the vinegar, he said, 'It is finished.' He bowed his head, and gave up his spirit.",
            context: "The Crucifixion, the last Sorrowful Mystery, ends not with defeat but with a completed work: it is finished. The Rosary does not let us skip this bead, because everything the Glorious Mysteries celebrate was purchased here.",
          },
          {
            ref: "Luke 24:5-6",
            text: "Becoming terrified, they bowed their faces down to the earth. They said to them, 'Why do you seek the living among the dead? He isn't here, but is risen. Remember what he told you when he was still in Galilee,'",
            context: "The Resurrection, first Glorious Mystery, opens with a question that gently redirects grieving women toward hope: why do you seek the living among the dead? The angels' remedy for their fear is remembering what Jesus said — which is precisely what the Rosary trains us to do.",
          },
          {
            ref: "Revelation 12:1",
            text: "A great sign was seen in heaven: a woman clothed with the sun, and the moon under her feet, and on her head a crown of twelve stars.",
            context: "The Church has long seen in this crowned woman an image of Mary in glory, echoed in the final Glorious Mystery. The Rosary ends every week here on purpose: the road that began at the Annunciation truly arrives somewhere.",
          },
        ],
        teaching: [
          "The Rosary insists on praying the whole story, and that is one of its severest mercies. The Sorrowful Mysteries end at the cross, where Jesus receives the vinegar, says it is finished, and gives up His spirit. The prayer does not hurry past this bead or soften it, because the Christian hope is not that suffering is an illusion but that it has been entered, borne, and finished by God Himself. It is finished is not a cry of defeat; it is the word a workman speaks over a completed task.",
          "Then come the Glorious Mysteries, and they open with women walking to a tomb to tend a dead body — grief doing its faithful, hopeless work. The angels meet them with a question that has never stopped being asked of the human heart: why do you seek the living among the dead? Notice the remedy they prescribe for terror is memory: remember what he told you. Despair has a short memory; it forgets every promise the moment pain arrives. The Rosary is, among other things, organized remembering — a weekly circuit of what He said and did, so that on the day grief comes, hope has something to stand on.",
          "The mysteries end with Mary crowned, and Revelation's great sign — a woman clothed with the sun, the moon under her feet, twelve stars about her head — has always drawn Christian eyes toward her. The point of ending here is not decoration. The woman in glory is the same woman from the small town who said yes without seeing the road, who fled to Egypt, who stood at the cross. The Rosary ends at her crown so that we finish every praying week with evidence that the road, followed to the end, arrives somewhere.",
          "This is what October offers to anyone tempted to believe their story can only end badly. The Rosary will not promise that your sufferings are small, and it will not pretend the cross can be skipped; grace does not work by skipping. But fifteen minutes at a time, it walks you from the Annunciation to the crown and back, until the shape of the whole story gets into your bones: sorrow is real, sorrow is entered by God, and sorrow is not the ending. Keep the beads within reach. They are a map of where this road actually goes.",
        ],
        prayer: "Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope.",
        closingPrayer: "Lord Jesus, on the last bead of the Sorrowful Mysteries you say it is finished, and on the first bead of the Glorious ones the tomb is already empty. When despair shortens my memory and tells me my story can only end badly, walk me around the whole circuit again, from the Annunciation to the crown. Let the angels' question search me — why do I seek the living among the dead? — and let remembering what you said become my remedy for fear. Through the prayers of your mother, crowned at the end of the road she walked in faith, keep the beads in my hands and the whole shape of the story in my heart. Amen.",
        quiz: [
          { q: "In John 19:30, what does Jesus say before giving up His spirit?", options: ["It is finished", "Father, forgive them", "I thirst no more", "The hour has not yet come"], answer: 0 },
          { q: "In Luke 24:5, what question is asked of the women at the tomb?", options: ["Where have you laid him?", "Whom are you looking for in the garden?", "Why do you seek the living among the dead?", "Why are you weeping at this hour?"], answer: 2 },
          { q: "According to Luke 24:6, what are the women told to do about what Jesus said in Galilee?", options: ["Write it down for the apostles", "Remember it", "Keep it secret until Pentecost", "Ask Peter to explain it"], answer: 1 },
          { q: "In Revelation 12:1, how is the woman in the great sign described?", options: ["Riding on the clouds of heaven", "Holding a golden censer", "Standing beside the tree of life", "Clothed with the sun, the moon under her feet, a crown of twelve stars"], answer: 3 },
        ],
      },
    ],
  },
  {
    month: 11,
    title: "The Holy Souls in Purgatory",
    monthLabel: "November — The Holy Souls",
    scriptureRef: "2 Maccabees 12:46 (World English Bible)",
    scriptureText: "Therefore he made atonement for the dead, that they might be released from their sin.",
    teaching: "When someone we love dies, we are often left with words unsaid and goodbyes unfinished, feeling there is nothing left to do. Praying for the dead answers that helplessness: it turns mourning into an act of love we can still offer them. The bond is not severed but continues in prayer, and that is a holy and wholesome thing.",
    prayerLabel: "Eternal Rest",
    prayer: "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them. May they rest in peace. Amen.",
    novenaId: "our-lady-of-sorrows",
    quiz: [
      { q: "In November, the Church especially honors…", options: ["The Holy Rosary", "The Holy Souls in Purgatory", "The Immaculate Conception", "Our Lady of Sorrows"], answer: 1 },
      { q: "According to 2 Machabees 12:46, praying for the dead is described as what kind of thought?", options: ["A holy and wholesome thought", "A sorrowful thought", "A hidden thought", "A fearful thought"], answer: 0 },
      { q: "In the teaching, praying for the dead turns helpless mourning into what?", options: ["A duty to be endured", "An act of love we can still offer", "A reason to forget them", "A private secret"], answer: 1 },
      { q: "The Eternal Rest prayer asks the Lord to let what shine upon them?", options: ["Perpetual light", "Endless silence", "His justice", "A gentle rain"], answer: 0 },
    ],
    sessions: [
      {
        n: 1,
        title: "Grief That Dares to Hope",
        scriptures: [
          {
            ref: "Psalm 34:18",
            text: "Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.",
            context: "November opens with the Church remembering her dead, and it begins where grief actually lives: in the broken heart. Before this month says anything about purgatory or prayer, it says that God draws near to mourners rather than standing back from them.",
          },
          {
            ref: "John 11:35",
            text: "Jesus wept.",
            context: "At the tomb of His friend Lazarus, knowing what He was about to do, Jesus still wept. The month of the Holy Souls carries this permission within it: tears for the dead are not a failure of faith, because the Lord of life shed them first.",
          },
          {
            ref: "1 Thessalonians 4:13-14",
            text: "But we don't want you to be ignorant, brothers, concerning those who have fallen asleep, so that you don't grieve like the rest, who have no hope. For if we believe that Jesus died and rose again, even so God will bring with him those who have fallen asleep in Jesus.",
            context: "Paul does not tell the Thessalonians not to grieve; he tells them not to grieve without hope. That distinction is the heart of November: sorrow and hope walk together, because those who have fallen asleep in Jesus are not lost.",
          },
        ],
        teaching: [
          "In November the Church turns her heart toward the Holy Souls, beginning with the feast of All Souls on the second day of the month. Before any doctrine is explained, something simpler must be said to everyone who mourns: God is near to the broken heart. The psalmist does not describe a God who waits at a polite distance until we compose ourselves. He describes a God who moves closer precisely when the heart is crushed.",
          "The shortest verse in Scripture is also one of the most consoling: Jesus wept. He stood at the tomb of Lazarus knowing full well that in a few moments He would call His friend back to life, and still He wept with the mourners. Grief, then, cannot be a failure of faith, because perfect faith stood at a grave and cried. If you have been told, or have told yourself, that a real believer should be over it by now, the Gospel says otherwise.",
          "Saint Paul gives grief its Christian shape in one careful sentence: do not grieve like those who have no hope. Notice what he does not say. He does not forbid grieving; he forbids grieving as though death had the last word, because Jesus died and rose, and God will bring with Him those who have fallen asleep in Him. Christian mourning is real sorrow with a horizon in it.",
          "For anyone carrying loss alongside anxiety, addiction, or old regret, grief can feel like one weight too many, and the temptation is either to numb it or to hurry it. This month asks for neither. The Church gives us a whole month rather than a single day, because mourning keeps its own slow calendar, and love is not embarrassed by tears. You may grieve at your own pace, in the company of the whole Church, with a hope that does not cancel the sorrow but carries it.",
        ],
        prayer: "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them.",
        closingPrayer: "Lord Jesus, You stood at the tomb of Your friend and wept, and so You have made my tears an acceptable prayer. In this month of the Holy Souls, draw near to my broken heart as You promised, and let me grieve for those I love without shame and without despair. Give me the hope of Your resurrection, not as a reason to stop mourning, but as a light to mourn by. Hold the ones I miss in Your mercy until the day of reunion, and hold me steady in the meantime. Amen.",
        quiz: [
          { q: "According to Psalm 34:18, who is Yahweh near to?", options: ["Those who have great strength", "Those who have kept every commandment", "Those who have a broken heart", "Those who hide their sorrow"], answer: 2 },
          { q: "What does John 11:35 record Jesus doing at the tomb of Lazarus?", options: ["Weeping", "Rebuking the mourners", "Leaving quietly", "Singing a psalm"], answer: 0 },
          { q: "In 1 Thessalonians 4:13, Paul says not to grieve like those who have no what?", options: ["Strength", "Hope", "Friends", "Patience"], answer: 1 },
          { q: "What does the teaching say about tears for the dead?", options: ["They show weak faith", "They should be hidden from others", "They must end by All Souls' Day", "They are not a failure of faith, because Jesus wept first"], answer: 3 },
        ],
      },
      {
        n: 2,
        title: "Love That Continues",
        scriptures: [
          {
            ref: "2 Maccabees 12:46",
            text: "Therefore he made atonement for the dead, that they might be released from their sin.",
            context: "After a battle, Judas Maccabeus took up a collection and offered sacrifice for his fallen soldiers, convinced that the dead could still be helped. This is November's headline verse: the ancient conviction that prayer for the dead is not wasted breath but real love, still doing real good.",
          },
          {
            ref: "Psalm 130:1-4",
            text: "Out of the depths I have cried to you, Yahweh. Lord, hear my voice. Let your ears be attentive to the voice of my petitions. If you, Yah, kept a record of sins, Lord, who could stand? But there is forgiveness with you, therefore you are feared.",
            context: "This psalm, the De Profundis, has been prayed for the dead by the Church for many centuries. It is honest that no one could stand on their own record, and confident that with God there is forgiveness deeper than any depths.",
          },
          {
            ref: "2 Timothy 1:16-18",
            text: "May the Lord grant mercy to the house of Onesiphorus, for he often refreshed me, and was not ashamed of my chain, but when he was in Rome, he sought me diligently, and found me (the Lord grant to him to find the Lord's mercy in that day); and in how many things he served at Ephesus, you know very well.",
            context: "Paul remembers a friend in the past tense and asks the Lord to grant him mercy 'in that day' — a prayer that reaches beyond the present life toward judgment. The Church has long heard here an apostle doing exactly what November invites: entrusting a loved one to mercy by name.",
          },
        ],
        teaching: [
          "When someone we love dies, we are often left holding words we never said: an apology, a thank you, a goodbye that never quite happened. The helplessness of that is one of grief's sharpest edges, and it is exactly the edge this month's devotion answers. In the second book of Maccabees, Judas made atonement for his fallen men, that they might be released from their sin. The conviction underneath his act is the conviction of this whole month: the dead can still be helped, and love can still do something.",
          "The Church names this reality the communion of saints. Death changes a relationship, but it does not sever it, because both the living and the dead are held in the one Body of Christ. When we pray the Eternal Rest for someone, we are not talking into the air; we are continuing to love a person who still exists and whom God still holds. Praying for the dead turns mourning from pure helplessness into an act of love we can still offer.",
          "Psalm 130 shows what that prayer sounds like. It begins in the depths, admits that no one could stand if God kept a strict record, and then plants its feet on a single fact: there is forgiveness with you. To pray this psalm for our dead is to be honest about their humanity, as we are about our own, and to entrust them to a mercy that goes deeper than the worst depths. Saint Paul does something similar for his friend Onesiphorus, asking that he find the Lord's mercy in that day.",
          "If you carry regret about things left unsaid, this session is meant for you. Prayer for the dead is not pretending the conversation ended well, and it is not a transaction that buys anything from God. It is the conversation continuing in God's presence: every Mass offered, every Eternal Rest whispered on a walk or in a waiting room, is something you can still do for them. The bond is not severed, and neither is your chance to love them well.",
        ],
        prayer: "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them. May they rest in peace. Amen.",
        closingPrayer: "Father of mercy, I bring You the ones I love who have gone before me, and with them I bring the words I never got to say. You heard Judas Maccabeus make atonement for his fallen men, and You heard Paul ask mercy for his friend; hear me now as I ask the same for mine. Out of the depths I cry to You, trusting that with You there is forgiveness, and that my love for them still has somewhere to go. Let my mourning become intercession, and my helplessness become hope. Eternal rest grant unto them, O Lord, and let perpetual light shine upon them. Amen.",
        quiz: [
          { q: "According to 2 Maccabees 12:46, why did he make atonement for the dead?", options: ["So their names would be remembered", "That they might be released from their sin", "To win the next battle", "To fulfill a public vow"], answer: 1 },
          { q: "In 2 Timothy 1:18, what does Paul ask the Lord to grant Onesiphorus?", options: ["Safe travel to Rome", "Freedom from his chain", "A long life", "To find the Lord's mercy in that day"], answer: 3 },
          { q: "Psalm 130 begins with a cry from where?", options: ["Out of the depths", "The city gates", "The mountaintop", "The temple courts"], answer: 0 },
          { q: "According to the teaching, praying for the dead is best described as what?", options: ["A way to change the past", "A private superstition", "Love that continues to act, because the bond is not severed", "A duty that replaces grieving"], answer: 2 },
        ],
      },
      {
        n: 3,
        title: "Saved, but as Through Fire",
        scriptures: [
          {
            ref: "1 Corinthians 3:13-15",
            text: "each man's work will be revealed. For the Day will declare it, because it is revealed in fire; and the fire itself will test what sort of work each man's work is. If any man's work remains which he built on it, he will receive a reward. If any man's work is burned, he will suffer loss, but he himself will be saved, but as through fire.",
            context: "Paul pictures a Day when everything we built is tested, and a man whose work burns is nevertheless saved, but as through fire. The Catholic tradition has long heard in this image the purification the Church calls purgatory: not condemnation, but the finishing of grace in a soul already saved.",
          },
          {
            ref: "Malachi 3:3",
            text: "and he will sit as a refiner and purifier of silver, and he will purify the sons of Levi, and refine them as gold and silver; and they shall offer to Yahweh offerings in righteousness.",
            context: "A refiner sits patiently over silver, removing only the dross, and stops when the metal is pure. That is the fire of this month's teaching: not the fire of rejection, but the patient love of a craftsman who will not quit until what he loves shines.",
          },
          {
            ref: "Revelation 21:27",
            text: "There will in no way enter into it anything profane, or one who causes an abomination or a lie, but only those who are written in the Lamb's book of life.",
            context: "Heaven's holiness is total: nothing stained can enter, and nothing stained could bear its joy. Purgatory is God's mercy bridging that gap, making the souls written in the Lamb's book fully ready for the city they are certainly going to enter.",
          },
        ],
        teaching: [
          "It helps to say plainly what the Church actually teaches about purgatory, because caricatures abound. Those who die in God's friendship, but still imperfectly purified, undergo a purification after death so that they can enter the joy of heaven. Purgatory is not a second chance for those who finally refused God, and it is not a lesser hell with a timer. Every soul there is saved, loved, and certain of heaven; what remains is not the question of salvation but the completing of holiness.",
          "Saint Paul gives the tradition its most famous image. On the Day of the Lord, each one's work is tested by fire; the shoddy work burns, and yet the builder himself is saved, but as through fire. Something true is being said here about all of us: we build our lives out of a mixture of gold and straw, love and selfishness, and before the joy of heaven can be complete, what is untrue in us has to go. The fire in this picture destroys nothing that was ever really worth keeping.",
          "Malachi shows the heart behind the fire. The refiner sits, patient and attentive, over the silver, removing dross until the metal is pure, and tradition adds that a refiner knows the work is done when he can see his reflection in it. Revelation says that nothing profane can enter the holy city; this is not God being fussy, but the simple fact that perfect joy requires a heart able to bear it. God does not leave His work in us half finished, and purgatory is His faithfulness carrying it through to the end.",
          "If you are in recovery, this teaching may feel strangely familiar, because you already know that real healing can burn on the way to making you whole: honesty hurts before it frees, and letting go of an old habit can feel like losing a limb that was killing you. The fire of purification, in this life or the next, is that same severe mercy. And here November's two threads meet: our prayers, our Masses, and our small offered sacrifices genuinely help the holy souls in their purification. The Church on earth gets to assist the Church being made ready, which means your prayers this month are not sentiment; they are aid.",
        ],
        prayer: "May the souls of the faithful departed, through the mercy of God, rest in peace. Amen.",
        closingPrayer: "Lord God, refiner and purifier, You do not abandon Your work in us half finished, in this life or beyond it. I entrust to You the holy souls being made ready for the city where nothing stained can enter, and I ask You to count my prayers and small sacrifices this month as aid for them. Teach me not to fear Your purifying love, for it burns away only what was never really me. Finish in me, and in those I love who have died, everything Your grace has begun, until we can bear the full weight of Your joy. Amen.",
        quiz: [
          { q: "According to this session, purgatory is best described as what?", options: ["A second chance for those who refused God", "A lesser hell that lasts forever", "A place of uncertainty about salvation", "The purification of those who die in God's friendship"], answer: 3 },
          { q: "In 1 Corinthians 3:15, what happens to the man whose work is burned?", options: ["He himself will be saved, but as through fire", "He is shut out of the city", "He must rebuild his work forever", "He receives a reward anyway"], answer: 0 },
          { q: "In Malachi 3:3, the Lord is pictured as what?", options: ["A judge with scales", "A shepherd counting sheep", "A refiner and purifier of silver", "A watchman on the walls"], answer: 2 },
          { q: "According to Revelation 21:27, what will in no way enter the holy city?", options: ["The poor in spirit", "Anything profane", "Those written in the Lamb's book of life", "The nations of the earth"], answer: 1 },
        ],
      },
      {
        n: 4,
        title: "The Hope of Reunion",
        scriptures: [
          {
            ref: "John 11:25-26",
            text: "Jesus said to her, 'I am the resurrection and the life. He who believes in me will still live, even if he dies. Whoever lives and believes in me will never die. Do you believe this?'",
            context: "Jesus speaks these words not to a crowd but to Martha, a grieving sister standing near her brother's tomb. November ends where her conversation with Him ends: with resurrection offered gently to a mourner, and a question each of us is allowed to answer slowly.",
          },
          {
            ref: "Revelation 21:4",
            text: "He will wipe away every tear from their eyes. Death will be no more; neither will there be mourning, nor crying, nor pain, any more. The first things have passed away.",
            context: "The promise is strikingly personal: God Himself wipes the tears, the way a parent does. Mourning is real now, but it has an ending written into it — not because grief was wrong, but because the thing that caused it will be undone.",
          },
          {
            ref: "Romans 8:38-39",
            text: "For I am persuaded that neither death, nor life, nor angels, nor principalities, nor things present, nor things to come, nor powers, nor height, nor depth, nor any other created thing, will be able to separate us from God's love, which is in Christ Jesus our Lord.",
            context: "Paul puts death first on the list of things that cannot separate us from God's love. And if the dead in Christ and the living in Christ are both held in that one love, then even now we are not as separated from each other as the silence makes it feel.",
          },
        ],
        teaching: [
          "The month of the Holy Souls does not end in the graveyard; it ends at a promise. When Jesus met Martha in her grief, He did not begin with an explanation of why her brother died. He gave her Himself: I am the resurrection and the life. Then He asked her, gently, do you believe this? He asks mourners the same question still, and He is patient with answers that come slowly, through tears.",
          "Revelation dares to describe the far side of grief. God will wipe away every tear from their eyes, and death will be no more; neither will there be mourning, nor crying, nor pain. Notice that the promise does not shame our tears; it presumes them, and it puts them in God's own hand. Mourning is honored as real, and then it is given an expiration, because the thing that causes it is going to be undone.",
          "Saint Paul, listing everything that might cut us off from God's love, puts death at the front of the line and declares it powerless. Here is the quiet logic of Christian reunion: if death cannot separate your beloved dead from the love of God in Christ, and it cannot separate you from that same love, then the two of you are still held in one embrace. The communion of saints is not a metaphor. It is the reason we may speak of seeing them again without pretending or grasping.",
          "So this is how the month closes: keep praying for your dead, because love that continues is love that helps, and let the hope of reunion do its slow work on your grief. Hope does not erase sorrow, and no one should tell you it must; it softens sorrow's edges and gives it somewhere to go. In the meantime there is a life to live, one day at a time, in the company of a God whom not even death can pull away from you. Eternal rest grant unto them, O Lord, and let perpetual light shine upon them.",
        ],
        prayer: "Jesus, resurrection and life, keep my beloved dead in Your mercy, and keep me in Your hope.",
        closingPrayer: "Lord Jesus, resurrection and life, You met Martha in her grief and gave her not an explanation but Yourself. As this month of the Holy Souls closes, I entrust to You everyone I love who has died, and I answer Your question as honestly as I can: Lord, I believe; help my unbelief. Wipe the tears You have promised to wipe, in Your own time, and until then let hope keep company with my sorrow. Hold them and hold me in the one love that death cannot separate, and bring us, purified and rejoicing, to the morning where every goodbye is over. Amen.",
        quiz: [
          { q: "In John 11:25, Jesus tells Martha, 'I am the resurrection and the...'", options: ["life", "judgment", "kingdom", "covenant"], answer: 0 },
          { q: "According to Revelation 21:4, what will God wipe away?", options: ["The record of every sin", "The memory of the dead", "Every tear from their eyes", "The names in the book"], answer: 2 },
          { q: "In Romans 8:38-39, what is the first thing Paul lists that cannot separate us from God's love?", options: ["Angels", "Death", "Things to come", "Height and depth"], answer: 1 },
          { q: "How does the teaching describe the hope of reunion?", options: ["A guarantee that grief ends quickly", "A reason to stop praying for the dead", "A private feeling with no real basis", "A hope that softens sorrow without erasing it, grounded in the love death cannot break"], answer: 3 },
        ],
      },
    ],
  },
  {
    month: 12,
    title: "The Immaculate Conception",
    monthLabel: "December — The Immaculate Conception",
    scriptureRef: "Isaiah 7:14 (World English Bible)",
    scriptureText: "Behold, the virgin will conceive, and bear a son, and shall call his name Immanuel.",
    teaching: "Advent is a long season of waiting in the dark, which is exactly where hopelessness likes to settle. But the promise of Immanuel means God with us: He chose to enter human waiting rather than watch it from a distance. If you feel alone in the dark right now, this is the whole point of the season, that God comes to be with you there.",
    prayerLabel: "A Marian aspiration",
    prayer: "O Mary, conceived without sin, pray for us who have recourse to thee.",
    novenaId: "three-hail-marys",
    quiz: [
      { q: "In December, the Church especially honors…", options: ["The Immaculate Conception", "The Holy Souls in Purgatory", "The Holy Rosary", "Our Lady of Sorrows"], answer: 0 },
      { q: "In Isaiah 7:14, what name shall the son be called?", options: ["Jesus", "Immanuel", "Messiah", "Wonderful"], answer: 1 },
      { q: "According to the teaching, what does the name Immanuel mean?", options: ["God is far", "God with us", "God the judge", "God alone"], answer: 1 },
      { q: "The Marian aspiration addresses Mary as conceived how?", options: ["In sorrow", "In glory", "Without sin", "In secret"], answer: 2 },
    ],
    sessions: [
      {
        n: 1,
        title: "Waiting in the Dark",
        scriptures: [
          {
            ref: "Isaiah 9:2",
            text: "The people who walked in darkness have seen a great light. Those who lived in the land of the shadow of death, on them the light has shined.",
            context: "Advent begins by taking darkness seriously: Isaiah names a people who walked in it for a long time before any light appeared. December's devotion starts here, with the honest admission of the dark, and the promise that it is not the end of the story.",
          },
          {
            ref: "Psalm 130:5-6",
            text: "I wait for Yahweh. My soul waits. I hope in his word. My soul longs for the Lord more than watchmen long for the morning; more than watchmen for the morning.",
            context: "A watchman cannot make the morning come, but he also knows it is certain, so his waiting is watchful rather than hopeless. That is the exact shape of Advent hope: not a mood we manufacture, but a confidence about what is coming.",
          },
          {
            ref: "Lamentations 3:22-24",
            text: "It is because of Yahweh's loving kindnesses that we are not consumed, because his compassion doesn't fail. They are new every morning. Great is your faithfulness. 'Yahweh is my portion,' says my soul. 'Therefore I will hope in him.'",
            context: "These verses about mercies new every morning come from a book written in the middle of ruins, not after they were repaired. Hope in December works the same way: it is spoken from inside the dark, one morning at a time.",
          },
        ],
        teaching: [
          "The Church deliberately begins her year in the dark. Advent opens in the shortest, dimmest weeks, and she lights her candles one at a time rather than all at once. For many people December is genuinely hard: grief is sharper at the holidays, loneliness is louder, and the pressure to feel festive can make a heavy heart feel like a personal failure. Advent asks for none of that. It is a season built for people who are waiting, not for people who have already arrived.",
          "Isaiah speaks of a people who walked in darkness, and the verb matters: they were still walking. They had not seen the light yet, and they kept moving anyway, and it was to people in exactly that condition that the great light came. God's promises in Scripture are rarely delivered to people whose lives are in order. They are delivered mid-darkness, to people who would have to take them on trust.",
          "The psalmist gives waiting its best image: watchmen longing for the morning. A watchman does not hurry the sunrise, and he does not doubt it either; his whole posture says that what he waits for is certain even though he cannot see it yet. Lamentations, written amid the ruins of Jerusalem, adds the daily rhythm: God's mercies are new every morning. Not one large delivery of mercy to be rationed out, but a fresh supply at every daybreak.",
          "If you are in recovery, you already know this way of living: one day at a time, trusting that the mornings will keep coming. Advent dignifies that rhythm and makes it the whole Church's rhythm for a month. You are not behind because your heart is not yet merry; you are simply in Advent, where waiting is the work. And in the middle of the season, on December 8, the feast of the Immaculate Conception shines like a lamp lit early — proof that God prepares His light long before it dawns.",
        ],
        prayer: "Come, Lord Jesus.",
        closingPrayer: "Lord God, You are faithful to people who are still walking in the dark, and Your mercies are new every single morning. Teach me to wait for You this Advent the way a watchman waits for the morning: unable to hurry the light, and unable to doubt it. When December presses on old wounds and loneliness speaks loudly, keep me moving one day at a time. Through the prayers of Mary, conceived without sin, prepare my heart for the light You are already sending. Come, Lord Jesus. Amen.",
        quiz: [
          { q: "In Isaiah 9:2, what have the people who walked in darkness seen?", options: ["A new king's army", "A great light", "The end of their exile", "A sign in the temple"], answer: 1 },
          { q: "In Psalm 130:6, the soul longs for the Lord more than watchmen long for what?", options: ["Their relief", "The city gates", "Their wages", "The morning"], answer: 3 },
          { q: "According to Lamentations 3:22-23, when are Yahweh's loving kindnesses new?", options: ["Every morning", "Once a year", "At the end of time", "Only in the temple"], answer: 0 },
          { q: "Why is the watchman a fitting image of Advent hope, according to the teaching?", options: ["He makes the morning come by his effort", "He gives up when the night is long", "He waits for something certain, though he cannot hurry it", "He watches only for enemies"], answer: 2 },
        ],
      },
      {
        n: 2,
        title: "God With Us",
        scriptures: [
          {
            ref: "Isaiah 7:14",
            text: "Therefore the Lord himself will give you a sign. Behold, the virgin will conceive, and bear a son, and shall call his name Immanuel.",
            context: "This is December's headline verse, first spoken to a frightened king in a moment of national dread. God's chosen sign against fear is not an army or an argument but a child whose very name means God is with us.",
          },
          {
            ref: "Matthew 1:22-23",
            text: "Now all this has happened, that it might be fulfilled which was spoken by the Lord through the prophet, saying, 'Behold, the virgin shall be with child, and shall give birth to a son. They shall call his name Immanuel'; which is, being interpreted, 'God with us.'",
            context: "Matthew reaches back to Isaiah and translates the name so no one can miss it: God with us. The whole Gospel is framed by this presence, opening with Immanuel and closing with Jesus' promise to be with His own always.",
          },
          {
            ref: "John 1:14",
            text: "The Word became flesh, and lived among us. We saw his glory, such glory as of the one and only Son of the Father, full of grace and truth.",
            context: "John says the Word did not merely visit us; He became flesh and lived among us, taking on human hunger, weariness, and grief. God-with-us is not a sentiment for December but a fact about how far God was willing to come.",
          },
        ],
        teaching: [
          "The sign of Isaiah 7:14 was not given in a peaceful hour. King Ahaz was terrified, with enemy armies gathering against Jerusalem, and God's answer to his dread was strange by any military standard: behold, the virgin will conceive and bear a son, and his name will be Immanuel. God's remedy for fear, then as now, is not first a change of circumstances but a Presence inside them. The name is the promise: God is with us.",
          "Matthew will not let the meaning stay hidden in Hebrew; he translates it for every reader — God with us. It is worth noticing that his Gospel is framed by this one idea. It opens with a child named Immanuel and closes with the risen Jesus saying He is with His own always, even to the end of the age. Everything between those two points is what God-with-us looks like when it walks around: touching lepers, eating with sinners, weeping at tombs.",
          "John states the mystery at its greatest depth: the Word became flesh and lived among us. The old translations say He pitched His tent among us, the way a traveler settles in beside other travelers. This means God did not observe human waiting, hunger, temptation, and grief from a safe distance and then send advice. He entered them. Whatever dark room you are sitting in this Advent, it is a room He has chosen to be in with you.",
          "For anyone who dreads December — the empty chair at the table, the gatherings that sting, the nights that feel longer than they are — Immanuel is the season's whole point. God-with-us does not mean every problem dissolves, and no honest teacher will promise you that. It means you are not alone in the problem: not in the meeting, not in the waiting room, not in the 3 a.m. silence. His presence does not depend on your feeling it, any more than the dawn depends on the watchman's mood; it is simply, stubbornly there.",
        ],
        prayer: "Come, Lord Jesus, and be God-with-us in our darkness.",
        closingPrayer: "Immanuel, God with us, You answered a frightened king with the promise of a child, and You answer my fear the same way: not from a distance, but by coming close. Word made flesh, You pitched Your tent among travelers like me; make Your home in the rooms of my life I am most ashamed of and most alone in. When I cannot feel Your presence, let me trust it the way a watchman trusts the dawn. Through the prayers of Mary, conceived without sin, who carried You into the world, teach me to carry You into mine. Amen.",
        quiz: [
          { q: "In Isaiah 7:14, what name shall the virgin's son be called?", options: ["Jesus", "Wonderful Counselor", "Immanuel", "Prince of Peace"], answer: 2 },
          { q: "How does Matthew 1:23 interpret the name Immanuel?", options: ["God with us", "God saves", "God is light", "God remembers"], answer: 0 },
          { q: "According to John 1:14, what did the Word do?", options: ["Remained in heaven", "Spoke through prophets only", "Appeared as a vision", "Became flesh and lived among us"], answer: 3 },
          { q: "To whom was the sign of Isaiah 7:14 first spoken, according to the teaching?", options: ["A shepherd in Bethlehem", "A frightened king in a time of dread", "A priest in the temple", "A crowd at the Jordan"], answer: 1 },
        ],
      },
      {
        n: 3,
        title: "Conceived Without Sin",
        scriptures: [
          {
            ref: "Genesis 3:15",
            text: "I will put hostility between you and the woman, and between your offspring and her offspring. He will bruise your head, and you will bruise his heel.",
            context: "In the very moment of the fall, before pronouncing any sentence on Adam and Eve, God announces His counter-move: a woman and her offspring at total enmity with the serpent. The tradition hears in this first promise the earliest hint of Mary and her Son, and of a woman over whom sin would never hold sway.",
          },
          {
            ref: "Luke 1:28-30",
            text: "Having come in, the angel said to her, 'Rejoice, you highly favored one! The Lord is with you. Blessed are you among women!' But when she saw him, she was greatly troubled at the saying, and considered what kind of salutation this might be. The angel said to her, 'Don't be afraid, Mary, for you have found favor with God.'",
            context: "The angel greets Mary by her grace before she has said or done anything — the favor is already there, God's gift going ahead of her. The Immaculate Conception says the same thing at full volume: grace reached Mary first, from the very beginning of her existence.",
          },
          {
            ref: "Luke 1:46-49",
            text: "Mary said, 'My soul magnifies the Lord. My spirit has rejoiced in God my Savior, for he has looked at the humble state of his servant. For behold, from now on, all generations will call me blessed. For he who is mighty has done great things for me. Holy is his name.'",
            context: "Mary calls God her Savior, which means the Immaculate Conception never claims she needed no saving. It claims she was saved in the most complete way possible — preserved by Christ's merits from the first instant — and her whole song gives the credit to God.",
          },
        ],
        teaching: [
          "December's devotion centers on a dogma that is often misunderstood, so it is worth stating carefully. The Immaculate Conception, defined by Pope Pius IX in 1854, teaches that Mary, from the first moment of her own conception, was preserved free from original sin by a singular grace of God, in view of the merits of Jesus Christ. Notice that it is about Mary's conception in the womb of her mother, not about the virginal conception of Jesus. From her first instant, grace was there before sin could be.",
          "Scripture's first hint of this comes at the darkest moment in Genesis. Sin has just entered the world, and God, before saying anything else, promises hostility between the serpent and the woman, and between his offspring and hers. The Church has long seen in that woman and her offspring a first sketch of Mary and Christ. It matters that the promise is spoken inside the ruins of the fall itself: God's answer to sin was already being prepared while the wound was still fresh.",
          "Some worry that the dogma makes Mary an exception to the rule that everyone needs Christ, but Mary herself settles the question in her Magnificat: my spirit has rejoiced in God my Savior. She needed a Savior and had one; the difference lies in how the saving happened. The rest of us are lifted out of the pit after we have fallen in; Mary was caught before she fell. Both are rescues, both are pure gift, and both are the work of the same Cross.",
          "Here is why this matters to a heart that feels permanently marked by its history: the Immaculate Conception is proof that grace is stronger than sin at every point of a human life, first moment included. The grace that preserved Mary is the same grace that restores you — in absolution, in a hard-won day of sobriety, in the slow mending of a mind that has known despair. God is not limited to damage control; He is the author of new beginnings, and He was planning yours before you knew you needed it. That is why the Church puts this feast in Advent, in the dark, on the way to Christmas.",
        ],
        prayer: "O Mary, conceived without sin, pray for us who have recourse to thee.",
        closingPrayer: "Father of mercies, in the first instant of Mary's life Your grace was already there, ahead of sin, ahead of fear, ahead of everything. I praise You for her Immaculate Conception, and for what it proves: that no history is too far gone for You, because You are the author of beginnings. Where sin reached me early, let grace reach deeper still; where I feel permanently marked, show me what Your mercy can restore. With Mary I magnify You, and with her I rejoice in God my Savior. O Mary, conceived without sin, pray for us who have recourse to thee. Amen.",
        quiz: [
          { q: "What does the dogma of the Immaculate Conception actually teach?", options: ["That Jesus was conceived of a virgin", "That Mary was preserved from original sin from the first moment of her conception", "That Mary never needed a Savior", "That Mary was born in heaven"], answer: 1 },
          { q: "In Genesis 3:15, God puts hostility between the serpent and whom?", options: ["The angels", "The nations", "The woman and her offspring", "The kings of the earth"], answer: 2 },
          { q: "In Luke 1:47, Mary rejoices in God her what?", options: ["Savior", "Judge", "Lawgiver", "King of armies"], answer: 0 },
          { q: "How does the teaching explain the way Mary was saved?", options: ["By her own merits", "She did not need saving", "By keeping the law of Moses perfectly", "In advance, by the merits of Christ — preserved rather than restored"], answer: 3 },
        ],
      },
      {
        n: 4,
        title: "A Sign in the Heavens",
        scriptures: [
          {
            ref: "Revelation 12:1",
            text: "A great sign was seen in heaven: a woman clothed with the sun, and the moon under her feet, and on her head a crown of twelve stars.",
            context: "The Church sees in this radiant woman both Mary and the Church itself, crowned and clothed in light. The sign appears while the dragon of the same chapter still rages, which is the point: God shows the victory in the middle of the conflict, not after it.",
          },
          {
            ref: "Zephaniah 3:17",
            text: "Yahweh, your God, is among you, a mighty one who will save. He will rejoice over you with joy. He will calm you in his love. He will rejoice over you with singing.",
            context: "For anyone who feels merely tolerated, this verse is a correction from God Himself: He rejoices over His people with singing and calms them in His love. God-with-us, December's great theme, turns out to be a delighted presence, not a grudging one.",
          },
          {
            ref: "Luke 1:45",
            text: "Blessed is she who believed, for there will be a fulfillment of the things which have been spoken to her from the Lord!",
            context: "Elizabeth blesses Mary not for what she has seen but for what she has believed, months before any promise was visible. This is the faith Advent asks of us: trusting a fulfillment that is on its way, while the waiting is still dark.",
          },
        ],
        teaching: [
          "Near the end of Scripture, John sees a great sign in heaven: a woman clothed with the sun, the moon under her feet, a crown of twelve stars on her head. The Church has always seen in her both Mary, glorified, and the whole people of God. But read the rest of the chapter and you find the sign does not appear in a peaceful sky; the dragon is right there, raging. God's way of encouraging His people is to show them the victory while the battle is still loud — Mary crowned is a preview of where the whole story is going.",
          "Zephaniah says something about God that many wounded hearts have never once dared to believe: Yahweh your God is among you; He will rejoice over you with joy; He will calm you in His love; He will rejoice over you with singing. Not tolerate you, not put up with you until you improve — rejoice over you, the way a parent sings over a child. If December leaves you feeling like the person nobody would miss at the party, this verse is addressed to you, and it outranks the feeling.",
          "Elizabeth's blessing over Mary names the virtue that holds Advent together: blessed is she who believed, for there will be a fulfillment of the things spoken to her from the Lord. When Elizabeth said this, nothing was visible yet; Mary was blessed for trusting a promise still hidden. Mary conceived without sin was not spared the ordinary months of waiting, the long road to Bethlehem, or the confusion of events she could not control. Her greatness was to keep believing that the fulfillment was coming.",
          "So the month ends the way Advent itself ends: not at a courtroom but at a crib, with a God who came near because He wanted to. Take the sign with you — the woman clothed with the sun is proof that grace wins, and that a human life fully open to God ends crowned, not condemned. Keep the small practices of these weeks: the short aspiration when fear rises, the one-day-at-a-time waiting, the honest prayer in the dark. And walk the last steps to Christmas with Mary, conceived without sin, who knows the road and rejoices to walk it with you.",
        ],
        prayer: "Hail Mary, full of grace, the Lord is with thee.",
        closingPrayer: "Lord God, You placed a great sign in the heavens while the dragon still raged: a woman clothed with the sun, crowned with stars, Your promise that grace has the last word. When the conflict in my own life is loud, lift my eyes to that sign. Let me believe, with Mary, that there will be a fulfillment of the things You have spoken, and let me hear, beneath the noise of December, that You rejoice over me with singing. Bring me to Christmas with her hand in mine, waiting in hope for God-with-us. Amen.",
        quiz: [
          { q: "In Revelation 12:1, the woman is clothed with what?", options: ["White linen", "The stars of heaven", "A royal robe", "The sun"], answer: 3 },
          { q: "According to Zephaniah 3:17, what will Yahweh do over you?", options: ["Keep silent watch", "Rejoice over you with singing", "Set a guard of angels", "Write your name in a book"], answer: 1 },
          { q: "In Luke 1:45, why does Elizabeth call Mary blessed?", options: ["Because she believed the Lord's promises would be fulfilled", "Because she was of royal descent", "Because she had already seen the child born", "Because she traveled a great distance"], answer: 0 },
          { q: "According to the teaching, when does the great sign of Revelation 12 appear?", options: ["After every conflict has ended", "Only at the end of time", "While the conflict still rages, as hope in the middle of it", "Before the woman was created"], answer: 2 },
        ],
      },
    ],
  },
];

export function currentMonthlyDevotion(d: Date = new Date()): MonthlyDevotion {
  const m = d.getMonth() + 1;
  return (
    MONTHLY_DEVOTIONS.find((x) => x.month === m) ??
    MONTHLY_DEVOTIONS.find((x) => x.month === 7)!
  );
}

/** Period key for the quiz leaderboard, e.g. "2026-07". */
export function periodKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * The month's learning-module sessions. If a month has authored `sessions`,
 * use them; otherwise derive a single session from its summary fields so every
 * month still has a working module (to be deepened later).
 */
export function moduleSessions(d: MonthlyDevotion): ModuleSession[] {
  if (d.sessions && d.sessions.length > 0) return d.sessions;
  return [
    {
      n: 1,
      title: d.title,
      scriptures: [{ ref: d.scriptureRef, text: d.scriptureText }],
      teaching: [d.teaching],
      prayer: d.prayer,
      quiz: d.quiz,
    },
  ];
}
