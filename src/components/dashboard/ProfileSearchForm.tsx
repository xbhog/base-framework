"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Zod Schema 定义
const searchFormSchema = z.object({
  query: z.string()
    .min(2, {
      message: "Search query must be at least 2 characters.",
    })
    .max(100, {
      message: "Search query must not exceed 100 characters.",
    }),
})

type SearchFormValues = z.infer<typeof searchFormSchema>

interface ProfileSearchFormProps {
  userEmail?: string
  userName?: string
}

export function ProfileSearchForm({ userEmail, userName }: ProfileSearchFormProps) {
  const [searchResult, setSearchResult] = useState<string | null>(null)

  // 初始化 React Hook Form
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      query: "",
    },
  })

  // 提交处理
  function onSubmit(data: SearchFormValues) {
    // 模拟搜索逻辑 - 在真实场景中这里会调用 API
    const query = data.query.toLowerCase()
    const matchesEmail = userEmail?.toLowerCase().includes(query)
    const matchesName = userName?.toLowerCase().includes(query)

    if (matchesEmail || matchesName) {
      setSearchResult(`✓ Found match for "${data.query}"`)
    } else {
      setSearchResult(`✗ No match found for "${data.query}"`)
    }

    // 3秒后清除结果
    setTimeout(() => {
      setSearchResult(null)
    }, 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Search</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search your profile</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Search by name or email..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-3">
              <Button type="submit" size="sm">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  form.reset()
                  setSearchResult(null)
                }}
              >
                Clear
              </Button>
              {searchResult && (
                <span className={`text-sm ${searchResult.startsWith('✓') ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {searchResult}
                </span>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
