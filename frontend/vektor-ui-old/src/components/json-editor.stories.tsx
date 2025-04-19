import type { Meta, StoryObj } from "@storybook/react"
import JsonEditor from "./json-editor"

const meta: Meta<typeof JsonEditor> = {
  title: "Components/JsonEditor",
  component: JsonEditor,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof JsonEditor>

export const Default: Story = {
  args: {
    value: "",
    onChange: (value) => console.log("JSON changed:", value),
  },
}

export const WithValidJson: Story = {
  args: {
    value: '{"name": "John", "age": 30}',
    onChange: (value) => console.log("JSON changed:", value),
  },
}

export const WithInvalidJson: Story = {
  args: {
    value: '{"name": "John", age: 30}',
    onChange: (value) => console.log("JSON changed:", value),
  },
} 