import { cn } from "@/lib/utils";
import type { RequestStatus, RequestType, UserRole } from "@/types";
import { Flag } from "lucide-react";

interface StatusBadgeProps {
    status: RequestStatus
    className?: string
}
export const StatusBadge: React.FC<StatusBadgeProps> = ({status, className}) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'PENDING':
                return { label: 'Pending', class: 'badge-pending' }
            case 'APPROVED': 
                return { label: 'Approved', class: 'badge-approved'}
            case 'REJECTED':
                return { label: 'Rejected', class: 'badge-rejected'}
            case 'NEEDS_REVIEW':
                return { label: 'Needs Review', class: 'badge-review'}
            case 'CANCELLED':
                return { label: 'Cancelled', class: 'badge-cancelled'}
            default: 
                return { label: status, class: 'bg-muted text-muted-foreground' }
        }
    }

    const config = getStatusConfig()

    return (
        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', config.class, className)}>
            {config.label}
        </span>
    )
}

interface TypeBadgeProps {
    type: RequestType
    className?: string
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, className }) => {
    const getTypeConfig = () => {
        switch (type) {
            case 'LEAVE':
                return { label: 'Leave', class: 'badge-leave' }
            case 'EXPENSE':
                return { label: 'Expense', class: 'badge-expense' }
            case 'DISCOUNT':
                return { label: 'Discount', class: 'badge-discount' }
            default:
                return { lebel: type, class: 'bg-muted text-muted-foreground' }
        }
    }

    const config = getTypeConfig()

    return (
        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', config.class, className)}>
      {config.label}
    </span>
    )
}

interface RoleBadgeProps {
    role: UserRole
    className?: string 
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className }) => {
  const getRoleConfig = () => {
    switch (role) {
      case 'ADMIN':
        return { label: 'Admin', class: 'badge-admin' }
      case 'MANAGER':
        return { label: 'Manager', class: 'badge-manager' }
      case 'USER':
        return { label: 'User', class: 'badge-user' }
      default:
        return { label: role, class: 'bg-muted text-muted-foreground' }
    }
  }

  const config = getRoleConfig();

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', config.class, className)}>
      {config.label}
    </span>
  )
}

interface FlaggedBadgeProps {
    className?: string
}

export const FlaggedBadge: React.FC<FlaggedBadgeProps> = ({ className}) => {
    return (
        <span
            className={cn(
        'inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive',
        className
      )}
    >
      <Flag className="h-3 w-3" />
      Flagged
        </span>
    )
}