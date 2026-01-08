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

// 이메일 유효성 검사 스키마
const formSchema = z.object({
  email: z.string().email("유효하지 않은 이메일 주소입니다."),
});

type FormValues = z.infer<typeof formSchema>;

export default function UnsubscribePage() {
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
    <div>
      {/* Header section - NewsletterBanner와 유사한 높이 유지 */}
      <div className="flex justify-center bg-black text-white p-8 md:p-12">
        <div className="container px-4 flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">뉴스레터 구독 취소</h1>
          <p className="text-gray-300 text-sm md:text-base">
            더 이상 뉴스레터를 받고 싶지 않으신가요? 언제든지 다시 구독하실 수
            있습니다.
          </p>
        </div>
      </div>

      {/* Main content - Home 페이지와 동일한 container 구조 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              이메일 주소를 입력해주세요
            </h2>
            <p className="text-sm text-gray-600">
              구독을 취소하실 이메일 주소를 입력해주시면 더 이상 뉴스레터를
              보내드리지 않습니다.
            </p>
          </div>

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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full h-12"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "처리 중..." : "구독 취소하기"}
              </Button>
            </form>
          </Form>

          <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-2">
            <p className="font-semibold">안내사항</p>
            <ul className="list-disc list-inside space-y-1">
              <li>구독 취소 처리는 즉시 완료됩니다.</li>
              <li>
                이미 발송된 이메일은 받으실 수 있으며, 다음 발송부터 제외됩니다.
              </li>
              <li>언제든지 다시 구독하실 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
