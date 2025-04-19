import type { Meta, StoryObj } from "@storybook/react"
import FileUploadUI from "./file-upload-ui"

const meta: Meta<typeof FileUploadUI> = {
  title: "Components/FileUploadUI",
  component: FileUploadUI,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FileUploadUI>

export const Default: Story = {
  args: {},
}

// Note: FileUploadUI is a self-contained component that manages its own state
// so we don't need to pass any props. The stories will demonstrate different
// states through user interaction in the Storybook UI. 