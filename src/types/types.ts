export default class Task {
  public todo_id: string
  public detail: string
  public due_date: string
  public priority: Priority

  constructor(
    todo_id: string,
    detail: string,
    due_date: string,
    priority: Priority
  ) {
    this.todo_id = todo_id
    this.detail = detail
    this.due_date = due_date
    this.priority = priority
  }
}

export enum Priority {
  URGENT = "Urgent",
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

export const Urgency_Color = {
  Urgent: "bg-red-500",
  High: "bg-yellow-500",
  Medium: "bg-blue-500",
  Low: "bg-green-500",
}
