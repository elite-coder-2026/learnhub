Implement a "Go Live" feature for instructors in LearnHub — a pre-stream
setup screen plus live broadcast controls, in the spirit of YouTube's
"Go Live" flow.

Scope:
- Instructor can preview their camera/mic before going live
- Instructor picks a camera and microphone from custom dropdowns (no
  native <select> elements anywhere)
- Instructor fills in a stream title, description, and visibility
  (public / unlisted-enrolled-only / private-invited-only)
- "Go live" button starts a real WebRTC broadcast: getUserMedia capture,
  RTCPeerConnection, and signaling over a WebSocket to our media server
- While live: show a live badge with elapsed time, a viewer count badge,
  mute mic / toggle camera buttons, and an "End stream" button
- Handle and surface errors: camera/mic permission denied, lost
  connection, signaling errors

Signaling contract to implement against (adjust if our media server
expects something different — check for an existing signaling client
before writing a new one):
Broadcaster -> server: { type: 'start', sdp, meta }, { type: 'ice-candidate', candidate }, { type: 'stop' }
Server -> broadcaster: { type: 'answer', sdp }, { type: 'ice-candidate', candidate }, { type: 'viewer-count', count }, { type: 'error', message }, { type: 'ended' }

Conventions to follow:
- React + TypeScript
- styled-components, imported as `import * as S from './X.styles'`,
  with `$`-prefixed transient props
- Every component wrapped in a card: padding, border, border-radius
- Custom dropdown components only — build with div/state/click-outside,
  never a native <select>
- Async arrow functions everywhere in JS/TS, never `async function`

Before writing new code, look for and reuse: an existing custom
dropdown component, an existing WebSocket/signaling helper, and
existing card/button styled-components — match their existing look
rather than introducing new visual patterns.

Deliverable: the Go Live screen wired into the instructor course view,
with camera/mic preview, the setup form, and live controls, using a
real WebRTC connection (not mocked).