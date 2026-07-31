export default async function notices() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1.0/notices", {
      method: "GET"
    })

    const data = response.json()

    if(!response.ok) {
      throw new Error(`Error trying to fetch notices: ${response.status} ${data || await response.text()}`)
    }

    return data
  }
  catch (err) {
    console.error("error with trying to get notices", err instanceof Error ? err.message : "unknown error")
  }
    
}