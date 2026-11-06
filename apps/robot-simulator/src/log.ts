export async function testConnection(robotId: string) {
  const response = await fetch(`${process.env.API_URL}/robots/${robotId}`, {
    //Auth headers
  })

  return response.ok
}

export async function log(robotId: string, state: object) {
  console.log({ robotId, metrics: state });
  const response = await fetch(`${process.env.API_URL}/signals`, {
    method: 'POST',
    body: JSON.stringify({ robotId, metrics: state }),
    //Auth headers
  })
  return response.ok
}
