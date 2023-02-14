import { useState } from "react"
import Head from "next/head"
import { Loader } from "lucide-react"

import { Layout } from "@/components/layout"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function IndexPage() {
  const [taskDescription, setTaskDescription] = useState("")
  const [taskName, setTaskName] = useState("")
  const [generatedCommits, setGeneratedCommits] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [numberOfCommits, setNumberOfCommits] = useState(1)

  const createCommit = async () => {
    setGeneratedCommits("")
    setIsLoading(true)
    const promptStart =
      numberOfCommits < 2
        ? "Write one commit message with at most 50 characters for the following task:"
        : `Write ${numberOfCommits} commit messages with at most 50 characters for the following task:`
    const prompt = `${promptStart}
    
    ${taskName}

    ${taskDescription}

    Commit messages:`
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    })
    console.log("Edge function returned.")
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()

    let done = false
    let tempState = ""

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const newValue = decoder
        .decode(value)
        .replaceAll("data: ", "")
        .split("\n\n")
        .filter(Boolean)

      if (tempState) {
        newValue[0] = tempState + newValue[0]
        tempState = ""
      }

      newValue.forEach((newVal) => {
        if (newVal === "[DONE]") {
          return
        }

        try {
          const json = JSON.parse(newVal) as {
            id: string
            object: string
            created: number
            choices?: {
              text: string
              index: number
              logprobs: null
              finish_reason: null | string
            }[]
            model: string
          }

          if (!json.choices?.length) {
            throw new Error("Something went wrong.")
          }

          const choice = json.choices[0]
          setGeneratedCommits((prev) => prev + choice.text)
        } catch (error) {
          tempState = newVal
        }
      })
    }

    setIsLoading(false)
  }
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
        <Label htmlFor="numberOfCommits">Number of commits</Label>
        <Input
          type="number"
          value={numberOfCommits}
          onChange={(e) => setNumberOfCommits(Number(e.target.value))}
        />

        <Textarea
          className="w-full"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Enter task description here"
        />
        <div className="flex gap-4">
          <Button
            onClick={createCommit}
            className={buttonVariants({
              className: "w-full text-lg",
              size: "lg",
            })}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create Commit"
            )}
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {generatedCommits.split("\n").map((commit) => (
            <div key={commit}>{commit}</div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
