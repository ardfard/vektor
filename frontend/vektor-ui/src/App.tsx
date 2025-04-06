import FileUploadUI from "./components/file-upload-ui"

function App() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Document Analysis Tool</h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Upload your documents and provide a JSON specification to define how they should be parsed and analyzed.
      </p>
      <FileUploadUI />
    </main>
  )
}

export default App

