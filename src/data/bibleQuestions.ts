import { BibleQuestion } from '../types/quiz';

export const BIBLE_QUESTIONS: BibleQuestion[] = [
  {
    id: 'q1',
    category: 'OLD_TESTAMENT',
    difficulty: 'novice',
    question: 'How many days and nights did rain fall during Noah’s flood?',
    options: ['7 days and 7 nights', '40 days and 40 nights', '100 days and 100 nights', '12 days and 12 nights'],
    correctIndex: 1,
    verseReference: 'Genesis 7:12',
    scriptureText: 'And rain fell on the earth forty days and forty nights.',
    theologicalContext: 'The number 40 in Biblical theology frequently represents a period of testing, trial, or sanctifying transition (e.g., Israel in the wilderness, Jesus’ fast in the desert).',
    rewardValue: 100
  },
  {
    id: 'q2',
    category: 'GOSPELS',
    difficulty: 'novice',
    question: 'In what humble town was Jesus Christ born according to the prophets and gospels?',
    options: ['Nazareth', 'Jerusalem', 'Bethlehem', 'Capernaum'],
    correctIndex: 2,
    verseReference: 'Micah 5:2 / Matthew 2:1',
    scriptureText: 'After Jesus was born in Bethlehem in Judea, during the time of King Herod, Magi from the east came to Jerusalem.',
    theologicalContext: 'Bethlehem means "House of Bread" in Hebrew. Fittingly, Jesus—the "Bread of Life" who came down from Heaven—was born in the City of David fulfilling Micah’s prophecy 700 years prior.',
    rewardValue: 100
  },
  {
    id: 'q3',
    category: 'MIRACLES',
    difficulty: 'novice',
    question: 'What was Jesus Christ’s very first recorded public miracle?',
    options: ['Walking on the Sea of Galilee', 'Healing blind Bartimaeus', 'Turning water into wine at Cana', 'Feeding the five thousand'],
    correctIndex: 2,
    verseReference: 'John 2:11',
    scriptureText: 'What Jesus did here in Cana of Galilee was the first of the signs through which he revealed his glory; and his disciples believed in him.',
    theologicalContext: 'By transforming ordinary water designated for Jewish ceremonial washing into the richest vintage wine, Jesus signaled the arrival of the New Covenant of joyful abundance and grace.',
    rewardValue: 100
  },
  {
    id: 'q4',
    category: 'PARABLES',
    difficulty: 'disciple',
    question: 'In the Parable of the Good Samaritan, who were the two individuals who passed by the wounded traveler before the Samaritan stopped?',
    options: ['A Pharisee and a Roman Soldier', 'A Priest and a Levite', 'A Tax Collector and a Sadducee', 'A Fisherman and a Scribe'],
    correctIndex: 1,
    verseReference: 'Luke 10:31-33',
    scriptureText: 'A priest happened to be going down the same road, and when he saw the man, he passed by on the other side. So too, a Levite... But a Samaritan came where the man was.',
    theologicalContext: 'Jesus addressed a legal expert asking "Who is my neighbor?" Both the priest and Levite represented religious ceremony and temple duty, yet failed the weightier commandment of active mercy and love.',
    rewardValue: 100
  },
  {
    id: 'q5',
    category: 'WISDOM',
    difficulty: 'novice',
    question: 'According to Proverbs 1:7 and 9:10, what is the beginning of wisdom?',
    options: ['The reading of ancient scrolls', 'The accumulation of wealth', 'The fear of the LORD', 'Honor from world rulers'],
    correctIndex: 2,
    verseReference: 'Proverbs 9:10',
    scriptureText: 'The fear of the LORD is the beginning of wisdom, and knowledge of the Holy One is understanding.',
    theologicalContext: 'Biblical "fear of the Lord" does not signify servile dread, but profound reverential awe, humble submission, and deep delight in God’s holy sovereignty.',
    rewardValue: 100
  },
  {
    id: 'q6',
    category: 'OLD_TESTAMENT',
    difficulty: 'disciple',
    question: 'What weapon and items did David bring into battle to defeat the Philistine champion Goliath?',
    options: ['King Saul’s brass armor and heavy broadsword', 'A staff, a sling, and five smooth stones from the stream', 'An iron spear and cedar bow', 'A bronze javelin and leather shield'],
    correctIndex: 1,
    verseReference: '1 Samuel 17:40',
    scriptureText: 'Then he took his staff in his hand, chose five smooth stones from the stream, put them in the pouch of his shepherd’s bag and, with his sling in his hand, approached the Philistine.',
    theologicalContext: 'David refused Saul’s heavy bronze armor because he had not tested it. He placed his trust not in military metallurgy, but in the name of the LORD of Hosts.',
    rewardValue: 100
  },
  {
    id: 'q7',
    category: 'PROPHECY',
    difficulty: 'scholar',
    question: 'In Revelation chapter 1, how does John describe the voice of the glorified Son of Man?',
    options: ['Like the whisper of a desert wind', 'Like the sound of rushing waters', 'Like a silver trumpet in the night', 'Like roaring thunder in heaven'],
    correctIndex: 1,
    verseReference: 'Revelation 1:15',
    scriptureText: 'His feet were like bronze glowing in a furnace, and his voice was like the sound of rushing waters.',
    theologicalContext: 'This matches Ezekiel 43:2, where the glory of the God of Israel is witnessed returning with a sound like the roar of mighty waters, conveying supreme majestic authority.',
    rewardValue: 100
  },
  {
    id: 'q8',
    category: 'GOSPELS',
    difficulty: 'disciple',
    question: 'Which disciple stepped out of the boat and walked on water toward Jesus before beginning to sink in faith?',
    options: ['John the Beloved', 'Simon Peter', 'Thomas Didymus', 'James son of Zebedee'],
    correctIndex: 1,
    verseReference: 'Matthew 14:29-30',
    scriptureText: 'Then Peter got down out of the boat, walked on the water and came toward Jesus. But when he saw the wind, he was afraid and, beginning to sink, cried out, "Lord, save me!"',
    theologicalContext: 'While Peter often draws criticism for wavering when seeing the tempest, he was the only disciple possessing the courage to step onto the storm-tossed sea in obedience.',
    rewardValue: 100
  },
  {
    id: 'q9',
    category: 'OLD_TESTAMENT',
    difficulty: 'scholar',
    question: 'Who was the ancient priest-king of Salem who blessed Abram and received a tithe of everything?',
    options: ['Jethro', 'Melchizedek', 'Abimelech', 'Enoch'],
    correctIndex: 1,
    verseReference: 'Genesis 14:18-20 / Hebrews 7:1-3',
    scriptureText: 'Then Melchizedek king of Salem brought out bread and wine. He was priest of God Most High, and he blessed Abram.',
    theologicalContext: 'Melchizedek ("King of Righteousness" and King of "Salem" meaning Peace) is a profound Christological archetype, whose royal priesthood predates and transcends the Levitical order.',
    rewardValue: 100
  },
  {
    id: 'q10',
    category: 'PARABLES',
    difficulty: 'novice',
    question: 'What did the Prodigal Son ask of his father before leaving for a distant country?',
    options: ['His father’s blessing to marry', 'His share of the family inheritance', 'A caravan of camels and servants', 'Forgiveness for his past debts'],
    correctIndex: 1,
    verseReference: 'Luke 15:12',
    scriptureText: 'The younger one said to his father, "Father, give me my share of the estate." So he divided his property between them.',
    theologicalContext: 'In ancient Near Eastern culture, demanding one’s inheritance prematurely was tantamount to wishing one’s father dead. This highlights the radical grace and running embrace of the father upon the son’s return.',
    rewardValue: 100
  },
  {
    id: 'q11',
    category: 'MIRACLES',
    difficulty: 'disciple',
    question: 'How many baskets of leftover broken bread and fish did the disciples gather after feeding the five thousand?',
    options: ['3 baskets', '7 baskets', '12 baskets full', '40 baskets'],
    correctIndex: 2,
    verseReference: 'Matthew 14:20',
    scriptureText: 'They all ate and were satisfied, and the disciples picked up twelve basketfuls of broken pieces that were left over.',
    theologicalContext: 'The 12 overflowing baskets represent God’s complete provision for all twelve tribes of Israel, illustrating that with Christ, there is not merely enough, but abundant super-sufficiency.',
    rewardValue: 100
  },
  {
    id: 'q12',
    category: 'WISDOM',
    difficulty: 'scholar',
    question: 'In Ecclesiastes 12:13, what does King Solomon identify as "the conclusion of the matter; the whole duty of man"?',
    options: ['Acquire understanding and leave a great lineage', 'Fear God and keep His commandments', 'Build monuments to the glory of Zion', 'Rejoice in worldly wine and feasts'],
    correctIndex: 1,
    verseReference: 'Ecclesiastes 12:13',
    scriptureText: 'Now all has been heard; here is the conclusion of the matter: Fear God and keep his commandments, for this is the duty of all mankind.',
    theologicalContext: 'After examining every worldly pursuit under the sun (wealth, architecture, knowledge, hedonism) and declaring them vanity without God, Solomon anchors life’s ultimate purpose in reverence for the Creator.',
    rewardValue: 100
  },
  {
    id: 'q13',
    category: 'OLD_TESTAMENT',
    difficulty: 'novice',
    question: 'What sign did God place in the sky as a covenant promise never again to destroy all flesh with a flood?',
    options: ['A burning bush', 'A rainbow', 'A pillar of fire', 'A shooting star'],
    correctIndex: 1,
    verseReference: 'Genesis 9:13',
    scriptureText: 'I have set my rainbow in the clouds, and it will be the sign of the covenant between me and the earth.',
    theologicalContext: 'The Hebrew word used is "qeshet" (warrior’s bow). By aiming the arc of the war bow away from earth into the sky, God symbolically hung up His instrument of wrath in enduring grace.',
    rewardValue: 100
  },
  {
    id: 'q14',
    category: 'GOSPELS',
    difficulty: 'scholar',
    question: 'On the road to Emmaus following the resurrection, what did Jesus do that caused the disciples’ eyes to be opened so they recognized Him?',
    options: ['He showed them the print of the nails in His hands', 'He took bread, gave thanks, broke it and began to give it to them', 'He called them by their secret names', 'He commanded fire from heaven'],
    correctIndex: 1,
    verseReference: 'Luke 24:30-31',
    scriptureText: 'When he was at the table with them, he took bread, gave thanks, broke it and began to give it to them. Then their eyes were opened and they recognized him.',
    theologicalContext: 'The posture of hospitality, blessing, and breaking bread—the hallmark of His self-giving nature—revealed the risen Christ more immediately than intellectual discourse alone.',
    rewardValue: 100
  },
  {
    id: 'q15',
    category: 'PROPHECY',
    difficulty: 'disciple',
    question: 'In Isaiah chapter 53, the prophet foretells the Suffering Servant with which memorable verse regarding our healing?',
    options: ['He shall reign from sea to sea with an iron rod', 'By His stripes / wounds we are healed', 'He will rebuild the walls of Jerusalem in three weeks', 'He shall be called Mighty King of the Gentiles'],
    correctIndex: 1,
    verseReference: 'Isaiah 53:5',
    scriptureText: 'But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.',
    theologicalContext: 'Composed roughly seven centuries before the crucifixion, Isaiah 53 articulates penal substitutionary atonement and the redemptive suffering of the Messiah with astonishing clarity.',
    rewardValue: 0.75
  }
];

export const CATEGORY_LABELS: Record<string, { label: string; icon: string; description: string }> = {
  OLD_TESTAMENT: {
    label: 'Old Testament',
    icon: 'Scroll',
    description: 'Genesis, Exodus, Prophets, Kings, and the Psalms of David'
  },
  GOSPELS: {
    label: 'Gospels & Acts',
    icon: 'BookOpen',
    description: 'The life, teachings, cross, and resurrection of Jesus Christ'
  },
  PARABLES: {
    label: 'Parables & Teachings',
    icon: 'Lightbulb',
    description: 'The Sower, the Prodigal Son, the Talents, and the Kingdom of Heaven'
  },
  MIRACLES: {
    label: 'Signs & Miracles',
    icon: 'Sparkles',
    description: 'Parting waters, water into wine, healings, and the empty tomb'
  },
  PROPHECY: {
    label: 'Prophecy & Revelation',
    icon: 'Eye',
    description: 'Isaiah, Daniel, Ezekiel, and John’s visions on Patmos'
  },
  WISDOM: {
    label: 'Wisdom & Poetry',
    icon: 'Compass',
    description: 'Proverbs of Solomon, Ecclesiastes, Job, and practical righteous living'
  }
};
