#!/bin/bash
# Plugin System Validation Test

echo "=================================="
echo "Plugin System Validation Test"
echo "=================================="
echo ""

echo "1. Checking file structure..."
echo ""

FILES=(
    "lib/ToolRegistry.js"
    "lib/PluginLoader.js"
    "plugins/README.md"
    "plugins/QUICK_START.md"
    "plugins/plugin.json.template"
    "plugins/example-plugin/plugin.json"
    "plugins/example-plugin/index.js"
    "PLUGIN_SYSTEM.md"
    "PLUGIN_IMPLEMENTATION_SUMMARY.md"
    "PLUGIN_ARCHITECTURE.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
    fi
done

echo ""
echo "2. Checking agent.js modifications..."
echo ""

if grep -q "ToolRegistry" agent.js; then
    echo "✅ ToolRegistry import found"
else
    echo "❌ ToolRegistry import missing"
fi

if grep -q "PluginLoader" agent.js; then
    echo "✅ PluginLoader import found"
else
    echo "❌ PluginLoader import missing"
fi

if grep -q "registerCoreTools" agent.js; then
    echo "✅ registerCoreTools function found"
else
    echo "❌ registerCoreTools function missing"
fi

if grep -q "toolRegistry.getTools()" agent.js; then
    echo "✅ toolRegistry.getTools() usage found"
else
    echo "❌ toolRegistry.getTools() usage missing"
fi

if grep -q "toolRegistry.getHandler" agent.js; then
    echo "✅ toolRegistry.getHandler() usage found"
else
    echo "❌ toolRegistry.getHandler() usage missing"
fi

echo ""
echo "3. Validating example plugin..."
echo ""

if [ -f "plugins/example-plugin/plugin.json" ]; then
    echo "✅ plugin.json exists"
    
    # Check required fields
    if grep -q '"name"' plugins/example-plugin/plugin.json; then
        echo "✅ Has 'name' field"
    fi
    if grep -q '"version"' plugins/example-plugin/plugin.json; then
        echo "✅ Has 'version' field"
    fi
    if grep -q '"author"' plugins/example-plugin/plugin.json; then
        echo "✅ Has 'author' field"
    fi
    if grep -q '"tools"' plugins/example-plugin/plugin.json; then
        echo "✅ Has 'tools' field"
    fi
else
    echo "❌ plugin.json missing"
fi

if [ -f "plugins/example-plugin/index.js" ]; then
    echo "✅ index.js exists"
    
    if grep -q "export async function init" plugins/example-plugin/index.js; then
        echo "✅ Has init() export"
    fi
    
    if grep -q "toolRegistry.register" plugins/example-plugin/index.js; then
        echo "✅ Calls toolRegistry.register()"
    fi
else
    echo "❌ index.js missing"
fi

echo ""
echo "4. Testing agent startup..."
echo ""

# Try to start agent for 3 seconds and capture output
AGENT_OUTPUT=$(timeout 3 node agent.js 2>&1 || true)

if echo "$AGENT_OUTPUT" | grep -q "Registering core tools"; then
    echo "✅ Core tools registration works"
else
    echo "❌ Core tools registration failed"
fi

if echo "$AGENT_OUTPUT" | grep -q "Scanning plugins directory"; then
    echo "✅ Plugin scanning works"
else
    echo "❌ Plugin scanning failed"
fi

if echo "$AGENT_OUTPUT" | grep -q "Loading plugin: example-plugin"; then
    echo "✅ Example plugin loads"
else
    echo "❌ Example plugin failed to load"
fi

if echo "$AGENT_OUTPUT" | grep -q "base64_encode"; then
    echo "✅ Plugin tools registered (base64_encode)"
else
    echo "❌ Plugin tools not registered"
fi

if echo "$AGENT_OUTPUT" | grep -q "Tool Registry:"; then
    TOOL_COUNT=$(echo "$AGENT_OUTPUT" | grep "Tool Registry:" | grep -oP '\d+' | head -1)
    echo "✅ Tool Registry initialized with $TOOL_COUNT tools"
else
    echo "❌ Tool Registry not initialized"
fi

if echo "$AGENT_OUTPUT" | grep -q "Successfully loaded 1 plugin"; then
    echo "✅ Plugin successfully loaded"
else
    echo "❌ Plugin loading incomplete"
fi

echo ""
echo "=================================="
echo "Validation Complete!"
echo "=================================="
echo ""

# Count successes
SUCCESS_COUNT=$(echo "$AGENT_OUTPUT" | grep -c "✅" || echo "0")
echo "Summary: Check the results above"
echo ""
echo "If all items show ✅, the plugin system is working correctly!"
