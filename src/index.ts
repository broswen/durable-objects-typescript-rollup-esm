// In order for the workers runtime to find the class that implements
// our Durable Object namespace, we must export it from the root module.
export { CounterTs } from './counter'

export default {
  async fetch(request: Request, env: Env) {
    try {
      return await handleRequest(request, env)
    } catch (e) {
      return new Response(`${e}`)
    }
  },
}

async function handleRequest(request: Request, env: Env) {
  const id = env.COUNTER.idFromName('A')
  const obj = env.COUNTER.get(id)
  const resp = await obj.fetch(request.url)
  const count = parseInt(await resp.text())
  const wasOdd = count % 2 == 1 ? 'is odd' : 'is even'

  return new Response(`${count} ${wasOdd}`)
}

interface Env {
  COUNTER: DurableObjectNamespace
}
