import inquirer from 'inquirer';
import { ProjectManager } from './ProjectManager.js';
import { ScopeManager } from './ScopeManager.js';
import { IssueManager } from './IssueManager.js';

/**
 * Project Startup System
 * Handles project selection and initialization flow
 */
export class ProjectStartup {
  constructor() {
    this.projectManager = new ProjectManager();
    this.scopeManager = null;
    this.issueManager = null;
  }

  /**
   * Initialize the startup system
   */
  async initialize() {
    console.log('🚀 Initializing CortexAI Project Management...');
    
    const initialized = await this.projectManager.initialize();
    if (!initialized) {
      throw new Error('Failed to initialize Project Manager');
    }
    
    return true;
  }

  /**
   * Main startup flow - prompt user for project selection
   */
  async startupFlow() {
    try {
      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log('║                    CortexAI Project Manager                ║');
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      const projects = await this.projectManager.listProjects();
      
      const choices = [
        { name: '🆕 Create New Project', value: 'new' },
        { name: '📂 Open Existing Project', value: 'open', disabled: projects.length === 0 },
        { name: '⏭️  Skip Project Management', value: 'skip' },
        { name: '❌ Exit', value: 'exit' }
      ];

      if (projects.length === 0) {
        console.log('📝 No existing projects found. You can create a new project or manage templates.\n');
      } else {
        console.log(`📊 Found ${projects.length} existing project(s):\n`);
        projects.slice(0, 5).forEach((project, index) => {
          console.log(`   ${index + 1}. ${project.name}`);
          console.log(`      Target: ${project.target}`);
          console.log(`      Modified: ${project.modified.toLocaleString()}\n`);
        });
      }

      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: choices
        }
      ]);

      switch (action) {
        case 'new':
          return await this.createNewProject();
        case 'open':
          return await this.openExistingProject();
        case 'skip':
          console.log('⏭️  Project management skipped. You can create or load a project later using chat commands.');
          return null;
        case 'exit':
          console.log('👋 Goodbye!');
          process.exit(0);
      }
    } catch (error) {
      console.error('❌ Error in startup flow:', error.message);
      return null;
    }
  }

  /**
   * Create new project flow
   */
  async createNewProject() {
    try {
      console.log('\n📝 Creating New Project...\n');

      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Project name:',
          validate: (input) => {
            if (!input.trim()) return 'Project name is required';
            if (!/^[a-zA-Z0-9_-]+$/.test(input)) return 'Project name can only contain letters, numbers, hyphens, and underscores';
            return true;
          }
        },
        {
          type: 'input',
          name: 'description',
          message: 'Description (optional):'
        },
        {
          type: 'input',
          name: 'target',
          message: 'Primary target (URL/IP):',
          validate: (input) => {
            if (!input.trim()) return 'Target is required';
            return true;
          }
        },
        {
          type: 'confirm',
          name: 'useTemplate',
          message: 'Use configuration template?',
          default: true
        }
      ]);

      let config = {
        description: answers.description,
        target: answers.target
      };

      if (answers.useTemplate) {
        const template = await this.selectTemplate();
        if (template) {
          config = { ...template, ...config };
        }
      }

      const result = await this.projectManager.createProject(answers.projectName, config);
      
      if (result.success) {
        console.log('\n✅ Project created successfully!');
        
        // Load the new project
        await this.projectManager.loadProject(answers.projectName);
        this.initializeManagers();
        
        // Set up initial scope
        await this.setupInitialScope(answers.target);
        
        // Launch database viewer
        const { launchViewer } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'launchViewer',
            message: 'Launch database viewer?',
            default: true
          }
        ]);
        
        if (launchViewer) {
          await this.projectManager.launchDatabaseViewer();
        }
        
        return this.projectManager.getCurrentProject();
      } else {
        console.error('❌ Failed to create project:', result.error);
        return null;
      }
    } catch (error) {
      console.error('❌ Error creating project:', error.message);
      return null;
    }
  }

  /**
   * Open existing project flow
   */
  async openExistingProject() {
    try {
      const projects = await this.projectManager.listProjects();
      
      if (projects.length === 0) {
        console.log('📝 No projects found. Create a new project first.');
        return null;
      }

      const choices = projects.map(project => ({
        name: `${project.name} - ${project.description || 'No description'} (${project.target})`,
        value: project.name,
        short: project.name
      }));

      const { selectedProject } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedProject',
          message: 'Select project to open:',
          choices: choices,
          pageSize: 10
        }
      ]);

      const result = await this.projectManager.loadProject(selectedProject);
      
      if (result.success) {
        this.initializeManagers();
        
        // Show project summary
        await this.showProjectSummary();
        
        // Launch database viewer option
        const { launchViewer } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'launchViewer',
            message: 'Launch database viewer?',
            default: false
          }
        ]);
        
        if (launchViewer) {
          await this.projectManager.launchDatabaseViewer();
        }
        
        return result.project;
      } else {
        console.error('❌ Failed to load project:', result.error);
        return null;
      }
    } catch (error) {
      console.error('❌ Error opening project:', error.message);
      return null;
    }
  }

  /**
   * Initialize scope and issue managers
   */
  initializeManagers() {
    this.scopeManager = new ScopeManager(this.projectManager);
    this.issueManager = new IssueManager(this.projectManager);
  }

  /**
   * Set up initial scope for new project
   */
  async setupInitialScope(target) {
    try {
      // Determine scope pattern type
      let patternType = 'url';
      let pattern = target;
      
      // Check if it's a CIDR
      if (target.includes('/')) {
        patternType = 'cidr';
      } else if (target.startsWith('http')) {
        // Add wildcard for subpaths
        pattern = target.endsWith('/') ? target + '*' : target + '/*';
      } else {
        // Assume it's a hostname/IP, make it a URL pattern
        pattern = `https://${target}/*`;
      }
      
      await this.scopeManager.addScopeRule('include', patternType, pattern, 'Primary target scope');
      
      console.log(`✅ Initial scope configured: ${pattern}`);
    } catch (error) {
      console.error('⚠️  Warning: Could not set up initial scope:', error.message);
    }
  }

  /**
   * Show project summary after loading
   */
  async showProjectSummary() {
    try {
      const project = this.projectManager.getCurrentProject();
      const siteMap = await this.scopeManager.getSiteMap();
      const vulnSummary = await this.issueManager.getVulnerabilitySummary();
      
      console.log('\n📊 Project Summary:');
      console.log(`   Name: ${project.name}`);
      console.log(`   Target: ${project.config.target}`);
      console.log(`   Created: ${new Date(project.config.created).toLocaleString()}`);
      console.log(`\n🗺️  Site Map:`);
      console.log(`   Total Sites: ${siteMap.totalSites}`);
      console.log(`   In Scope: ${siteMap.inScope}`);
      console.log(`   Out of Scope: ${siteMap.outOfScope}`);
      console.log(`   Domains: ${siteMap.domains.size}`);
      
      console.log(`\n🚨 Vulnerabilities:`);
      console.log(`   Total: ${vulnSummary.total}`);
      console.log(`   Critical (Open): ${vulnSummary.critical_open}`);
      console.log(`   High (Open): ${vulnSummary.high_open}`);
      
      if (vulnSummary.total > 0) {
        console.log(`   By Severity:`);
        for (const [severity, count] of Object.entries(vulnSummary.by_severity)) {
          console.log(`     ${severity}: ${count}`);
        }
      }
      console.log('');
    } catch (error) {
      console.error('⚠️  Warning: Could not generate project summary:', error.message);
    }
  }

  /**
   * Select configuration template
   */
  async selectTemplate() {
    try {
      const templates = await this.getAvailableTemplates();
      
      if (templates.length === 0) {
        console.log('📝 No templates available');
        return null;
      }

      const choices = templates.map(template => ({
        name: `${template.name} - ${template.description}`,
        value: template,
        short: template.name
      }));

      choices.push({ name: 'Skip template', value: null });

      const { selectedTemplate } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedTemplate',
          message: 'Select configuration template:',
          choices: choices
        }
      ]);

      return selectedTemplate;
    } catch (error) {
      console.error('⚠️  Warning: Could not load templates:', error.message);
      return null;
    }
  }

  /**
   * Get available templates
   */
  async getAvailableTemplates() {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const templatesDir = this.projectManager.templatesDir;
      const files = await fs.readdir(templatesDir);
      const templates = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const templatePath = path.join(templatesDir, file);
            const templateData = await fs.readFile(templatePath, 'utf-8');
            const template = JSON.parse(templateData);
            templates.push(template);
          } catch (e) {
            console.error(`⚠️  Warning: Could not load template ${file}:`, e.message);
          }
        }
      }
      
      return templates;
    } catch (error) {
      console.error('⚠️  Warning: Could not read templates directory:', error.message);
      return [];
    }
  }

  /**
   * Get the initialized managers
   */
  getManagers() {
    return {
      projectManager: this.projectManager,
      scopeManager: this.scopeManager,
      issueManager: this.issueManager
    };
  }
}