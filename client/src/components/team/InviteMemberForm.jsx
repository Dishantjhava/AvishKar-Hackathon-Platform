import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { validateEmail } from "../../utils/validators";

const InviteMemberForm = ({ onInvite, loading }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setError(validateEmail(val));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setError(err);
      return;
    }
    onInvite(email);
    setEmail("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end font-normal">
      <div className="flex-1 w-full">
        <Input
          id="inviteEmail"
          label="Teammate Email Address"
          type="email"
          value={email}
          onChange={handleChange}
          error={error}
          required
          placeholder="teammate@example.com"
        />
      </div>
      <Button variant="primary" size="md" type="submit" disabled={loading || !!error || !email}>
        {loading ? "Sending..." : "Send Invite →"}
      </Button>
    </form>
  );
};

export default InviteMemberForm;
