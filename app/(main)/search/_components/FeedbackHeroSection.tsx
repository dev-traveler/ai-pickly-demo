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
        object_section: "feedback_hero",
        object_id: "content_feedback",
        object_name: "content_feedback",
        request_content: values.request,
      });
      toast.success("요청이 접수되었습니다. 좋은 콘텐츠로 찾아뵐게요!");
      form.reset();
      setIsSubmitted(true);
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

  if (isSubmitted) {
    return (
      <div className="w-full mt-8 rounded-2xl bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20 p-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="rounded-full bg-primary/10 p-3">
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
            <div className="rounded-full bg-primary/10 p-2 shrink-0">
              <MailIcon className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">
              원하는 콘텐츠를 요청해 보세요
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed text-left">
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
                          object_section: "feedback_hero",
                          object_id: "content_request",
                          object_name: "content_request",
                          request_content: field.value,
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
                      onBlur={(e) => {
                        field.onBlur();
                        if (!field.value) return;
                        mixpanel.track("input@email", {
                          page_name: "search",
                          object_section: "feedback_hero",
                          object_id: "feedback_email",
                          object_name: "feedback_email",
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
                  object_section: "feedback_hero",
                  object_id: "submit_feedback",
                  object_name: "콘텐츠 요청하기",
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
    </div>
  );
}
