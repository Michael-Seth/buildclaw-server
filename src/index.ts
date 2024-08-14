import app from "./app"

async function startServer() {
  try {
    const port = 4210
    app.listen(port, () => {
      console.log(`Server started on port ${port} 🔥🔥🔥`)
    })
    process.once("SIGUSR2", function () {
      process.kill(process.pid, "SIGUSR2")
    })

    process.on("SIGINT", function () {
      process.kill(process.pid, "SIGINT")
    })
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Database connection error: ${err.message}`)
    } else {
      console.error(`Unexpected error during startup: ${err}`)
    }
    process.exit(1)
  }
}

startServer()
