#!/bin/bash
# CortexOS Docker Test Script
# Validates the Docker image build and basic functionality

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                CortexOS Docker Test Suite                         ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

FAILED_TESTS=0
PASSED_TESTS=0

print_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED_TESTS++))
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED_TESTS++))
}

# Test 1: Docker availability
print_test "Checking Docker availability..."
if command -v docker &> /dev/null; then
    print_pass "Docker is installed"
else
    print_fail "Docker is not installed"
    exit 1
fi

# Test 2: Build the image
print_test "Building CortexOS image..."
if docker build -t cortexos:test -f Dockerfile . > /tmp/docker-build.log 2>&1; then
    print_pass "Image built successfully"
else
    print_fail "Image build failed"
    cat /tmp/docker-build.log
    exit 1
fi

# Test 3: Image exists
print_test "Verifying image exists..."
if docker images | grep -q "cortexos.*test"; then
    print_pass "Image found in Docker images"
else
    print_fail "Image not found"
    exit 1
fi

# Test 4: Container starts
print_test "Testing container startup..."
if docker run --rm cortexos:test echo "Container started" > /dev/null 2>&1; then
    print_pass "Container starts successfully"
else
    print_fail "Container failed to start"
fi

# Test 5: Health check
print_test "Running health check..."
if docker run --rm cortexos:test /usr/local/bin/healthcheck.sh > /dev/null 2>&1; then
    print_pass "Health check passed"
else
    print_fail "Health check failed"
fi

# Test 6: Node.js availability
print_test "Checking Node.js installation..."
NODE_VERSION=$(docker run --rm cortexos:test node --version 2>/dev/null || echo "")
if [ -n "$NODE_VERSION" ]; then
    print_pass "Node.js is installed: $NODE_VERSION"
else
    print_fail "Node.js not found"
fi

# Test 7: CortexAI files
print_test "Verifying CortexAI installation..."
if docker run --rm cortexos:test test -f /opt/cortexai/agent.js; then
    print_pass "CortexAI files present"
else
    print_fail "CortexAI files missing"
fi

# Test 8: Essential security tools
print_test "Checking essential security tools..."
TOOLS=("nmap" "sqlmap" "nikto" "metasploit" "hydra" "john" "hashcat" "gobuster" "ffuf")
MISSING_TOOLS=()

for tool in "${TOOLS[@]}"; do
    if ! docker run --rm cortexos:test which $tool > /dev/null 2>&1; then
        MISSING_TOOLS+=("$tool")
    fi
done

if [ ${#MISSING_TOOLS[@]} -eq 0 ]; then
    print_pass "All essential tools present"
else
    print_fail "Missing tools: ${MISSING_TOOLS[*]}"
fi

# Test 9: Python tools
print_test "Checking Python installation..."
PYTHON_VERSION=$(docker run --rm cortexos:test python3 --version 2>/dev/null || echo "")
if [ -n "$PYTHON_VERSION" ]; then
    print_pass "Python is installed: $PYTHON_VERSION"
else
    print_fail "Python not found"
fi

# Test 10: Go tools
print_test "Checking Go installation..."
GO_VERSION=$(docker run --rm cortexos:test go version 2>/dev/null || echo "")
if [ -n "$GO_VERSION" ]; then
    print_pass "Go is installed: $GO_VERSION"
else
    print_fail "Go not found"
fi

# Test 11: Wordlists
print_test "Checking wordlist availability..."
if docker run --rm cortexos:test test -d /usr/share/wordlists; then
    print_pass "Wordlists directory present"
else
    print_fail "Wordlists directory missing"
fi

# Test 12: CortexAI command wrapper
print_test "Testing CortexAI command wrapper..."
if docker run --rm cortexos:test test -x /usr/local/bin/cortexai; then
    print_pass "CortexAI wrapper executable"
else
    print_fail "CortexAI wrapper not executable"
fi

# Test 13: Directory structure
print_test "Verifying directory structure..."
DIRS=("/root/.cortexai" "/opt/workspace" "/opt/reports" "/opt/wordlists")
MISSING_DIRS=()

for dir in "${DIRS[@]}"; do
    if ! docker run --rm cortexos:test test -d "$dir"; then
        MISSING_DIRS+=("$dir")
    fi
done

if [ ${#MISSING_DIRS[@]} -eq 0 ]; then
    print_pass "All directories present"
else
    print_fail "Missing directories: ${MISSING_DIRS[*]}"
fi

# Test 14: Image size check
print_test "Checking image size..."
IMAGE_SIZE=$(docker images cortexos:test --format "{{.Size}}")
echo -e "${BLUE}[INFO]${NC} Image size: ${IMAGE_SIZE}"

# Test 15: Test with Docker Compose
if [ -f docker-compose.yml ]; then
    print_test "Testing Docker Compose configuration..."
    if docker-compose config > /dev/null 2>&1; then
        print_pass "Docker Compose configuration valid"
    else
        print_fail "Docker Compose configuration invalid"
    fi
else
    echo -e "${YELLOW}[SKIP]${NC} Docker Compose file not found"
fi

# Summary
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                        Test Summary                               ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Tests Passed: ${GREEN}${PASSED_TESTS}${NC}"
echo -e "Tests Failed: ${RED}${FAILED_TESTS}${NC}"
echo ""

# Cleanup
print_test "Cleaning up test image..."
docker rmi cortexos:test > /dev/null 2>&1 || true
print_pass "Cleanup complete"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║           All Tests Passed! Ready for Release! ✓                 ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}╔═══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║              Some Tests Failed - Review Required                  ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
