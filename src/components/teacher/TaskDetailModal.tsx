/**
 * TASK DETAIL MODAL
 * Shows task instructions, student submission, reflection, and teacher verification checklist
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Image,
  FileText,
  Clock,
  BookOpen,
  CheckSquare,
  AlertCircle,
} from "lucide-react";

interface TaskWithSubmission {
  id: string;
  title: string;
  category: "family" | "village" | "subject";
  instructions: string;
  coinReward: number;
  submittedAt: string;
  studentName: string;
  proofType: "photo" | "text";
  proofContent: string;
  proofUrl?: string;
  reflection: string;
  status: "pending" | "verified" | "rejected";
}

interface TaskDetailModalProps {
  task: TaskWithSubmission | null;
  open: boolean;
  onClose: () => void;
  onVerify: (taskId: string) => void;
  onReject: (taskId: string) => void;
}

export function TaskDetailModal({
  task,
  open,
  onClose,
  onVerify,
  onReject,
}: TaskDetailModalProps) {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("submission");
  const [checkedItems, setCheckedItems] = useState({
    understanding: false,
    effort: false,
    completed: false,
  });

  if (!task) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "village":
        return "bg-secondary/10 border-secondary/30 text-secondary";
      case "subject":
        return "bg-primary/10 border-primary/30 text-primary";
      case "family":
        return "bg-accent/10 border-accent/30 text-accent";
      default:
        return "bg-muted/10 border-muted/30 text-muted-foreground";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "village":
        return t("teacher.villageTask", { defaultValue: "Village Task" });
      case "subject":
        return t("teacher.subjectTask", { defaultValue: "Subject Task" });
      case "family":
        return t("teacher.familyTask", { defaultValue: "Family Task" });
      default:
        return category;
    }
  };

  const allChecked = Object.values(checkedItems).every(Boolean);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getCategoryColor(
                    task.category
                  )}`}
                >
                  {getCategoryLabel(task.category)}
                </span>
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {task.title}
              </DialogTitle>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">
                {t("teacher.coinsReward", { defaultValue: "Coins Reward" })}
              </p>
              <p className="text-2xl font-heading font-bold text-accent">
                {task.coinReward}
              </p>
            </div>
          </div>
          <DialogDescription className="flex items-center gap-2 text-sm">
            <span>
              {t("teacher.submittedBy", { defaultValue: "Submitted by" })}{" "}
              <strong>{task.studentName}</strong>
            </span>
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {task.submittedAt}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submission" className="gap-2">
              <FileText className="h-4 w-4" />
              {t("teacher.submission", { defaultValue: "Submission" })}
            </TabsTrigger>
            <TabsTrigger value="instructions" className="gap-2">
              <BookOpen className="h-4 w-4" />
              {t("teacher.instructions", { defaultValue: "Instructions" })}
            </TabsTrigger>
            <TabsTrigger value="checklist" className="gap-2">
              <CheckSquare className="h-4 w-4" />
              {t("teacher.checklist", { defaultValue: "Checklist" })}
            </TabsTrigger>
          </TabsList>

          {/* Submission Tab */}
          <TabsContent value="submission" className="space-y-4">
            {/* Proof Content */}
            <Card className="border-border/50 bg-card/40 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t("teacher.studentProof", {
                  defaultValue: "Student Submission",
                })}
              </p>

              {task.proofType === "photo" && task.proofUrl ? (
                <div className="rounded-lg overflow-hidden bg-muted/20 h-64 flex items-center justify-center">
                  <img
                    src={task.proofUrl}
                    alt="Student submission"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-lg bg-muted/10 p-4 border border-border/50">
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {task.proofContent}
                  </p>
                </div>
              )}
            </Card>

            {/* Learning Reflection */}
            {task.reflection && (
              <Card className="border-secondary/30 bg-secondary/5 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary/70 mb-2">
                  {t("teacher.learningReflection", {
                    defaultValue: "Student's Learning Reflection",
                  })}
                </p>
                <p className="text-sm text-foreground">{task.reflection}</p>
              </Card>
            )}

            {/* Proof Type Badge */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {task.proofType === "photo" ? (
                <>
                  <Image className="h-4 w-4" />
                  <span>{t("teacher.photoEvidence", { defaultValue: "Photo evidence" })}</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>{t("teacher.textSubmission", { defaultValue: "Text submission" })}</span>
                </>
              )}
            </div>
          </TabsContent>

          {/* Instructions Tab */}
          <TabsContent value="instructions" className="space-y-4">
            <Card className="border-primary/30 bg-primary/5 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-3">
                {t("teacher.taskInstructions", {
                  defaultValue: "Task Instructions",
                })}
              </p>
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {task.instructions}
              </p>
            </Card>

            <Card className="border-border/50 bg-card/40 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {t("teacher.expectedOutcome", {
                  defaultValue: "What to Look For",
                })}
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  {t("teacher.evidenceOfLearning", {
                    defaultValue: "Evidence that student understands the concept",
                  })}
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  {t("teacher.effortShown", {
                    defaultValue: "Genuine effort and thoughtfulness",
                  })}
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  {t("teacher.completionQuality", {
                    defaultValue: "Task completed according to instructions",
                  })}
                </li>
              </ul>
            </Card>
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="space-y-4">
            <Card className="border-secondary/30 bg-secondary/5 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary/70 mb-4">
                {t("teacher.verificationChecklist", {
                  defaultValue: "Teacher Verification Checklist",
                })}
              </p>

              <div className="space-y-3">
                {/* Checklist Item 1 */}
                <button
                  onClick={() =>
                    setCheckedItems({
                      ...checkedItems,
                      understanding: !checkedItems.understanding,
                    })
                  }
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                    checkedItems.understanding
                      ? "border-secondary/50 bg-secondary/10"
                      : "border-muted/30 bg-muted/5"
                  }`}
                >
                  <div
                    className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${
                      checkedItems.understanding
                        ? "border-secondary bg-secondary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {checkedItems.understanding && (
                      <CheckCircle2 className="h-3 w-3 text-card" />
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t("teacher.understandingShown", {
                        defaultValue: "Understanding Shown?",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("teacher.understandingDesc", {
                        defaultValue: "Does the submission show genuine understanding?",
                      })}
                    </p>
                  </div>
                </button>

                {/* Checklist Item 2 */}
                <button
                  onClick={() =>
                    setCheckedItems({
                      ...checkedItems,
                      effort: !checkedItems.effort,
                    })
                  }
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                    checkedItems.effort
                      ? "border-secondary/50 bg-secondary/10"
                      : "border-muted/30 bg-muted/5"
                  }`}
                >
                  <div
                    className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${
                      checkedItems.effort
                        ? "border-secondary bg-secondary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {checkedItems.effort && (
                      <CheckCircle2 className="h-3 w-3 text-card" />
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t("teacher.effortGenuine", {
                        defaultValue: "Effort Genuine?",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("teacher.effortDesc", {
                        defaultValue: "Is the effort authentic and thoughtful?",
                      })}
                    </p>
                  </div>
                </button>

                {/* Checklist Item 3 */}
                <button
                  onClick={() =>
                    setCheckedItems({
                      ...checkedItems,
                      completed: !checkedItems.completed,
                    })
                  }
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                    checkedItems.completed
                      ? "border-secondary/50 bg-secondary/10"
                      : "border-muted/30 bg-muted/5"
                  }`}
                >
                  <div
                    className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${
                      checkedItems.completed
                        ? "border-secondary bg-secondary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {checkedItems.completed && (
                      <CheckCircle2 className="h-3 w-3 text-card" />
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t("teacher.properlyCompleted", {
                        defaultValue: "Properly Completed?",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("teacher.completionDesc", {
                        defaultValue: "Was the task completed according to instructions?",
                      })}
                    </p>
                  </div>
                </button>
              </div>

              {/* Summary */}
              {allChecked && (
                <div className="mt-4 p-3 rounded-lg bg-secondary/10 border border-secondary/20 flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-secondary">
                    {t("teacher.readyToVerify", {
                      defaultValue: "All checks passed! Ready to verify and award coins.",
                    })}
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("common.close", { defaultValue: "Close" })}
          </Button>
          <Button
            variant="destructive"
            onClick={() => onReject(task.id)}
          >
            {t("teacher.needsRevision", {
              defaultValue: "Needs Revision",
            })}
          </Button>
          <Button
            onClick={() => onVerify(task.id)}
            disabled={!allChecked}
            className="bg-secondary hover:bg-secondary/90"
          >
            {t("teacher.verifyTask", {
              defaultValue: "Verify & Award",
            })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
