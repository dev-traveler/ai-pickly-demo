"use client";

import { useState, useSyncExternalStore } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, Check, Sparkles } from "lucide-react";

// ============================================================================
// Types & Constants
// ============================================================================

interface UserProfile {
  jobRole: string;
  experience: string;
}

const ONBOARDING2_STORAGE_KEY = "onboarding2.userProfile";
const ONBOARDING2_EVENT_KEY = "onboarding2-profile-saved";

const JOB_ROLES = [
  { id: "development", label: "💻 개발" },
  { id: "design", label: "🎨 디자인" },
  { id: "pm-po", label: "📋 PM/PO" },
  { id: "marketing", label: "📢 마케팅" },
  { id: "md", label: "🛍️ MD" },
  { id: "self-employed", label: "🏪 자영업" },
  { id: "student", label: "📚 학생" },
  { id: "etc", label: "✨ 기타" },
] as const;

const EXPERIENCE_LEVELS = [
  { id: "entry", label: "🌱 신입", description: "0-1년" },
  { id: "junior", label: "🌿 주니어", description: "2-4년" },
  { id: "middle", label: "🌳 미들", description: "5-7년" },
  { id: "senior", label: "⛰️ 시니어", description: "8년 이상" },
] as const;

// ============================================================================
// Local Storage Sync (useSyncExternalStore pattern)
// ============================================================================

const subscribeToOnboarding2 = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => { };
  }

  const handler = (event: Event) => {
    if (event instanceof StorageEvent && event.key !== ONBOARDING2_STORAGE_KEY) {
      return;
    }
    callback();
  };

  window.addEventListener("storage", handler);
  window.addEventListener(ONBOARDING2_EVENT_KEY, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(ONBOARDING2_EVENT_KEY, handler);
  };
};

// 캐시를 사용하여 동일한 데이터에 대해 동일한 참조 반환
let cachedProfileJson: string | null = null;
let cachedProfile: UserProfile | null = null;

const getProfileSnapshot = (): UserProfile | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(ONBOARDING2_STORAGE_KEY);

    // 캐시된 값과 동일하면 캐시된 객체 반환
    if (stored === cachedProfileJson) {
      return cachedProfile;
    }

    // 새로운 값이면 파싱 후 캐시 갱신
    cachedProfileJson = stored;
    cachedProfile = stored ? (JSON.parse(stored) as UserProfile) : null;
    return cachedProfile;
  } catch {
    cachedProfileJson = null;
    cachedProfile = null;
    return null;
  }
};

const getProfileServerSnapshot = (): UserProfile | null => null;

// ============================================================================
// Step Indicator Component
// ============================================================================

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2 mb-6">
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isActiveOrCompleted = stepNumber <= currentStep;

          return (
            <div
              key={stepNumber}
              className={cn(
                "h-1.5 w-12 rounded-full transition-colors duration-300",
                isActiveOrCompleted ? "bg-primary" : "bg-muted-foreground/20"
              )}
            />
          );
        })}
      </div>
      <span className="text-sm text-muted-foreground">
        {currentStep}/{totalSteps} 단계
      </span>
    </div>
  );
}

// ============================================================================
// Step Components
// ============================================================================

interface JobRoleStepProps {
  selectedRole: string;
  onSelect: (role: string) => void;
  onNext: () => void;
}

function JobRoleStep({ selectedRole, onSelect, onNext }: JobRoleStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">직무를 알려주세요</h2>
        <p className="text-muted-foreground text-sm">
          AI Pickly가 맞춤 콘텐츠를 추천해 드릴게요
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {JOB_ROLES.map((role) => (
          <Button
            key={role.id}
            variant={selectedRole === role.id ? "default" : "outline"}
            className={cn(
              "h-12 transition-all duration-200",
              selectedRole === role.id && "ring-2 ring-primary/20"
            )}
            onClick={() => onSelect(role.id)}
          >
            {role.label}
          </Button>
        ))}
      </div>

      <Button
        className="w-full"
        size="lg"
        disabled={!selectedRole}
        onClick={onNext}
      >
        다음
      </Button>
    </div>
  );
}

