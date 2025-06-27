import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { Quiz, QuizQuestion } from "@/stores/courseStore";

interface QuizEditorProps {
  quiz?: Quiz;
  onSave: (quiz: Omit<Quiz, 'id'>) => void;
  onClose: () => void;
}

const QuizEditor = ({ quiz, onSave, onClose }: QuizEditorProps) => {
  const [title, setTitle] = useState(quiz?.title || "");
  const [timeLimit, setTimeLimit] = useState(quiz?.timeLimit?.toString() || "");
  const [passingScore, setPassingScore] = useState(quiz?.passingScore?.toString() || "70");
  const [questions, setQuestions] = useState<QuizQuestion[]>(quiz?.questions || []);

  const handleSave = () => {
    onSave({
      title,
      questions,
      timeLimit: timeLimit ? parseInt(timeLimit) : undefined,
      passingScore: parseInt(passingScore),
    });
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {quiz ? 'Edit Quiz' : 'Create Quiz'}
          </h2>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quiz Settings */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Settings</CardTitle>
              <CardDescription>Configure quiz properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Quiz Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Time Limit (minutes)</label>
                <Input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  placeholder="Optional time limit"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Passing Score (%)</label>
                <Input
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                  placeholder="70"
                  min="0"
                  max="100"
                />
              </div>
              <div className="pt-4">
                <Button onClick={addQuestion} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>Create quiz questions with multiple choice answers</CardDescription>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No questions yet. Add your first question to get started.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question, questionIndex) => (
                    <Card key={question.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">Question {questionIndex + 1}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Question</label>
                          <Textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                            placeholder="Enter your question"
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Answer Options</label>
                          <div className="space-y-2 mt-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name={`correct-${question.id}`}
                                  checked={question.correctAnswer === optionIndex}
                                  onChange={() => updateQuestion(question.id, { correctAnswer: optionIndex })}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <Input
                                  value={option}
                                  onChange={(e) => updateQuestionOption(question.id, optionIndex, e.target.value)}
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Select the correct answer by clicking the radio button
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Explanation (Optional)</label>
                          <Textarea
                            value={question.explanation || ""}
                            onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                            placeholder="Explain why this answer is correct"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;