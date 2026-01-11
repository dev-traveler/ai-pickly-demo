"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
import { unsubscribeFromNewsletter } from "@/lib/db/newsletter";
import mixpanel from "mixpanel-browser";

const formSchema = z.object({
  email: z.email("유효하지 않은 이메일 주소입니다."),
});

type FormValues = z.infer<typeof formSchema>;

export function UnsubscribeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      const result = await unsubscribeFromNewsletter(values.email);

      if (result.success) {
        toast.success("구독 취소가 완료됐습니다.");
        form.reset();
      } else {
        switch (result.error) {
          case "INVALID_EMAIL":
            form.setError("email", {
              message: "유효하지 않은 이메일입니다.",
            });
            break;
          case "EMAIL_NOT_FOUND":
            toast.error(
              "해당 이메일로 등록된 구독이 없습니다. 구독 상태가 아니거나 이미 취소된 것 같습니다."
            );
            break;
          case "DATABASE_ERROR":
            toast.error("오류가 발생했습니다. 다시 시도해주세요.");
            break;
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
                      if (!fieldProps.value) return;
                      mixpanel.track("input@email", {
                        page_name: "newsletter_unsubscribe",
                        object_section: "body",
                        object_id: fieldProps.value,
                        object_name: fieldProps.value,
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

        <Button
          className="w-full h-12"
          type="submit"
          disabled={isSubmitting}
          onClick={() => {
            mixpanel.track("click@button", {
              page_name: "newsletter_unsubscribe",
              object_section: "body",
              object_id: "구독 취소하기",
              object_name: "구독 취소하기",
            });
          }}
        >
          {isSubmitting ? "처리 중..." : "구독 취소하기"}
        </Button>
      </form>
    </Form>
  );
}
