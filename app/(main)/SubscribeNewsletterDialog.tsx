"use client";

import Link from "next/link";
import { useState } from "react";
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
import mixpanel from "mixpanel-browser";

// 이메일 유효성 검사 스키마
const formSchema = z.object({
  email: z.email("유효하지 않은 이메일 주소입니다."),
});

type FormValues = z.infer<typeof formSchema>;

interface SubscribeNewsletterDialogProps {
  triggerComponent?: React.ReactNode;
  triggerTracking?: {
    event: string;
    properties: Record<string, string>;
  };
}

export function SubscribeNewsletterDialog({
  triggerComponent,
  triggerTracking,
}: SubscribeNewsletterDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await subscribeToNewsletter(values.email);

    if (result.success) {
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

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        mixpanel.track("close@modal", {
          page_name: "home",
          object_section: "newsletter_subscribe_modal",
          object_id: "newsletter_subscribe_modal",
          object_name: "newsletter_subscribe_modal",
        });
      }}
    >
      <DialogTrigger
        asChild
        onClick={() => {
          if (triggerTracking) {
            mixpanel.track(triggerTracking.event, triggerTracking.properties);
          }
        }}
      >
        {triggerComponent}
      </DialogTrigger>
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
              render={({ field }) => {
                const { onBlur, ...fieldProps } = field;
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 border-black"
                        placeholder="your@email.com"
                        onBlur={() => {
                          onBlur();
                          mixpanel.track("input@email", {
                            page_name: "home",
                            object_section: "newsletter_subscribe_modal",
                            object_id: "newsletter_subscribe_email",
                            object_name: "newsletter_subscribe_email",
                          });
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <DialogFooter>
              <Button
                className="w-full h-12"
                type="submit"
                onClick={() => {
                  mixpanel.track("click@button", {
                    page_name: "home",
                    object_section: "newsletter_subscribe_modal",
                    object_id: "무료 구독 시작하기",
                    object_name: "무료 구독 시작하기",
                  });
                }}
              >
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
                mixpanel.track("click@link", {
                  page_name: "home",
                  object_section: "newsletter_subscribe_modal",
                  object_id: "구독 취소",
                  object_name: "구독 취소",
                });
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
                setOpen(false);
                mixpanel.track("click@link", {
                  page_name: "home",
                  object_section: "newsletter_subscribe_modal",
                  object_id: "개인정보처리방침",
                  object_name: "개인정보처리방침",
                });
              }}
            >
              개인정보처리방침
            </Link>
            과{" "}
            <Link
              href="/policy/marketing"
              className="underline font-semibold"
              onClick={() => {
                setOpen(false);
                mixpanel.track("click@link", {
                  page_name: "home",
                  object_section: "newsletter_subscribe_modal",
                  object_id: "마케팅 정보 수신",
                  object_name: "마케팅 정보 수신",
                });
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
