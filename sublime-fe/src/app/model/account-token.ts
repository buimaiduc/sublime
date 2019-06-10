export class AccountToken {
  pusherChannel: string;
  authenticatedAs: string;
  awaitingToken: boolean;
  mfaRequired: boolean;
  session_id: string;
}
