#!/bin/bash

# Test script to verify CortexAI is working properly
echo "Testing CortexAI functionality..."

# Test 1: Basic response
echo "show me the current project status" | timeout 30s node agent.js --skip-projects | head -20

echo ""
echo "If the above shows a formatted response from the AI, the agent is working correctly!"
echo ""
echo "To run the full version with project management:"
echo "  npm start"
echo ""
echo "To skip project management:"
echo "  node agent.js --skip-projects"