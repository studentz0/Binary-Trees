
import React, { useState } from 'react';
import { Card } from './Layout';
import { Check, X, RotateCcw, MessageSquare, ChevronRight, ChevronLeft, Award, Trophy, BarChart3, Brain, Zap, Play } from 'lucide-react';
import { QuizQuestion } from '../types';

const QUESTIONS: QuizQuestion[] = [
  { q: "What is the maximum number of children any node in a Binary Tree can have?", options: ["1", "2", "3", "Unlimited"], correct: 1, explanation: "By definition, a 'Binary' tree restricts each node to at most two children." },
  { q: "In a 'Perfect' Binary Tree, if the height is 3, how many nodes are in the tree?", options: ["3", "7", "15", "31"], correct: 2, explanation: "A perfect tree has (2^(h+1) - 1) nodes. For height 3, that is 2^4 - 1 = 15." },
  { q: "Which traversal visits the root node LAST?", options: ["Pre-order", "In-order", "Post-order", "Level-order"], correct: 2, explanation: "Post-order follows the pattern: Left -> Right -> Root." },
  { q: "What is the Balance Factor (BF) formula for an AVL tree node?", options: ["Left Height + Right Height", "Left Height - Right Height", "Total Nodes / 2", "Max(Left, Right)"], correct: 1, explanation: "BF is calculated by subtracting the height of the right subtree from the height of the left (or vice-versa, as long as it is consistent)." },
  { q: "A 'Full' Binary Tree is one where:", options: ["All levels are filled", "Every node has either 0 or 2 children", "The tree is balanced", "All leaves are at the same depth"], correct: 1, explanation: "A full tree specifically means no node has only one child." },
  { q: "Which rotation is needed for an imbalance caused by a Right-Left (RL) insert?", options: ["Single Left", "Single Right", "Double Right-Left", "Double Left-Right"], correct: 2, explanation: "An RL imbalance requires a Right rotation on the child, then a Left rotation on the parent." },
  { q: "In an Expression Tree, what do the leaf nodes represent?", options: ["Operators (+, -, *)", "Operands (Numbers/Variables)", "Root nodes", "Parenthesis"], correct: 1, explanation: "Leaf nodes in an AST represent the data (values), while internal nodes represent the operations performed on them." },
  { q: "What is the time complexity of searching in a perfectly balanced AVL tree?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], correct: 2, explanation: "Balancing ensures the tree height remains logarithmic relative to the number of nodes." },
  { q: "Which traversal of a Binary Search Tree (BST) produces a sorted list of values?", options: ["Pre-order", "In-order", "Post-order", "Breadth-first"], correct: 1, explanation: "In-order traversal visits nodes in non-decreasing order for any valid BST." },
  { q: "If a node has a Balance Factor of -2, it means:", options: ["The left side is too heavy", "The right side is too heavy", "The tree is perfect", "The node is a leaf"], correct: 1, explanation: "A negative BF indicates the right subtree is deeper than the left subtree by more than the allowed threshold." },
  { q: "In a 'Complete' Binary Tree, which level can be partially filled?", options: ["Only the root", "Only the middle level", "Only the last level", "None, all must be full"], correct: 2, explanation: "Complete trees allow the last level to be incomplete, provided it is filled from left to right." },
  { q: "What is the depth of the root node?", options: ["0", "1", "Depends on tree size", "-1"], correct: 0, explanation: "Depth measures the number of edges from the root; hence, the root itself is at depth 0." },
  { q: "Which data structure is typically used to implement Level-Order traversal?", options: ["Stack", "Queue", "Linked List", "Priority Queue"], correct: 1, explanation: "A Queue (FIFO) ensures we visit nodes level by level (Breadth-First Search)." },
  { q: "Which rotation fixes a 'Left-Left' (LL) imbalance?", options: ["Single Left", "Single Right", "Left-Right", "Right-Left"], correct: 1, explanation: "An LL case means the left is too heavy; a single Right rotation brings the left child up to the root." },
  { q: "What is the primary benefit of an AVL tree over a standard BST?", options: ["Uses less memory", "Simpler to implement", "Guarantees O(log n) operations", "Allows 3 children per node"], correct: 2, explanation: "Standard BSTs can become skewed (O(n)), while AVL trees maintain balance to ensure efficiency." },
  { q: "In an Expression Tree for 'A + B', which node is the root?", options: ["A", "B", "+", "None"], correct: 2, explanation: "The operator '+' acts as the internal node connecting the two operands." },
  { q: "Which of these is NOT a valid Balance Factor for a balanced AVL node?", options: ["-1", "0", "1", "2"], correct: 3, explanation: "AVL balance property states |BF| <= 1. A BF of 2 or -2 requires a rotation." },
  { q: "A 'Skewed' Binary Tree is most similar to which data structure?", options: ["Array", "Linked List", "Stack", "Hash Table"], correct: 1, explanation: "If every node has only one child, the tree effectively becomes a linear Linked List." },
  { q: "In Pre-order traversal, when is the Right subtree visited?", options: ["First", "Second", "Third", "Last"], correct: 2, explanation: "The order is Root, then Left, then Right." },
  { q: "What is the height of a tree with only a root node?", options: ["0", "1", "2", "Undefined"], correct: 0, explanation: "Height is the number of edges on the longest path to a leaf. A root-only tree has 0 edges." }
];

export const QuizSection = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (optionIdx: number) => {
    if (showResults) return;
    setUserAnswers(prev => ({ ...prev, [currentIndex]: optionIdx }));
  };

  const nextQuestion = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const resetQuiz = () => {
    setIsStarted(false);
    setCurrentIndex(0);
    setUserAnswers({});
    setShowResults(false);
  };

  const score = Object.entries(userAnswers).reduce((acc, [idx, ans]) => {
    return acc + (QUESTIONS[parseInt(idx)].correct === ans ? 1 : 0);
  }, 0);

  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  if (!isStarted) {
    return (
      <Card className="border-t-4 border-t-indigo-600 shadow-2xl overflow-hidden">
        <div className="relative p-6 sm:p-16 text-center">
          <div className="relative z-10 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-indigo-50 rounded-2xl sm:rounded-[2.5rem] text-indigo-600 mb-2 shadow-inner">
               <Brain size={32} className="sm:w-12 sm:h-12 animate-pulse" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
                Binary Tree <span className="text-indigo-600">Final Assessment</span>
              </h3>
              <p className="text-gray-500 font-medium text-sm sm:text-xl max-w-2xl mx-auto leading-relaxed">
                Test your knowledge across architecture and traversal logic. 
                20 questions designed for mastery.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
              <div className="flex items-center gap-1 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-50 px-3 py-1.5 rounded-full">
                <Check size={12} /> 20 Qs
              </div>
              <div className="flex items-center gap-1 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-50 px-3 py-1.5 rounded-full">
                <Zap size={12} /> Feedback
              </div>
            </div>

            <button 
              onClick={() => setIsStarted(true)}
              className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-xl font-black text-base sm:text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 mx-auto"
            >
              Take Quiz <Play size={18} />
            </button>
          </div>
        </div>
      </Card>
    );
  }

  if (showResults) {
    const percentage = (score / QUESTIONS.length) * 100;
    return (
      <Card title="Results" className="border-t-4 border-t-purple-500">
        <div className="text-center py-6 sm:py-10">
          <div className="relative inline-block mb-6 sm:mb-8">
            <div className="w-24 h-24 sm:w-48 sm:h-48 rounded-full border-8 sm:border-[12px] border-gray-100 flex items-center justify-center mx-auto shadow-inner bg-white">
              <div className="text-center">
                <span className="text-2xl sm:text-6xl font-black text-gray-900 leading-none">{score}</span>
                <span className="text-gray-400 font-bold block text-xs sm:text-base mt-1">/ {QUESTIONS.length}</span>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-yellow-400 text-white p-2 rounded-lg sm:rounded-2xl shadow-xl">
              <Trophy size={16} className="sm:w-8 sm:h-8" />
            </div>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
            {percentage >= 80 ? "Grandmaster!" : percentage >= 50 ? "Solid Effort!" : "Keep Practicing!"}
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-8 max-w-sm mx-auto">
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
               <div className="text-xl font-black text-indigo-900">{percentage}%</div>
               <div className="text-[8px] font-black uppercase text-indigo-400 tracking-widest">Accuracy</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
               <div className="text-xl font-black text-emerald-900">{score} Correct</div>
               <div className="text-[8px] font-black uppercase text-emerald-400 tracking-widest">Score</div>
            </div>
          </div>

          <button 
            onClick={resetQuiz}
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-black text-base hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
          >
            <RotateCcw size={18} /> Restart
          </button>
        </div>

        <div className="mt-8 space-y-4 pt-8 border-t border-gray-100">
           <h4 className="font-black text-sm sm:text-xl uppercase tracking-tighter text-gray-900 mb-6 flex items-center gap-2">
             <MessageSquare size={18} /> Explanations
           </h4>
           {QUESTIONS.map((q, qIdx) => {
             const userAns = userAnswers[qIdx];
             const isCorrect = userAns === q.correct;
             return (
               <div key={qIdx} className={`p-4 rounded-xl border-2 ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                 <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-black text-[10px] text-white ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                      {isCorrect ? <Check size={14} /> : <X size={14} />}
                    </div>
                    <div className="space-y-3 flex-1 overflow-hidden">
                      <p className="font-black text-gray-900 text-xs sm:text-lg leading-tight truncate-multiline">Q{qIdx + 1}: {q.q}</p>
                      <p className="text-[10px] sm:text-base text-gray-600 font-semibold leading-relaxed italic pr-2">
                        {q.explanation}
                      </p>
                    </div>
                 </div>
               </div>
             );
           })}
        </div>
      </Card>
    );
  }

  const currentQ = QUESTIONS[currentIndex];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end px-1">
        <div>
           <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Progress</div>
           <div className="text-lg font-black text-gray-900">{currentIndex + 1} <span className="text-gray-300">/ {QUESTIONS.length}</span></div>
        </div>
        <div className="text-right">
           <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">Answered</div>
           <div className="text-lg font-black text-gray-900">{Object.keys(userAnswers).length}</div>
        </div>
      </div>

      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div className={`h-full bg-indigo-600 transition-all duration-500`} style={{ width: `${progress}%` }} />
      </div>

      <Card className="border-t-4 border-t-indigo-600">
        <div className="flex flex-col justify-between min-h-[300px]">
          <div className="mb-6">
            <h4 className="font-black text-lg sm:text-3xl text-gray-900 leading-tight mb-6">
              {currentQ.q}
            </h4>
            <div className="grid gap-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`
                      w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3
                      ${isSelected ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-50' : 'bg-white border-gray-100 text-gray-600 hover:bg-indigo-50/50'}
                    `}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] ${isSelected ? 'bg-white text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-bold text-xs sm:text-lg">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-6 border-t border-gray-100">
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="px-3 py-3 bg-white border border-gray-100 text-gray-400 rounded-lg text-xs font-black uppercase disabled:opacity-0 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextQuestion}
              disabled={userAnswers[currentIndex] === undefined}
              className={`
                flex-1 py-3 px-4 rounded-lg font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all shadow-lg
                ${userAnswers[currentIndex] === undefined 
                  ? 'bg-gray-100 text-gray-300' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }
              `}
            >
              {currentIndex === QUESTIONS.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
