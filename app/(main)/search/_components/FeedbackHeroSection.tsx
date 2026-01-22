"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContentFeedback } from "@/lib/db/feedback";
import { subscribeToNewsletter } from "@/lib/db/newsletter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import mixpanel from "mixpanel-browser";

const formSchema = z.object({
  email: z.email("유효하지 않은 이메일 주소입니다."),
  request: z
    .string()
    .min(1, "원하는 콘텐츠를 입력해주세요.")
    .max(500, "500자 이내로 입력해주세요."),
});

type FormValues = z.infer<typeof formSchema>;

export function FeedbackHeroSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showNewsletterDialog, setShowNewsletterDialog] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      request: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await submitContentFeedback(
      values.email,
      values.request,
    );

    if (result.success) {
      mixpanel.track("submit@feedback", {
        page_name: "search",
        object_section: "body",
        object_id: "content_feedback",
        object_name: "content_feedback",
        request_content: values.request,
      });
      toast.success("요청이 접수되었습니다. 좋은 콘텐츠로 찾아뵐게요!");
      setSubmittedEmail(values.email);
      form.reset();
      setShowNewsletterDialog(true);
    } else {
      switch (result.error) {
        case "INVALID_EMAIL":
          form.setError("email", {
            message: "유효하지 않은 이메일입니다.",
          });
          break;
        case "EMPTY_REQUEST":
          form.setError("request", {
            message: "원하는 콘텐츠를 입력해주세요.",
          });
          break;
        case "DATABASE_ERROR":
          toast.error("오류가 발생했습니다. 다시 시도해주세요.");
          break;
      }
    }
  }

  async function handleNewsletterSubscribe() {
    setIsSubscribing(true);
    const result = await subscribeToNewsletter(submittedEmail);
    setIsSubscribing(false);

    if (result.success) {
      toast.success("뉴스레터 구독이 완료되었습니다!");
    } else {
      switch (result.error) {
        case "DUPLICATE_EMAIL":
          toast.info("이미 구독중인 이메일입니다.");
          break;
      }
    }

    setShowNewsletterDialog(false);
    setIsSubmitted(true);
  }

  function handleNewsletterDecline() {
    setShowNewsletterDialog(false);
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div className="w-full mt-8 rounded-2xl bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20 p-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-1">
            <MailIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              요청해 주셔서 감사합니다!
            </p>
            <p className="text-sm text-muted-foreground">
              좋은 콘텐츠를 모아서 이메일로 보내드릴게요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20 p-6">
      <div className="flex flex-col space-y-4">
        {/* 헤더 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1 shrink-0">
              <MailIcon className="h-5 w-5 text-primary" />
            </div>
            <h4 className="text-base font-semibold text-foreground">
              원하는 콘텐츠를 요청해 보세요
            </h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed text-left">
            찾고 계신 작업이나 카테고리를 알려주시면, 피클리 에디터가 좋은 콘텐츠를 모아서 이메일로 보내드릴게요.
          </p>
        </div>

        {/* 폼 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="request"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    어떤 콘텐츠를 찾고 계신가요? <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="예: ChatGPT로 블로그 글 쓰는 법, Midjourney 프롬프트 팁"
                      className="min-h-20 resize-none bg-background"
                      {...field}
                      onBlur={() => {
                        field.onBlur();
                        if (!field.value) return;
                        mixpanel.track("input@request", {
                          page_name: "search",
                          object_section: "body",
                          object_id: field.value,
                          object_name: field.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    이메일 주소 <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="h-12 bg-background"
                      {...field}
                      onBlur={() => {
                        field.onBlur();
                        if (!field.value) return;
                        mixpanel.track("input@email", {
                          page_name: "search",
                          object_section: "body",
                          object_id: "콘텐츠 요청 이메일",
                          object_name: "콘텐츠 요청 이메일",
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12"
              onClick={() => {
                mixpanel.track("click@button", {
                  page_name: "search",
                  object_section: "body",
                  object_id: "콘텐츠 요청하기",
                  object_name: "콘텐츠 요청하기",
                  request_content: form.getValues("request"),
                });
              }}
            >
              콘텐츠 요청하기
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              보내주신 정보는 콘텐츠 추천 목적으로만 사용됩니다.
            </p>
          </form>
        </Form>
      </div>

      <Dialog open={showNewsletterDialog} onOpenChange={setShowNewsletterDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>뉴스레터 구독</DialogTitle>
            <DialogDescription>
              최신 AI 콘텐츠를 가장 빠르게 받아볼 수 있는 뉴스레터도 함께 구독하시겠어요?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                mixpanel.track("click@button", {
                  page_name: "search",
                  object_section: "modal",
                  object_id: "아니오",
                  object_name: "아니오",
                });
                handleNewsletterDecline();
              }}
              disabled={isSubscribing}
            >
              아니오
            </Button>
            <Button
              onClick={() => {
                mixpanel.track("click@button", {
                  page_name: "search",
                  object_section: "modal",
                  object_id: "무료 구독 시작하기",
                  object_name: "무료 구독 시작하기",
                });
                handleNewsletterSubscribe();
              }}
              disabled={isSubscribing}
            >
              무료 구독 시작하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
