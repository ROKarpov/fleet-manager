import { Card, CardContent } from '#/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import type { RobotSignal } from '#/generated/prisma/browser'
import { routeFactory } from '#/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useTable, type ColumnDef } from '@tanstack/react-table'

type RobotSignalTableContentProps = { signals: RobotSignal[] }

const signalsTableColumns: ColumnDef<{}, RobotSignal>[] = [
  {
    id: 'coordinates',
    header: 'Coordinates',
    accessorFn: ({ metrics }) => {
      if (
        metrics &&
        typeof metrics === 'object' &&
        !Array.isArray(metrics) &&
        'position' in metrics
      ) {
        const position = metrics.position as { x: number; y: number }
        return `(${position.x}, ${position.y})`
      }
      return '-'
    },
  },
  {
    id: 'status',
    header: 'Status',
    accessorFn: ({ metrics }) => {
      if (
        metrics &&
        typeof metrics === 'object' &&
        !Array.isArray(metrics) &&
        'status' in metrics
      ) {
        return metrics.status
      }
      return '-'
    },
  },
  {
    id: 'receivedAt',
    header: 'Last updated at',
    accessorFn: ({ receivedAt }) => receivedAt,
  },
]

function SignalsTableContent({ signals }: RobotSignalTableContentProps) {
  const table = useTable({
    data: signals,
    features: {},
    columns: signalsTableColumns,
  })

  const tableRows = table.getRowModel().rows

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                rowSpan={header.rowSpan}
              >
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {tableRows.length ? (
          tableRows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className="text-center"
            >
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

type RobotSignalsTableProps = {
  robotId: string
}

export function RobotSignalsTable({ robotId }: RobotSignalsTableProps) {
  const {
    data: signals,
    isFetching,
    isError,
  } = useQuery({
    queryKey: routeFactory.signals.all(robotId),
    queryFn: () =>
      fetch(`/api/robots/${robotId}/signals`).then(
        (response): Promise<RobotSignal[]> => response.json(),
      ),
  })

  if (isFetching) {
    return 'Loading'
  }

  if (isError) {
    return 'Error loading data'
  }

  return <SignalsTableContent signals={signals ?? []} />
}
