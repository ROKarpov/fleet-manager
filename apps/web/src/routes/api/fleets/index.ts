import { getFleets } from '#/controllers/fleets'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/fleets/')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const fleets = await getFleets()
          return new Response(JSON.stringify(fleets), { status: 200 })
        } catch (e) {
          const message =
            e instanceof Error ? e.message : 'Something went wrong'
          return new Response(message, { status: 500 })
        }
      },
    },
  },
})
