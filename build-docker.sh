#!/bin/bash
# CortexOS Docker Build and Release Script
# Build, tag, and optionally push the CortexOS Docker image

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="cortexos"
REGISTRY="${DOCKER_REGISTRY:-}"  # Set via environment or leave empty for Docker Hub
VERSION=$(grep -oP '(?<="version": ")[^"]*' package.json)
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              CortexOS Docker Build Script v${VERSION}              ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

print_success "Docker is installed"

# Check if running as root or in docker group
if ! docker ps &> /dev/null; then
    print_error "Cannot connect to Docker daemon. Make sure Docker is running and you have permissions."
    exit 1
fi

# Parse command line arguments
BUILD_ONLY=false
PUSH=false
LATEST=false
NO_CACHE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --build-only)
            BUILD_ONLY=true
            shift
            ;;
        --push)
            PUSH=true
            shift
            ;;
        --latest)
            LATEST=true
            shift
            ;;
        --no-cache)
            NO_CACHE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --build-only    Build the image without tagging for release"
            echo "  --push          Push the image to registry after building"
            echo "  --latest        Also tag as 'latest'"
            echo "  --no-cache      Build without using cache"
            echo "  --help          Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  DOCKER_REGISTRY    Docker registry URL (default: Docker Hub)"
            echo ""
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Create necessary directories
print_info "Creating required directories..."
mkdir -p workspace reports custom-wordlists

# Check if .env exists
if [ ! -f .env ]; then
    print_warning ".env file not found. You'll need to configure it before running the container."
    if [ -f .env.template ]; then
        print_info "Template available at .env.template"
    fi
fi

# Determine image tags
if [ -n "$REGISTRY" ]; then
    BASE_TAG="${REGISTRY}/${IMAGE_NAME}"
else
    BASE_TAG="${IMAGE_NAME}"
fi

VERSION_TAG="${BASE_TAG}:${VERSION}"
TAGS=("${VERSION_TAG}")

if [ "$LATEST" = true ]; then
    LATEST_TAG="${BASE_TAG}:latest"
    TAGS+=("${LATEST_TAG}")
fi

# Build the image
print_info "Building CortexOS Docker image..."
print_info "Version: ${VERSION}"
print_info "Tags: ${TAGS[*]}"
echo ""

BUILD_CMD="docker build"
if [ "$NO_CACHE" = true ]; then
    BUILD_CMD="${BUILD_CMD} --no-cache"
fi

BUILD_CMD="${BUILD_CMD} \
    --build-arg BUILD_DATE=${BUILD_DATE} \
    --build-arg VERSION=${VERSION} \
    -t ${VERSION_TAG}"

if [ "$LATEST" = true ]; then
    BUILD_CMD="${BUILD_CMD} -t ${LATEST_TAG}"
fi

BUILD_CMD="${BUILD_CMD} -f Dockerfile ."

print_info "Executing: ${BUILD_CMD}"
echo ""

if eval ${BUILD_CMD}; then
    print_success "Docker image built successfully!"
    echo ""
else
    print_error "Docker build failed!"
    exit 1
fi

# Show image info
print_info "Image information:"
docker images | grep -E "REPOSITORY|${IMAGE_NAME}"
echo ""

# Display image size
IMAGE_SIZE=$(docker images ${VERSION_TAG} --format "{{.Size}}")
print_info "Image size: ${IMAGE_SIZE}"
echo ""

# Test the image
print_info "Testing the image..."
if docker run --rm ${VERSION_TAG} /usr/local/bin/healthcheck.sh; then
    print_success "Health check passed!"
else
    print_warning "Health check had warnings, but image is built"
fi
echo ""

# Push to registry if requested
if [ "$PUSH" = true ]; then
    if [ -z "$REGISTRY" ]; then
        print_warning "No registry specified. Set DOCKER_REGISTRY environment variable."
        read -p "Push to Docker Hub? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Skipping push to registry"
            PUSH=false
        fi
    fi
    
    if [ "$PUSH" = true ]; then
        print_info "Pushing images to registry..."
        for tag in "${TAGS[@]}"; do
            print_info "Pushing ${tag}..."
            if docker push "${tag}"; then
                print_success "Pushed ${tag}"
            else
                print_error "Failed to push ${tag}"
            fi
        done
        echo ""
    fi
fi

# Summary
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                       Build Complete!                             ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""
print_info "To run the container:"
echo "  docker run -it --rm ${VERSION_TAG}"
echo ""
print_info "Or use Docker Compose:"
echo "  docker-compose up -d"
echo ""
print_info "To start an interactive session:"
echo "  docker run -it --rm -v \$(pwd)/workspace:/opt/workspace ${VERSION_TAG}"
echo ""
print_info "To run CortexAI directly:"
echo "  docker run -it --rm -v \$(pwd)/workspace:/opt/workspace ${VERSION_TAG} cortexai"
echo ""

if [ "$PUSH" = true ]; then
    print_success "Image pushed to registry and ready for distribution!"
else
    print_info "Use --push flag to push to registry"
fi

echo ""
print_success "CortexOS build completed successfully!"
