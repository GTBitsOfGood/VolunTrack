import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button, Select, TextInput, Checkbox, Toast } from "flowbite-react";
import { CheckCircleIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import axios from "axios";
import BoGButton from "../../components/BoGButton";

const ApplicationQuestionsEditor = () => {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.organizationId) {
      fetchQuestions();
    }
  }, [session]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `/api/organizations/${session.user.organizationId}/applicationQuestions`
      );
      if (response.data.applicationQuestions) {
        setQuestions(response.data.applicationQuestions);
      }
    } catch (error) {
      console.error("Error fetching application questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "short",
        options: [],
        required: false,
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;

    // If changing to a type that doesn't need options, clear them
    if (field === "type" && value === "short") {
      updated[index].options = [];
    }
    // If changing to a type that needs options, initialize empty array
    if (field === "type" && ["radio", "dropdown", "multi"].includes(value) && !updated[index].options) {
      updated[index].options = [""];
    }

    setQuestions(updated);
  };

  const addOption = (questionIndex) => {
    const updated = [...questions];
    if (!updated[questionIndex].options) {
      updated[questionIndex].options = [];
    }
    updated[questionIndex].options.push("");
    setQuestions(updated);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(updated);
  };

  const handleSave = async () => {
    try {
      await axios.post(
        `/api/organizations/${session.user.organizationId}/applicationQuestions`,
        { applicationQuestions: questions }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving application questions:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-column mx-1 my-2 flex gap-8 rounded-sm p-4">
      <div className="w-full">
        <h2 className="text-lg font-bold mb-4">Application Questions</h2>
        <p className="m-0 mb-4 text-sm font-medium text-slate-600">
          Create custom questions for new volunteer applications
        </p>

        {saved && (
          <div className="mb-4">
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
                <CheckCircleIcon className="h-5 w-5" />
              </div>
              <div className="pl-2 text-sm font-normal">
                Application Questions Saved Successfully!
              </div>
              <Toast.Toggle />
            </Toast>
          </div>
        )}

        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question {qIndex + 1}
                  </label>
                  <TextInput
                    type="text"
                    placeholder="Enter your question"
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(qIndex, "question", e.target.value)
                    }
                    className="w-full"
                  />
                </div>
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="mt-8 text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Type
                  </label>
                  <Select
                    value={question.type}
                    onChange={(e) =>
                      updateQuestion(qIndex, "type", e.target.value)
                    }
                  >
                    <option value="short">Short Answer</option>
                    <option value="radio">Radio (Single Choice)</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="multi">Multi-Select (Checkboxes)</option>
                  </Select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={question.required}
                      onChange={(e) =>
                        updateQuestion(qIndex, "required", e.target.checked)
                      }
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Required
                    </span>
                  </label>
                </div>
              </div>

              {["radio", "dropdown", "multi"].includes(question.type) && (
                <div className="ml-4 space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options
                  </label>
                  {(question.options || []).map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <TextInput
                        type="text"
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          updateOption(qIndex, oIndex, e.target.value)
                        }
                        className="flex-1"
                      />
                      <button
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    color="light"
                    onClick={() => addOption(qIndex)}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <Button color="light" onClick={addQuestion}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Question
          </Button>
          <BoGButton onClick={handleSave} text="Save Questions" />
        </div>
      </div>
    </div>
  );
};

export default AdminAuthWrapper(ApplicationQuestionsEditor);
