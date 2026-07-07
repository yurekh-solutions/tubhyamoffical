import { useState } from 'react';
import { ChevronRight, CheckCircle, Zap } from 'lucide-react';

const StyleQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const quizQuestions = [
    {
      id: 1,
      question: "What's your preferred style?",
      options: ["Formal & Professional", "Casual & Comfortable", "Trendy & Bold"],
    },
    {
      id: 2,
      question: "What occasions do you dress for most?",
      options: ["Office & Formal Events", "Daily Wear & Casual", "Weekend Outings"],
    },
    {
      id: 3,
      question: "What's your body confidence level?",
      options: ["Want a Flattering Fit", "Comfortable in Most Styles", "Looking for Trendy Cuts"],
    },
  ];

  const styleResults = {
    "Formal & Professional-Office & Formal Events-Want a Flattering Fit": {
      title: "Executive Professional",
      recommendation: "Our formal trousers and palazzo pants are perfect for you. Try our Elegance Wide-Leg collection.",
      link: "/shop?category=formal"
    },
    "Casual & Comfortable-Daily Wear & Casual-Comfortable in Most Styles": {
      title: "Casual Comfort Lover",
      recommendation: "Our track pants and comfort joggers offer the perfect blend of style and ease. Explore our athleisure collection.",
      link: "/shop?category=track"
    },
    "Trendy & Bold-Weekend Outings-Looking for Trendy Cuts": {
      title: "Style Trendsetter",
      recommendation: "Our premium jeans collection with modern cuts and washes is perfect for you. Check out our latest arrivals.",
      link: "/shop?category=jeans"
    }
  };

  const handleAnswer = (option: string) => {
    const newAnswers = [...selectedAnswers, option];
    setSelectedAnswers(newAnswers);

    if (newAnswers.length === quizQuestions.length) {
      setShowResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const getResult = () => {
    const key = selectedAnswers.join("-");
    return styleResults[key as keyof typeof styleResults] || {
      title: "Style Explorer",
      recommendation: "Discover our full collection and find your perfect style match.",
      link: "/shop"
    };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
  };

  if (showResult) {
    const result = getResult();
    return (
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Result Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-3xl blur-xl opacity-50"></div>
              
              <div className="relative glass-card border border-primary/20 p-12 rounded-3xl backdrop-blur-xl bg-background/40 text-center">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-lg opacity-50"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                  Your Style Profile: <span className="text-gradient-gold">{result.title}</span>
                </h2>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {result.recommendation}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={result.link}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                  >
                    <Zap className="w-5 h-5" />
                    Explore Recommendations
                  </a>
                  <button
                    onClick={resetQuiz}
                    className="px-8 py-3 border border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition-all duration-300"
                  >
                    Take Quiz Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-primary uppercase tracking-widest text-sm font-semibold mb-4">Find Your Perfect Style</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold">
              Discover Your <span className="text-gradient-gold">Tubhyam Style</span>
            </h2>
            <p className="text-muted-foreground mt-4">Quick 3-question quiz to find your ideal collection</p>
          </div>

          {/* Quiz Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-2xl blur-lg opacity-50"></div>
            
            <div className="relative glass-card border border-primary/20 p-8 md:p-12 rounded-2xl backdrop-blur-xl bg-background/40">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                  <span className="text-xs text-muted-foreground">{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <h3 className="font-heading text-2xl md:text-3xl font-bold mb-8 text-foreground">
                {quizQuestions[currentQuestion].question}
              </h3>

              {/* Options */}
              <div className="space-y-4">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 text-left border border-primary/20 rounded-xl hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {option}
                      </span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StyleQuiz;