interface ExperienceStepProps {
  selectedExperience: string;
  onSelect: (experience: string) => void;
  onNext: () => void;
  onBack: () => void;
}

function ExperienceStep({
  selectedExperience,
  onSelect,
  onNext,
  onBack,
}: ExperienceStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">경력이 어떻게 되시나요?</h2>
        <p className="text-muted-foreground text-sm">
          수준에 맞는 콘텐츠를 추천해 드릴게요
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {EXPERIENCE_LEVELS.map((level) => (
          <Button
            key={level.id}
            variant={selectedExperience === level.id ? "default" : "outline"}
            className={cn(
              "h-16 flex-col gap-0.5 transition-all duration-200",
              selectedExperience === level.id && "ring-2 ring-primary/20"
            )}
            onClick={() => onSelect(level.id)}
          >
            <span className="font-medium">{level.label}</span>
            <span className="text-xs opacity-70">{level.description}</span>
          </Button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} className="px-4">
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          className="flex-1"
          size="lg"
          disabled={!selectedExperience}
          onClick={onNext}
        >
          완료
        </Button>
      </div>
    </div>
  );
}

interface WelcomeStepProps {
  profile: UserProfile;
  onStart: () => void;
}

function WelcomeStep({ profile, onStart }: WelcomeStepProps) {
  const jobLabel =
    JOB_ROLES.find((r) => r.id === profile.jobRole)?.label ?? profile.jobRole;
  const expLevel = EXPERIENCE_LEVELS.find((e) => e.id === profile.experience);
  const expLabel = expLevel
    ? `${expLevel.label} (${expLevel.description})`
    : profile.experience;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
          <Sparkles className="size-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">환영합니다!</h2>
        <p className="text-muted-foreground text-sm">
          당신이 AI를 잘 활용하기 위해 필요한 콘텐츠를 준비할께요.
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">직무</span>
          <span className="font-medium">{jobLabel}</span>
        </div>
        <div className="border-t border-border" />
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">경력</span>
          <span className="font-medium">{expLabel}</span>
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={onStart}>
        시작하기
      </Button>
    </div>
  );
}

// ============================================================================
// Main Dialog Component
// ============================================================================

export function OnboardingDialog2() {
  const savedProfile = useSyncExternalStore(
    subscribeToOnboarding2,
    getProfileSnapshot,
    getProfileServerSnapshot
  );

  const [dialogOpen, setDialogOpen] = useState(() => !getProfileSnapshot());
  const [step, setStep] = useState(1);
  const [jobRole, setJobRole] = useState("");
  const [experience, setExperience] = useState("");

  const saveProfileAndClose = () => {
    const profile: UserProfile = { jobRole, experience };

    try {
      localStorage.setItem(ONBOARDING2_STORAGE_KEY, JSON.stringify(profile));
      window.dispatchEvent(new Event(ONBOARDING2_EVENT_KEY));
    } catch {
      // 로컬 스토리지 접근 실패 시에도 세션 내에서는 닫히도록 처리
    }

    setDialogOpen(false);
  };

  const handleNextFromJobRole = () => {
    setStep(2);
  };

  const handleNextFromExperience = () => {
    setStep(3);
  };

  const handleBackToJobRole = () => {
    setStep(1);
  };

  const showOnboarding = !savedProfile && dialogOpen;

  return (
    <Dialog open={showOnboarding} onOpenChange={setDialogOpen}>
      <DialogContent
        className="max-w-[calc(100%-2rem)] sm:max-w-md p-6"
        showCloseButton={false}
      >
        {step < 3 && <StepIndicator currentStep={step} totalSteps={2} />}

        {step === 1 && (
          <JobRoleStep
            selectedRole={jobRole}
            onSelect={setJobRole}
            onNext={handleNextFromJobRole}
          />
        )}

        {step === 2 && (
          <ExperienceStep
            selectedExperience={experience}
            onSelect={setExperience}
            onNext={handleNextFromExperience}
            onBack={handleBackToJobRole}
          />
        )}

        {step === 3 && (
          <WelcomeStep
            profile={{ jobRole, experience }}
            onStart={saveProfileAndClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
