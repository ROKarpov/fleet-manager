import { recordSignal } from '#/controllers/signals'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/signals/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let data
        try {
          data = await request.json()
        } catch (e) {
          const message =
            e instanceof Error ? e.message : 'Incorrect input'
          return new Response(message, { status: 400 })
        }
        try {
          await recordSignal(data)
        } catch (e) {
          const message =
            e instanceof Error ? e.message : 'Something went wrong'
          return new Response(message, { status: 500 })
        }
        return new Response('', { status: 200 })
      },
    },
  },
})
