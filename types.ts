
export interface TreeNode {
  id: number | string;
  val: string | number;
  x: number;
  y: number;
  p: number | string | null;
  active?: boolean;
  bf?: number;
  type?: 'default' | 'root' | 'leaf' | 'op' | 'var';
}

export interface ExpressionNode {
  val: string;
  type: 'op' | 'var';
  left: ExpressionNode | null;
  right: ExpressionNode | null;
}

// Added QuizQuestion interface to support AI-generated quizzes
export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}
