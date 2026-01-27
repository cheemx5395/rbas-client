import type { ToastModel } from "@/types";
import * as React from "react"

type ToastInput = Omit<ToastModel, "id">

interface State {
  toasts: ToastModel[]
}

type Action =
  | { type: "ADD_TOAST"; toast: ToastModel }
  | { type: "UPDATE_TOAST"; toast: Partial<ToastModel> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000 * 5 // 5 seconds

let count = 0
const genId = () => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach(t => addToRemoveQueue(t.id))
      }

      return {
        ...state,
        toasts: state.toasts.map(t =>
          toastId === undefined || t.id === toastId
            ? { ...t, open: false }
            : t
        ),
      }
    }

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts:
          action.toastId === undefined
            ? []
            : state.toasts.filter(t => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach(listener => listener(memoryState))
}

function toast(props: ToastInput) {
  const id = genId()

  const dismiss = () =>
    dispatch({ type: "DISMISS_TOAST", toastId: id })

  const update = (props: Partial<ToastModel>) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
    },
  })

  return { id, dismiss, update }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
