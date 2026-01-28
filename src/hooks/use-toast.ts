import { toast as sonnerToast } from "sonner"
import type { ToastModel } from "@/types"

type ToastInput = Omit<ToastModel, "id">

function toast(props: ToastInput) {
    const { title, description, variant, ...rest } = props

    if (variant === "destructive") {
        return sonnerToast.error(title, {
            description,
            ...rest,
        })
    }

    return sonnerToast(title, {
        description,
        ...rest,
    })
}

function useToast() {
    return {
        toast,
        dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
    }
}

export { useToast, toast }
