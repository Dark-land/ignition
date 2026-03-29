import { NextRequest, NextResponse } from 'next/server'

const CIA_API_URL =
  process.env.NEXT_PUBLIC_CIA_API_URL || ''

export async function POST(req: NextRequest) {
  try {
    const { message, session_id, password } = await req.json()

    // Explicitly construct the upstream payload
    const payload: Record<string, string> = { message }
    if (session_id) payload.session_id = session_id
    if (password) payload.password = password

    const response = await fetch(CIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const responseText = await response.text()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Upstream API failed with status ${response.status}`,
          details: responseText,
        },
        { status: response.status }
      )
    }

    // Try to return JSON, fall back to plain text
    try {
      const json = JSON.parse(responseText)
      return NextResponse.json(json)
    } catch {
      return new NextResponse(responseText, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Proxy request failed', details: message },
      { status: 500 }
    )
  }
}
