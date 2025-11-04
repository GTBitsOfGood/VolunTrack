import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Button,
  TextInput,
  Select,
  Checkbox,
  Radio,
  Label,
  Spinner,
} from "flowbite-react";
import { signOut } from "next-auth/react";
import BoGButton from "../../components/BoGButton";

const ApplicationFormUser = ({ onSubmitSuccess }) => {
  const { data: session, update } = useSession();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const hasCalledOnSubmitSuccess = useRef(false);
  const hasFetchedQuestions = useRef(false);

  useEffect(() => {
    if (session?.user?.organizationId && !hasFetchedQuestions.current) {
      hasFetchedQuestions.current = true;
      fetchQuestions();
    }
  }, [session?.user?.organizationId]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `/api/organizations/${session.user.organizationId}/applicationQuestions`
      );
      if (response.data.applicationQuestions) {
        setQuestions(response.data.applicationQuestions);
        // Initialize responses
        const initialResponses = {};
        response.data.applicationQuestions.forEach((q, index) => {
          if (q.type === "multi") {
            initialResponses[index] = [];
          } else if (q.type === "radio") {
            initialResponses[index] = null;
          } else {
            initialResponses[index] = "";
          }
        });
        setResponses(initialResponses);
      }
    } catch (error) {
      console.error("Error fetching application questions:", error);
      setError("Failed to load application form");
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (index, value, questionType) => {
    setResponses({
      ...responses,
      [index]: value,
    });
  };

  const handleMultiSelectChange = (index, option, checked) => {
    const currentSelections = responses[index] || [];
    if (checked) {
      handleResponseChange(index, [...currentSelections, option]);
    } else {
      handleResponseChange(
        index,
        currentSelections.filter((item) => item !== option)
      );
    }
  };

  const validateForm = () => {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (question.required) {
        const response = responses[i];
        if (
          response === null ||
          response === "" ||
          response === undefined ||
          (Array.isArray(response) && response.length === 0)
        ) {
          setError(
            `Please answer the required question: "${question.question}"`
          );
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      // Format responses to match the expected structure
      const formattedResponses = questions.map((question, index) => {
        let responseValue = responses[index];

        // Format response based on question type
        if (question.type === "radio" || question.type === "dropdown") {
          responseValue = responseValue || "";
        } else if (question.type === "multi") {
          responseValue = (responseValue || []).map((option) => ({
            option,
            value: true,
          }));
        } else {
          // short answer
          responseValue = responseValue || "";
        }

        return {
          question: question.question,
          type: question.type,
          response: responseValue,
          required: question.required,
        };
      });

      await axios.post(`/api/users/${session.user._id}/applicationResponses`, {
        applicationResponses: formattedResponses,
      });

      // Update session to reflect that responses have been submitted (optimistic)
      await update({
        user: { ...session.user, applicationResponses: formattedResponses },
      });

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setError(error.response?.data?.error || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  // If no questions, skip the form after render completes
  // Only run once when questions are loaded and empty
  useEffect(() => {
    if (
      questions.length === 0 &&
      !loading &&
      hasFetchedQuestions.current &&
      onSubmitSuccess &&
      !hasCalledOnSubmitSuccess.current
    ) {
      hasCalledOnSubmitSuccess.current = true;
      // Use setTimeout to ensure this runs after render completes
      setTimeout(() => {
        onSubmitSuccess();
      }, 0);
    }
  }, [questions.length, loading, onSubmitSuccess]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Spinner size="xl" />
      </div>
    );
  }

  if (questions.length === 0) {
    // No questions configured, skip the form
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-3xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold">Volunteer Application</h1>
        <p className="mb-8 text-gray-600">
          Please complete this application form to continue. Required questions
          are marked with an asterisk (*).
        </p>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((question, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <h2 className="mb-4 text-lg font-semibold">
                {question.question}
                {question.required && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </h2>

              {question.type === "short" && (
                <TextInput
                  type="text"
                  placeholder="Your answer"
                  value={responses[index] || ""}
                  onChange={(e) =>
                    handleResponseChange(index, e.target.value, "short")
                  }
                  required={question.required}
                  className="max-w-md"
                />
              )}

              {question.type === "radio" && (
                <div className="space-y-3">
                  {(question.options || []).map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <Radio
                        id={`question-${index}-option-${optIndex}`}
                        name={`question-${index}`}
                        value={option}
                        checked={responses[index] === option}
                        onChange={(e) =>
                          handleResponseChange(index, e.target.value, "radio")
                        }
                      />
                      <Label
                        htmlFor={`question-${index}-option-${optIndex}`}
                        className="cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {question.type === "dropdown" && (
                <Select
                  value={responses[index] || ""}
                  onChange={(e) =>
                    handleResponseChange(index, e.target.value, "dropdown")
                  }
                  required={question.required}
                  className="max-w-md"
                >
                  <option value="">Select an option</option>
                  {(question.options || []).map((option, optIndex) => (
                    <option key={optIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              )}

              {question.type === "multi" && (
                <div className="space-y-3">
                  {(question.options || []).map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <Checkbox
                        id={`question-${index}-option-${optIndex}`}
                        checked={(responses[index] || []).includes(option)}
                        onChange={(e) =>
                          handleMultiSelectChange(
                            index,
                            option,
                            e.target.checked
                          )
                        }
                      />
                      <Label
                        htmlFor={`question-${index}-option-${optIndex}`}
                        className="cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex pt-4">
            <Button
              type="submit"
              color="blue"
              disabled={submitting}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationFormUser;
