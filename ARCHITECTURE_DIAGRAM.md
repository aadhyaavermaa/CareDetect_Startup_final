# Multilingual Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         index.js                             │
│                  <LanguageProvider>                          │
│                        <App />                               │
│                  </LanguageProvider>                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Provides Context
                              ▼
┌───────────────────────────────────