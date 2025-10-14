# Azure OpenAI Setup

Complete guide to setting up Azure OpenAI for use with CortexAI.

## Overview

CortexAI requires Azure OpenAI Service to power its AI-driven security analysis. This guide walks you through the entire setup process.

## Why Azure OpenAI?

Azure OpenAI provides:
- **Enterprise-grade security**: Data privacy and compliance
- **Reliable service**: High availability and performance
- **Latest models**: Access to GPT-4 and GPT-4o
- **Content filtering**: Built-in safety controls
- **Regional deployment**: Choose data center location

## Prerequisites

- **Azure Account**: Active Microsoft Azure subscription
- **Payment Method**: Credit card or Azure credits
- **Azure OpenAI Access**: Approved access (application required)

## Step 1: Create Azure Account

### New Azure Users

1. **Sign Up**:
   - Go to [portal.azure.com](https://portal.azure.com)
   - Click "Start free" or "Create account"
   - Follow registration process

2. **Verify Account**:
   - Confirm email address
   - Add payment method
   - Complete identity verification

3. **Free Credits**:
   - New accounts receive $200 in free credits
   - Valid for 30 days
   - Enough for initial CortexAI testing

### Existing Azure Users

If you already have an Azure account, proceed to Step 2.

## Step 2: Apply for Azure OpenAI Access

Azure OpenAI requires approval before use.

### Application Process

1. **Navigate to Application Form**:
   - Go to [Azure OpenAI Access Request](https://aka.ms/oai/access)
   - Sign in with your Azure account

2. **Complete Application**:
   - **Organization Details**: Company/personal use information
   - **Use Case**: Describe penetration testing and security research
   - **Compliance**: Agree to responsible AI principles
   - **Technical Details**: Specify GPT-4 model requirement

3. **Submit and Wait**:
   - Typical approval time: 1-5 business days
   - Check email for approval notification
   - Some applications may require additional information

### Use Case Description Example

```
Use Case: Security Testing and Vulnerability Analysis
Description: Using AI to assist with ethical penetration testing,
vulnerability analysis, and security research. The system will
help security professionals identify and document security issues
in authorized environments with proper permissions.
```

## Step 3: Create OpenAI Resource

Once approved, create your Azure OpenAI resource.

### Resource Creation

1. **Access Azure Portal**:
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your account

2. **Create Resource**:
   - Click "Create a resource"
   - Search for "Azure OpenAI"
   - Click "Azure OpenAI"
   - Click "Create"

3. **Configure Resource**:

   **Basics Tab**:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or use existing
   - **Region**: Choose location (e.g., East US, West Europe)
   - **Name**: Unique name (e.g., `cortexai-openai-prod`)
   - **Pricing Tier**: Standard (pay-as-you-go)

   **Networking Tab**:
   - **Connectivity**: All networks (or configure restrictions)
   - **Private Endpoint**: Optional for enhanced security

   **Tags Tab** (optional):
   - Add tags for organization (e.g., `Environment: Production`)

4. **Review and Create**:
   - Review configuration
   - Click "Create"
   - Wait for deployment (usually 1-2 minutes)

### Recommended Regions

Choose regions based on:
- **Latency**: Closer region = faster response
- **Pricing**: Costs may vary by region
- **Compliance**: Data residency requirements

Popular regions:
- **East US**: Good performance, wide availability
- **West Europe**: European data residency
- **UK South**: UK/EU compliance
- **Australia East**: APAC region

## Step 4: Deploy GPT-4 Model

Deploy a GPT-4 model for CortexAI to use.

### Model Deployment

1. **Navigate to Resource**:
   - Go to your Azure OpenAI resource
   - Click "Go to Azure OpenAI Studio"
   - Or visit [oai.azure.com](https://oai.azure.com)

2. **Access Deployments**:
   - Click "Deployments" in left menu
   - Click "Create new deployment"

3. **Configure Deployment**:
   - **Model**: Select `gpt-4` or `gpt-4o` (recommended)
   - **Model Version**: Latest available
   - **Deployment Name**: `cortexai-gpt4` (or your preference)
   - **Capacity**: Start with 20-50K TPM (tokens per minute)
   - **Content Filter**: Use default (recommended)

4. **Create Deployment**:
   - Click "Create"
   - Wait for deployment to complete

### Model Selection

**GPT-4o** (Recommended):
- Faster response times
- Lower cost per token
- Better reasoning capabilities
- Multimodal support

**GPT-4**:
- Proven reliability
- Strong reasoning
- Wide availability

**Not Recommended**:
- GPT-3.5: Insufficient for complex security analysis

### Capacity Planning

Start with conservative capacity and scale up:

- **Light Use** (testing): 20K TPM
- **Moderate Use** (regular work): 50K TPM
- **Heavy Use** (extensive testing): 100K+ TPM

You can adjust capacity after deployment.

## Step 5: Get Connection Details

Collect the information needed for CortexAI configuration.

### Required Information

1. **Endpoint URL**:
   - In Azure Portal, go to your OpenAI resource
   - Click "Keys and Endpoint"
   - Copy the "Endpoint" value
   - Format: `https://your-resource.openai.azure.com/`

2. **API Key**:
   - In "Keys and Endpoint" section
   - Copy "Key 1" (or "Key 2")
   - Keep this secure - treat like a password

3. **Deployment Name**:
   - The name you chose during model deployment
   - Example: `cortexai-gpt4`

4. **API Version**:
   - Use the latest available version
   - Current: `2024-12-01-preview`
   - Check Azure documentation for updates

### Example Values

```
Endpoint: https://cortexai-eastus.openai.azure.com/
API Key: 1234567890abcdef1234567890abcdef
Deployment Name: cortexai-gpt4
API Version: 2024-12-01-preview
Model: gpt-4o
```

## Step 6: Configure CortexAI

Add your Azure OpenAI details to CortexAI.

### Environment Configuration

1. **Edit .env File**:
   ```bash
   cd cortexai
   nano .env
   ```

2. **Add Azure OpenAI Configuration**:
   ```bash
   AZURE_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_MODEL_NAME=gpt-4o
   AZURE_DEPLOYMENT=cortexai-gpt4
   AZURE_API_KEY=your-api-key-here
   AZURE_API_VERSION=2024-12-01-preview
   ```

3. **Save File**:
   - Save and close the editor

### Verify Configuration

Test your configuration:

```bash
npm start
```

Expected output:
```
✅ Environment validation passed
🚀 Starting CortexAI...
```

If you see errors, verify your values are correct.

## Cost Management

### Understanding Costs

Azure OpenAI pricing is based on:
- **Prompt Tokens**: Input you send
- **Completion Tokens**: AI responses
- **Model Used**: GPT-4o vs GPT-4

Approximate costs (subject to change):
- **GPT-4o**: ~$2.50-$10 per 1M tokens
- **GPT-4**: ~$10-$30 per 1M tokens

Typical CortexAI usage:
- Light use: $10-20/month
- Moderate use: $30-70/month
- Heavy use: $100+/month

### Cost Control

1. **Set Spending Limits**:
   - In Azure Portal
   - Set up budget alerts
   - Configure spending caps

2. **Monitor Usage**:
   - Check Azure Cost Management
   - Review token consumption
   - Adjust usage patterns

3. **Optimize Prompts**:
   - Use concise questions
   - Avoid redundant queries
   - Cache results when possible

### Budget Alerts

Set up alerts to monitor spending:

1. **Create Budget**:
   - Azure Portal > Cost Management + Billing
   - Create Budget
   - Set monthly threshold

2. **Configure Alerts**:
   - Alert at 80% of budget
   - Alert at 100% of budget
   - Email notifications

## Security Best Practices

### API Key Security

**Protect your API keys**:
- Never commit to version control
- Don't share in screenshots
- Rotate keys regularly
- Use Azure Key Vault for production

### Rotate Keys

Regularly rotate your API keys:

1. **Generate new key**:
   - Azure Portal > Keys and Endpoint
   - Regenerate Key 2

2. **Update CortexAI**:
   - Update `.env` with new key
   - Test functionality

3. **Delete old key**:
   - Regenerate Key 1
   - Now Key 2 is invalid

### Network Security

**Restrict access**:
- Configure IP restrictions in Azure
- Use Private Endpoints for sensitive environments
- Enable VNet integration

**Firewall Rules**:
- Limit to known IP addresses
- Use Azure Private Link
- Monitor access logs

### Monitoring

**Enable diagnostic logging**:
- Track API usage
- Monitor for unusual activity
- Set up alerts for anomalies

## Troubleshooting

### Application Pending

**Issue**: Azure OpenAI access not yet approved

**Solutions**:
- Wait for approval email
- Check application status in Azure Portal
- Contact Azure support if waiting > 7 days

### Deployment Fails

**Issue**: Cannot deploy GPT-4 model

**Solutions**:
- Verify quota availability in region
- Try different region
- Check subscription status
- Request quota increase

### Authentication Errors

**Issue**: CortexAI cannot connect

**Solutions**:
```bash
# Test API connectivity
curl -H "api-key: YOUR_KEY" \
     "https://YOUR_ENDPOINT/openai/deployments?api-version=2024-12-01-preview"
```

- Verify endpoint URL format
- Check API key is correct
- Ensure deployment name matches
- Confirm API version is supported

### Quota Exceeded

**Issue**: Rate limiting or quota errors

**Solutions**:
- Check current capacity in Azure
- Request capacity increase
- Adjust rate limiting in CortexAI
- Implement request throttling

### Regional Availability

**Issue**: Model not available in your region

**Solutions**:
- Check [Azure OpenAI model availability](https://learn.microsoft.com/azure/ai-services/openai/concepts/models)
- Deploy in different region
- Use alternative model temporarily

## Advanced Configuration

### Multiple Deployments

Use different deployments for different purposes:

```bash
# Production
AZURE_DEPLOYMENT_PROD=cortexai-gpt4-prod

# Development
AZURE_DEPLOYMENT_DEV=cortexai-gpt4-dev

# Testing
AZURE_DEPLOYMENT_TEST=cortexai-gpt35-test
```

### Content Filtering

Configure content filtering levels:
- **Strict**: Maximum safety (default)
- **Medium**: Balanced filtering
- **Low**: Minimal filtering (requires justification)

### Private Endpoints

For enhanced security in enterprise environments:
1. Create VNet in Azure
2. Configure Private Endpoint for OpenAI resource
3. Update CortexAI network configuration
4. Test connectivity through private network

## Next Steps

After Azure OpenAI setup:

1. **Test Configuration**: [Environment Setup](environment-setup.md)
2. **Advanced Settings**: [Advanced Configuration](advanced-configuration.md)
3. **Create First Project**: [First Project](../getting-started/first-project.md)

## Additional Resources

- **Azure OpenAI Documentation**: [Microsoft Learn](https://learn.microsoft.com/azure/ai-services/openai/)
- **Pricing Calculator**: [Azure Pricing](https://azure.microsoft.com/pricing/calculator/)
- **Model Availability**: [Azure OpenAI Models](https://learn.microsoft.com/azure/ai-services/openai/concepts/models)
- **Responsible AI**: [Azure AI Principles](https://www.microsoft.com/ai/responsible-ai)

## Getting Help

For Azure OpenAI issues:

- **Azure Support**: Submit ticket through Azure Portal
- **CortexAI Configuration**: [Troubleshooting](../troubleshooting/common-issues.md)
- **Community**: [GitHub Discussions](https://github.com/theelderemo/cortexai/discussions)

---

**Estimated Setup Time**: 15-30 minutes (excluding approval wait time)

**Cost**: ~$10-50/month for typical use
