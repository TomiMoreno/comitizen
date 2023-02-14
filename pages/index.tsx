import { useState } from "react"
import Head from "next/head"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function IndexPage() {
  const [taskDescription, setTaskDescription] = useState("")
  const [taskName, setTaskName] = useState("")
  const [commitMessage, setCommitMessage] = useState("")
  return (
    <Layout>
      <Head>
        <title>Next.js</title>
        <meta
          name="description"
          content="Next.js template for building apps with Radix UI and Tailwind CSS"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center justify-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-center gap-2">
          <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Turn task descriptions into commits
          </h1>
        </div>
        <Input
          className="w-full"
          placeholder="Enter task name here"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <Textarea
          className="w-full"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Enter task description here"
        />
        <div className="flex gap-4">
          <Button
            onClick={() => {
              console.log(taskDescription)
            }}
            className={buttonVariants({
              className: "w-full text-lg",
              size: "lg",
            })}
          >
            Create Commit
          </Button>
        </div>
      </section>
    </Layout>
  )
}
