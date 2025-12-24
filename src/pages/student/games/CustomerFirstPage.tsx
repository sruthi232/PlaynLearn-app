import { CustomerFirst } from "@/components/games/CustomerFirst";
import { useNavigate } from "react-router-dom";

export default function CustomerFirstPage() {
  const navigate = useNavigate();

  return (
    <CustomerFirst
      onComplete={(score) => {
        // Navigate back to Entrepreneurship gamified page after game completion
        navigate("/student/entrepreneurship", {
          state: { gameCompleted: true, score }
        });
      }}
    />
  );
}
