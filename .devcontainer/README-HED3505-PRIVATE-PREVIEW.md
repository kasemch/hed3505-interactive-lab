# HED3505 iPad private preview — GitHub Codespaces

This configuration is for a **private Codespaces forwarded port**, not GitHub Pages or a public deployment.

1. Open the repository on branch `hed3505-final-class-neon-staging-01` in GitHub Codespaces (Code → Codespaces → Create codespace on branch). This requires Codespaces entitlement and a GitHub login.
2. In the Codespaces terminal: `cd neon-final-class && npm ci && npm run dev -- --host 0.0.0.0 --port 5173`.
3. Open the PORTS panel; set port 5173 visibility to **Private**. Do not change it to Public or Organization. Open the forwarded URL from the authenticated GitHub session on iPad.
4. Check the browser origin and the Neon Auth redirect/trusted-origin policy. Do not add a wildcard trusted origin or disable verification. If the private forwarded origin is rejected, record the error and stop. No signed-session result may be claimed.
5. Use only the authorized staging test accounts and synthetic identifiers. Do not paste OTP, cookies, tokens or passwords into chat, GitHub issues, Actions logs or evidence.
6. Shut down the Codespace when finished to avoid unintended resource usage.

**Security limitation:** Private Codespaces port visibility gates access to the preview page, not the public Neon Auth/Data API endpoints. Database RLS must still enforce every data boundary. The source repository remains public, including its existing lecturer key; excluding the key from a build artifact does not remove it from repository history.

**Status:** configuration only; no Codespace created, no URL issued, no auth verification, no migration, no merge and no deployment.
