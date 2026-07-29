import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { validateUrl } from "../../utils/validators";

const SubmissionForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    projectName: "",
    problemStatement: "",
    solution: "",
    githubRepo: "",
    liveDemoUrl: "",
    techStack: "",
    demoVideoLink: "",
  });

  const [errors, setErrors] = useState({
    projectName: "",
    problemStatement: "",
    solution: "",
    githubRepo: "",
    liveDemoUrl: "",
  });

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));

    if (field === "projectName") {
      setErrors((prev) => ({ ...prev, projectName: val.trim() ? "" : "Project name is required." }));
    }
    if (field === "problemStatement") {
      setErrors((prev) => ({ ...prev, problemStatement: val.trim() ? "" : "Problem statement is required." }));
    }
    if (field === "solution") {
      setErrors((prev) => ({ ...prev, solution: val.trim() ? "" : "Solution description is required." }));
    }
    if (field === "githubRepo") {
      setErrors((prev) => ({ ...prev, githubRepo: val.trim() ? validateUrl(val) : "GitHub repository URL is required." }));
    }
    if (field === "liveDemoUrl") {
      setErrors((prev) => ({ ...prev, liveDemoUrl: validateUrl(val) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameErr    = form.projectName.trim() ? "" : "Project name is required.";
    const probErr    = form.problemStatement.trim() ? "" : "Problem statement is required.";
    const solErr     = form.solution.trim() ? "" : "Solution description is required.";
    const gitErr     = form.githubRepo.trim() ? validateUrl(form.githubRepo) : "GitHub repository URL is required.";
    const demoErr    = validateUrl(form.liveDemoUrl);

    if (nameErr || probErr || solErr || gitErr || demoErr) {
      setErrors({
        projectName: nameErr,
        problemStatement: probErr,
        solution: solErr,
        githubRepo: gitErr,
        liveDemoUrl: demoErr,
      });
      return;
    }

    onSubmit(form);
  };

  const hasErrors =
    !!errors.projectName ||
    !!errors.problemStatement ||
    !!errors.solution ||
    !!errors.githubRepo ||
    !!errors.liveDemoUrl ||
    !form.projectName ||
    !form.problemStatement ||
    !form.solution ||
    !form.githubRepo;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-normal">
      <Input
        id="projectName"
        label="Project Name"
        value={form.projectName}
        onChange={handleChange("projectName")}
        error={errors.projectName}
        required
        placeholder="e.g. AgentFlow AI"
      />

      <Input
        id="problemStatement"
        label="Problem Statement"
        rows={3}
        value={form.problemStatement}
        onChange={handleChange("problemStatement")}
        error={errors.problemStatement}
        required
        placeholder="What problem does your project address?"
      />

      <Input
        id="solution"
        label="Solution Description"
        rows={3}
        value={form.solution}
        onChange={handleChange("solution")}
        error={errors.solution}
        required
        placeholder="Describe how your project solves the problem..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="githubRepo"
          label="GitHub Repository URL"
          type="url"
          value={form.githubRepo}
          onChange={handleChange("githubRepo")}
          error={errors.githubRepo}
          required
          placeholder="https://github.com/org/repo"
        />

        <Input
          id="liveDemoUrl"
          label="Live Demo / Deployment URL"
          type="url"
          value={form.liveDemoUrl}
          onChange={handleChange("liveDemoUrl")}
          error={errors.liveDemoUrl}
          placeholder="https://demo.example.app"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="techStack"
          label="Tech Stack Tags (Comma-separated)"
          value={form.techStack}
          onChange={handleChange("techStack")}
          placeholder="React, Node.js, Python, OpenCV"
        />

        <Input
          id="demoVideoLink"
          label="Demo Video Link (Loom / YouTube)"
          type="url"
          value={form.demoVideoLink}
          onChange={handleChange("demoVideoLink")}
          placeholder="https://loom.com/share/..."
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full mt-4 cursor-pointer"
        disabled={loading || hasErrors}
      >
        {loading ? "Submitting Project..." : "Submit Project →"}
      </Button>
    </form>
  );
};

export default SubmissionForm;
