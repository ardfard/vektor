import type { Meta, StoryObj } from "@storybook/react"
import ResultDisplay from "./result-display"

const meta: Meta<typeof ResultDisplay> = {
  title: "Components/ResultDisplay",
  component: ResultDisplay,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof ResultDisplay>

export const Default: Story = {
  args: {
    result: {
      status: "success",
      data: {
        files: ["document1.pdf", "image1.jpg"],
        analysis: {
          confidence: 0.95,
          extractedText: "Sample extracted text",
        },
      },
    },
  },
}

export const ComplexData: Story = {
  args: {
    result: {
      status: "success",
      data: {
        files: ["document1.pdf", "image1.jpg", "image2.png"],
        analysis: {
          confidence: 0.95,
          extractedText: "Sample extracted text",
          metadata: {
            author: "John Doe",
            date: "2024-04-06",
            version: "1.0",
          },
          entities: [
            { type: "person", value: "John Doe", confidence: 0.98 },
            { type: "date", value: "2024-04-06", confidence: 0.99 },
          ],
        },
      },
    },
  },
} 