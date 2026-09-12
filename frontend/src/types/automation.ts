// Automation types

export type AutomationStatus = 'idle' | 'pending_confirmation' | 'executing' | 'success' | 'failed';
export type ActionCategory = 'file_management' | 'application_control' | 'file_search' | 'media' | 'code';

export interface AutomationCommand {
  id: string;
  rawInput: string;
  parsedAction: string;
  actionCategory: ActionCategory;
  parameters: Record<string, string>;
  isDestructive: boolean;
  status: AutomationStatus;
  timestamp: Date;
  result?: string;
  error?: string;
}

export interface ConfirmationRequest {
  commandId: string;
  action: string;
  description: string;
  warningMessage: string;
}
