# MemoryLine

MemoryLine is a hackathon demo app for caregiver-managed voice AI reminder
calls.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Real ElevenLabs Calls

The app works in mock mode by default. The "Call Now" buttons call
`app/api/call-now/route.ts`, which returns demo data unless real calls are
enabled.

To enable real outbound calls:

1. Create an ElevenLabs Agent.
2. Connect a Twilio phone number to the agent in ElevenLabs.
3. Copy `.env.example` to `.env.local`.
4. Fill in:
   - `ELEVENLABS_API_KEY`
   - `ELEVENLABS_AGENT_ID`
   - `ELEVENLABS_AGENT_PHONE_NUMBER_ID`
5. Set `ENABLE_REAL_CALLS=true`.
6. Restart the dev server or redeploy on Vercel.

Keep `.env.local` private. Do not paste API keys into frontend files.

On Vercel, add the same values under Project Settings > Environment Variables.

## Safety

Use real calls only with consent from demo recipients. MemoryLine is a
supportive reminder tool and does not provide medical advice, emergency
response, or professional caregiving.
