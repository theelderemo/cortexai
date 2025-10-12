# Plugin Development Guide

This guide will help you create custom plugins for CortexAI, enabling you to extend the agent's capabilities with your own security tools and scanners.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Plugin Structure](#plugin-structure)
- [Creating Your First Plugin](#creating-your-first-plugin)
- [Best Practices](#best-practices)

## Overview

The CortexAI Plugin System allows you to:
- Wrap existing security tools (nmap, sqlmap, burp suite, etc.)
- Create custom scanners and checkers
- Integrate third-party APIs
- Add specialized functionality without modifying core code
- Share tools with the community

## Getting Started

### Quick Start

1. Copy the plugin template:
   ```bash
   cp plugins/plugin-template.js plugins/custom/my-plugin.js
   ```

2. Edit the plugin and customize it

3. Start CortexAI - your plugin will be loaded automatically:
   ```bash
   npm start
   ```

For complete documentation, see the [plugins/README.md](../../plugins/README.md) file.

## Plugin Structure

```javascript
export default {
  name: 'plugin-name',
  version: '1.0.0',
  description: 'What it does',
  author: 'Your Name',
  
  tools: [/* tool definitions */],
  async handler(toolName, args) { /* implementation */ }
};
```

## Creating Your First Plugin

See [plugins/README.md](../../plugins/README.md) for a complete walkthrough.

## Best Practices

- Validate all inputs
- Handle errors gracefully
- Use appropriate timeouts
- Never log sensitive data
- Document your tools well
- Test thoroughly

---

For detailed information, refer to [plugins/README.md](../../plugins/README.md)
