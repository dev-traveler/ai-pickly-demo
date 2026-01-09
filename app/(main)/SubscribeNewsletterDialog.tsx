"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/db/newsletter";
import {
  trackNewsletterModalOpen,
  trackNewsletterEmailInput,
  trackNewsletterSubmitClick,
  trackNewsletterSuccessImpression,
  trackNewsletterPolicyLinkClick,
} from "@/lib/tracking";

// 이메일 유효성 검사 스키마
const formSchema = z.object({
  email: z.email("유효하지 않은 이메일 주소입니다."),
});

type FormValues = z.infer<typeof formSchema>;

interface SubscribeNewsletterDialogProps {
  triggerComponent?: React.ReactNode;
  onTriggerClick?: () => void;
}

export function SubscribeNewsletterDialog({
  triggerComponent,
  onTriggerClick,
}: SubscribeNewsletterDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 모달 열림 추적
  useEffect(() => {
    if (open) {
      trackNewsletterModalOpen({ is_open: true });
    }
  }, [open]);

  async function onSubmit(values: FormValues) {
    trackNewsletterSubmitClick();
    const result = await subscribeToNewsletter(values.email);

    if (result.success) {
      trackNewsletterSuccessImpression();
      toast.success("구독 신청이 완료됐습니다.");
      form.reset();
      setOpen(false);
    } else {
      switch (result.error) {
        case "INVALID_EMAIL":
          form.setError("email", {
            message: "유효하지 않은 이메일입니다.",
          });
          break;
        case "DUPLICATE_EMAIL":
          toast.info("이미 구독중인 이메일입니다.");
          form.reset();
          setOpen(false);
          break;
        case "DATABASE_ERROR":
          toast.error("오류가 발생했습니다. 다시 시도해주세요.");
          break;
      }
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && onTriggerClick) {
      onTriggerClick();
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI 뉴스레터 구독하기</DialogTitle>
          <DialogDescription>
            피클리 에디터가 선정한 최신 AI 콘텐츠를 제일 빠르게 받아보세요.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 border-black"
                      placeholder="your@email.com"
                      onBlur={() => {
                        trackNewsletterEmailInput();
                        field.onBlur();
                      }}
                      onChange={field.onChange}
                      value={field.value}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button className="w-full h-12" type="submit">
                무료 구독 시작하기
              </Button>
            </DialogFooter>
          </form>
        </Form>

        <ul className="p-4 pb-2 text-xs text-gray-500 list-disc space-y-2">
          <li>
            언제든지 뉴스레터 구독을{" "}
            <Link
              href="/newsletter/unsubscribe"
              className="underline font-semibold"
              onClick={() => {
                trackNewsletterPolicyLinkClick({
                  link_id: "unsubscribe",
                  name: "취소",
                });
                setOpen(false);
              }}
            >
              취소
            </Link>
            할 수 있어요.
          </li>
          <li>
            뉴스레터 구독 시{" "}
            <Link
              href="/policy/privacy"
              className="underline font-semibold"
              onClick={() => {
                trackNewsletterPolicyLinkClick({
                  link_id: "privacy",
                  name: "개인정보처리방침",
                });
                setOpen(false);
              }}
            >
              개인정보처리방침
            </Link>
            과{" "}
            <Link
              href="/policy/marketing"
              className="underline font-semibold"
              onClick={() => {
                trackNewsletterPolicyLinkClick({
                  link_id: "marketing",
                  name: "마케팅 정보 수신",
                });
                setOpen(false);
              }}
            >
              마케팅 정보 수신
            </Link>
            에 동의한 것으로 간주해요.
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  );
}
