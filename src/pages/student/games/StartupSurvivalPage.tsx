import { StartupSurvival } from "@/components/games/StartupSurvival";
import { useNavigate } from "react-router-dom";

export default function StartupSurvivalPage() {
  const navigate = useNavigate();

  return (
    <StartupSurvival
      onComplete={(score) => {
        // Navigate back to Entrepreneurship gamified page after game completion
        navigate("/student/entrepreneurship", {
          state: { gameCompleted: true, score }
        });
      }}
    />
  );
}
