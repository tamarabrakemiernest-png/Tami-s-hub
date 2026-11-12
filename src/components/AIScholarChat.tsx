import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  DollarSign,
  Play,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Compass,
  ArrowRight
} from 'lucide-react';
import { BibleQuestion } from '../types/quiz';
import { sound } from '../utils/audio';

interface AIScholarChatProps {
  onPlayCustomQuiz: (questions: BibleQuestion[]) => void;
}

interface CustomTopicPreset {
  title: string;
  passage: string;
  reward: number;
}

const PRESET_TOPICS: CustomTopicPreset[] = [
  {
    title: 'The Beatitudes & Kingdom Ethics',
    passage: 'Matthew 5:1-12',
    reward: 1000
  },
  {
    title: 'The Armor of God in Spiritual Warfare',
    passage: 'Ephesians 6:10-18',
    reward: 1250
  },
  {
    title: 'Nehemiah: Leadership & Rebuilding the Wall',
    passage: 'Nehemiah 2-4',
    reward: 1000
  },
  {
    title: 'The Hall of Faith Heroes',
    passage: 'Hebrews 11',
    reward: 1500
  }
];

export const AIScholarChat: React.FC<AIScholarChatProps> = ({ onPlayCustomQuiz }) => {
  const [topicInput, setTopicInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [scholarAnswer, setScholarAnswer] = useState<string | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<BibleQuestion[] | null>(null);

  const handleGenerate = (topicToUse?: string) => {
    const query = topicToUse || topicInput;
    if (!query.trim()) return;

    sound.playClick();
    setIsGenerating(true);
    setScholarAnswer(null);
    setGeneratedQuiz(null);

    // Simulate intelligent theological exegesis and customized Bible quiz compilation
    setTimeout(() => {
      sound.playCorrect();
      setIsGenerating(false);

      if (query.toLowerCase().includes('beatitude') || query.toLowerCase().includes('matthew 5')) {
        setScholarAnswer(
          'In the Sermon on the Mount (Matthew 5:1-12), the "Beatitudes" (from the Latin "beatus", meaning supremely blessed or happy) inaugurate Jesus’ proclamation of the upside-down Kingdom of God. Unlike worldly honors based on power, Christ pronounces divine favor upon the poor in spirit, the meek, peacemakers, and those persecuted for righteousness’ sake.'
        );
        setGeneratedQuiz([
          {
            id: 'custom_b1',
            category: 'GOSPELS',
            difficulty: 'disciple',
            question: 'According to Matthew 5:3, who inherits the Kingdom of Heaven?',
            options: ['The mighty in battle', 'The poor in spirit', 'The wealthy rulers', 'The ascetics in the desert'],
            correctIndex: 1,
            verseReference: 'Matthew 5:3',
            scriptureText: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.',
            theologicalContext: 'To be "poor in spirit" denotes humble recognition of spiritual bankruptcy before a holy God, apart from His unmerited grace.',
            rewardValue: 500
          },
          {
            id: 'custom_b2',
            category: 'GOSPELS',
            difficulty: 'disciple',
            question: 'What covenant promise is given to the pure in heart in Matthew 5:8?',
            options: ['They shall conquer cities', 'They shall see God', 'They shall be freed from sickness', 'They shall receive double inheritance'],
            correctIndex: 1,
            verseReference: 'Matthew 5:8',
            scriptureText: 'Blessed are the pure in heart, for they will see God.',
            theologicalContext: 'Purity of heart reflects single-minded devotion and moral cleansing through Christ, anticipating the beatific vision of God.',
            rewardValue: 500
          }
        ]);
      } else if (query.toLowerCase().includes('armor') || query.toLowerCase().includes('ephesians')) {
        setScholarAnswer(
          'In Ephesians 6:10-18, the Apostle Paul—likely chained to a Roman legionary while writing in prison—spiritualizes Roman combat armor into the divine panoply provided by God: the Belt of Truth, Breastplate of Righteousness, Gospel of Peace, Shield of Faith, Helmet of Salvation, and the Sword of the Spirit (the Word of God).'
        );
        setGeneratedQuiz([
          {
            id: 'custom_a1',
            category: 'PROPHECY',
            difficulty: 'disciple',
            question: 'What is identified as the only offensive weapon in the Armor of God (Ephesians 6:17)?',
            options: ['The Spear of Zeal', 'The Sword of the Spirit, which is the word of God', 'The Bow of David', 'The Rod of Aaron'],
            correctIndex: 1,
            verseReference: 'Ephesians 6:17',
            scriptureText: 'Take the helmet of salvation and the sword of the Spirit, which is the word of God.',
            theologicalContext: 'The Greek word "machaira" refers to a short, precise Roman stabbing dagger, symbolizing how scripture is wielded with tactical precision against temptation.',
            rewardValue: 750
          },
          {
            id: 'custom_a2',
            category: 'PROPHECY',
            difficulty: 'disciple',
            question: 'With what piece of armor does the believer extinguish all the flaming arrows of the evil one?',
            options: ['The Iron Greaves', 'The Shield of Faith', 'The Belt of Truth', 'The Breastplate of Righteousness'],
            correctIndex: 1,
            verseReference: 'Ephesians 6:16',
            scriptureText: 'In addition to all this, take up the shield of faith, with which you can extinguish all the flaming arrows of the evil one.',
            theologicalContext: 'The Roman "scutum" shield was large, rectangular, and soaked in water before battle to quench fire-tipped darts—illustrating living faith in Christ’s sufficiency.',
            rewardValue: 750
          }
        ]);
      } else {
        // Universal custom generator for any requested topic
        setScholarAnswer(
          `Theological Study Note for "${query}": In sacred scripture, divine truth reveals God’s sovereign plan of redemption through Christ. As 2 Timothy 3:16 reminds us, "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness." Meditate on how this truth anchors your daily walk.`
        );
        setGeneratedQuiz([
          {
            id: 'custom_gen_1',
            category: 'WISDOM',
            difficulty: 'disciple',
            question: `In Biblical wisdom regarding "${query}", what foundational truth anchors the believer’s trust?`,
            options: [
              'Trusting in human strength and fortune',
              'Trust in the LORD with all your heart and lean not on your own understanding',
              'Seeking approval from secular authorities',
              'Relying solely on material wealth'
            ],
            correctIndex: 1,
            verseReference: 'Proverbs 3:5-6',
            scriptureText: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
            theologicalContext: 'Surrendering self-reliance to divine sovereignty is the heart of biblical faithfulness across all books of scripture.',
            rewardValue: 600
          },
          {
            id: 'custom_gen_2',
            category: 'GOSPELS',
            difficulty: 'novice',
            question: 'According to Jesus in John 8:31-32, what brings true freedom?',
            options: [
              'Holding to His teaching, knowing the truth that sets you free',
              'Winning military conquests',
              'Observing Pharisaic ceremonial laws',
              'Accumulating earthly honors'
            ],
            correctIndex: 0,
            verseReference: 'John 8:31-32',
            scriptureText: 'If you hold to my teaching, you are really my disciples. Then you will know the truth, and the truth will set you free.',
            theologicalContext: 'Freedom in Christ is not license to sin, but liberation from the bondage of sin into joyful communion with God.',
            rewardValue: 600
          }
        ]);
      }
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span>AI THEOLOGICAL SCHOLAR & QUIZ GENERATOR</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-biblical">
          Ask the Scholar or Generate Custom Quizzes
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Enter any Scripture book, passage, character, or theological theme. The Scholar generates tailored quiz challenges that pay cash rewards upon completion!
        </p>
      </div>

      {/* Preset Topics */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Suggested Scripture Study Topics
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PRESET_TOPICS.map((preset) => (
            <button
              key={preset.title}
              onClick={() => {
                setTopicInput(preset.title);
                handleGenerate(preset.title);
              }}
              className="p-3 bg-slate-900/60 border border-slate-800 hover:border-amber-400/50 rounded-xl text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors">
                  {preset.title}
                </div>
                <div className="text-[11px] text-slate-400">
                  {preset.passage}
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold shrink-0">
                <span>+₦{preset.reward.toLocaleString()}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Input */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
        <label className="block text-xs font-semibold text-slate-300">
          Custom Scripture Topic or Question
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. Parable of the Talents, Book of Ruth, Roman Road to Salvation..."
            className="flex-1 h-11 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !topicInput.trim()}
            className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors shrink-0 shadow-md"
          >
            {isGenerating ? (
              <span>Consulting...</span>
            ) : (
              <>
                <span>Generate</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Exegesis & Generated Quiz Display */}
      {scholarAnswer && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Exegesis Commentary Card */}
          <div className="bg-slate-900 border border-amber-500/20 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <BookOpen className="w-4 h-4" />
              <span>THEOLOGICAL EXEGESIS</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {scholarAnswer}
            </p>
          </div>

          {/* Generated Quiz Card */}
          {generatedQuiz && generatedQuiz.length > 0 && (
            <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Custom Bible Challenge Ready ({generatedQuiz.length} Questions)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Total prize value: +₦{generatedQuiz.reduce((acc, q) => acc + q.rewardValue, 0).toLocaleString()} NGN
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onPlayCustomQuiz(generatedQuiz);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Play & Earn Now</span>
                </button>
              </div>

              {/* Preview of Questions */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                {generatedQuiz.map((q, i) => (
                  <div
                    key={q.id}
                    className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <span className="text-slate-300 truncate pr-3">
                      {i + 1}. {q.question}
                    </span>
                    <span className="text-emerald-400 font-mono font-bold shrink-0">
                      +₦{q.rewardValue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
