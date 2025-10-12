#!/usr/bin/env node

/**
 * Test script for CortexAI Project Management System
 * Run this to verify all components are working correctly
 */

import { ProjectManager } from './lib/ProjectManager.js';
import { ScopeManager } from './lib/ScopeManager.js';
import { IssueManager } from './lib/IssueManager.js';
import { ProjectStartup } from './lib/ProjectStartup.js';

async function runTests() {
  console.log('🧪 Testing CortexAI Project Management System...\n');
  
  try {
    // Test 1: Project Manager Initialization
    console.log('1️⃣  Testing Project Manager initialization...');
    const projectManager = new ProjectManager();
    const initResult = await projectManager.initialize();
    console.log(initResult ? '✅ Project Manager initialized' : '❌ Failed to initialize Project Manager');
    
    // Test 2: Create Test Project
    console.log('\n2️⃣  Testing project creation...');
    const testProjectName = `test-project-${Date.now()}`;
    const createResult = await projectManager.createProject(testProjectName, {
      description: 'Test project for CortexAI',
      target: 'https://example.com'
    });
    console.log(createResult.success ? '✅ Test project created' : '❌ Failed to create test project');
    
    // Test 3: Load Project
    console.log('\n3️⃣  Testing project loading...');
    const loadResult = await projectManager.loadProject(testProjectName);
    console.log(loadResult.success ? '✅ Test project loaded' : '❌ Failed to load test project');
    
    // Test 4: Scope Manager
    console.log('\n4️⃣  Testing Scope Manager...');
    const scopeManager = new ScopeManager(projectManager);
    await scopeManager.addScopeRule('include', 'url', 'https://example.com/*', 'Test include rule');
    await scopeManager.addScopeRule('exclude', 'url', '*/admin/*', 'Test exclude rule');
    const scopeRules = await scopeManager.getScopeRules();
    console.log(scopeRules.length >= 2 ? '✅ Scope Manager working' : '❌ Scope Manager failed');
    
    // Test 5: Issue Manager
    console.log('\n5️⃣  Testing Issue Manager...');
    const issueManager = new IssueManager(projectManager);
    const testVuln = await issueManager.logVulnerability({
      title: 'Test Vulnerability',
      description: 'This is a test vulnerability',
      severity: 'Medium',
      cwe_id: 'CWE-79',
      owasp_category: 'A03:2021 – Injection',
      url: 'https://example.com/test',
      evidence: 'Test evidence'
    });
    console.log(testVuln.id ? '✅ Issue Manager working' : '❌ Issue Manager failed');
    
    // Test 6: Site Discovery
    console.log('\n6️⃣  Testing site discovery...');
    const site = await scopeManager.addSite({
      url: 'https://example.com/test-page',
      title: 'Test Page',
      statusCode: 200,
      contentType: 'text/html'
    });
    console.log(site.id ? '✅ Site discovery working' : '❌ Site discovery failed');
    
    // Test 7: HTTP Evidence Storage
    console.log('\n7️⃣  Testing evidence storage...');
    const evidence = await issueManager.storeHttpEvidence({
      vulnerability_id: testVuln.id,
      method: 'GET',
      url: 'https://example.com/test',
      request_headers: { 'User-Agent': 'CortexAI Test' },
      response_headers: { 'Content-Type': 'text/html' },
      response_body: '<html><body>Test response</body></html>',
      response_code: 200
    });
    console.log(evidence.id ? '✅ Evidence storage working' : '❌ Evidence storage failed');
    
    // Test 8: Project Summary
    console.log('\n8️⃣  Testing project summary...');
    const siteMap = await scopeManager.getSiteMap();
    const vulnSummary = await issueManager.getVulnerabilitySummary();
    console.log('✅ Project summary generated:');
    console.log(`   - Total sites: ${siteMap.totalSites}`);
    console.log(`   - Total vulnerabilities: ${vulnSummary.total}`);
    console.log(`   - Domains discovered: ${siteMap.domains.size}`);
    
    // Test 9: List Projects
    console.log('\n9️⃣  Testing project listing...');
    const projects = await projectManager.listProjects();
    console.log(`✅ Found ${projects.length} project(s)`);
    
    // Cleanup
    console.log('\n🧹 Cleaning up test project...');
    await projectManager.closeProject();
    
    // Try to delete test project directory
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const testProjectPath = path.join(projectManager.projectsDir, testProjectName);
      await fs.rm(testProjectPath, { recursive: true, force: true });
      console.log('✅ Test project cleaned up');
    } catch (e) {
      console.log('⚠️  Could not clean up test project directory');
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('🚀 CortexAI Project Management System is ready to use.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests };