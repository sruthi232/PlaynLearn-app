import { IdeaToIncome } from "@/components/games/IdeaToIncome";
import { useNavigate } from "react-router-dom";

export default function IdeaToIncomePage() {
  const navigate = useNavigate();

  return (
    <IdeaToIncome
      onComplete={(score) => {
        // Navigate back to Entrepreneurship gamified page after game completion
        navigate("/student/entrepreneurship", {
          state: { gameCompleted: true, score }
        });
      }}
    />
  );
}
