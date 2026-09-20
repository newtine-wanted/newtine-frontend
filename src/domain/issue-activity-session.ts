let issueActivitySessionId: string | null = null;

export function getIssueActivitySessionId(): string {
  issueActivitySessionId ??= crypto.randomUUID();
  return issueActivitySessionId;
}
