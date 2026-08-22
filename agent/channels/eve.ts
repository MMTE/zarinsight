import { eveChannel } from 'eve/channels/eve';
import { localDev, none } from 'eve/channels/auth';

// ADR-0011: judges chat anonymously (none); the eve TUI/localhost uses localDev.
// No authenticated principal exists yet — live-provider keys never enter agent scope.
export default eveChannel({
  auth: [localDev(), none()],
});
