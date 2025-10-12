import sqlite3 from 'sqlite3';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

/**
 * Project Management Engine for CortexAI
 * Handles project creation, configuration, and database management
 */
export class ProjectManager {
  constructor() {
    this.currentProject = null;
    this.currentDb = null;
    this.projectsDir = path.join(os.homedir(), '.cortexai', 'projects');
    this.templatesDir = path.join(os.homedir(), '.cortexai', 'templates');
  }

  /**
   * Initialize the project manager
   */
  async initialize() {
    try {
      // Ensure directories exist
      await fs.mkdir(this.projectsDir, { recursive: true });
      await fs.mkdir(this.templatesDir, { recursive: true });
      
      // Create default configuration template if it doesn't exist
      await this.createDefaultTemplate();
      
      console.log('📁 Project Manager initialized');
      console.log(`   Projects directory: ${this.projectsDir}`);
      console.log(`   Templates directory: ${this.templatesDir}`);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Project Manager:', error.message);
      return false;
    }
  }

  /**
   * List all available projects
   */
  async listProjects() {
    try {
      const entries = await fs.readdir(this.projectsDir, { withFileTypes: true });
      const projects = [];
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const projectPath = path.join(this.projectsDir, entry.name);
          const dbPath = path.join(projectPath, 'project.db');
          
          try {
            await fs.access(dbPath);
            const stats = await fs.stat(dbPath);
            const configPath = path.join(projectPath, 'config.json');
            let config = {};
            
            try {
              const configData = await fs.readFile(configPath, 'utf-8');
              config = JSON.parse(configData);
            } catch (e) {
              // No config file or invalid JSON
            }
            
            projects.push({
              name: entry.name,
              path: projectPath,
              created: stats.birthtime,
              modified: stats.mtime,
              description: config.description || 'No description',
              target: config.target || 'No target specified'
            });
          } catch (e) {
            // Skip invalid projects
          }
        }
      }
      
      return projects.sort((a, b) => b.modified - a.modified);
    } catch (error) {
      console.error('❌ Failed to list projects:', error.message);
      return [];
    }
  }

  /**
   * Create a new project
   */
  async createProject(projectName, config = {}) {
    try {
      const projectPath = path.join(this.projectsDir, projectName);
      
      // Check if project already exists
      try {
        await fs.access(projectPath);
        throw new Error(`Project "${projectName}" already exists`);
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
      }
      
      // Create project directory
      await fs.mkdir(projectPath, { recursive: true });
      
      // Create project configuration
      const projectConfig = {
        name: projectName,
        id: uuidv4(),
        created: new Date().toISOString(),
        description: config.description || '',
        target: config.target || '',
        scope: config.scope || {
          include: [],
          exclude: [],
          cidrs: [],
          regex_patterns: []
        },
        authentication: config.authentication || {},
        settings: config.settings || {
          passive_scanning: true,
          active_scanning: false,
          max_threads: 10,
          request_delay: 1000
        },
        version: '1.0.0'
      };
      
      // Save configuration
      const configPath = path.join(projectPath, 'config.json');
      await fs.writeFile(configPath, JSON.stringify(projectConfig, null, 2));
      
      // Create database
      const dbPath = path.join(projectPath, 'project.db');
      await this.initializeDatabase(dbPath);
      
      console.log(`✅ Created project: ${projectName}`);
      console.log(`   Path: ${projectPath}`);
      
      return { success: true, projectPath, config: projectConfig };
    } catch (error) {
      console.error(`❌ Failed to create project "${projectName}":`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load an existing project
   */
  async loadProject(projectName) {
    try {
      const projectPath = path.join(this.projectsDir, projectName);
      const configPath = path.join(projectPath, 'config.json');
      const dbPath = path.join(projectPath, 'project.db');
      
      // Check if project exists
      await fs.access(projectPath);
      await fs.access(configPath);
      await fs.access(dbPath);
      
      // Load configuration
      const configData = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configData);
      
      // Close current database if any
      if (this.currentDb) {
        this.currentDb.close();
      }
      
      // Open project database
      this.currentDb = new sqlite3.Database(dbPath);
      this.currentProject = {
        name: projectName,
        path: projectPath,
        config: config,
        dbPath: dbPath
      };
      
      console.log(`📂 Loaded project: ${projectName}`);
      console.log(`   Target: ${config.target || 'Not specified'}`);
      console.log(`   Created: ${new Date(config.created).toLocaleString()}`);
      
      return { success: true, project: this.currentProject };
    } catch (error) {
      console.error(`❌ Failed to load project "${projectName}":`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Save current project configuration
   */
  async saveProject() {
    if (!this.currentProject) {
      throw new Error('No project currently loaded');
    }
    
    try {
      const configPath = path.join(this.currentProject.path, 'config.json');
      await fs.writeFile(configPath, JSON.stringify(this.currentProject.config, null, 2));
      console.log(`💾 Saved project: ${this.currentProject.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to save project:', error.message);
      return false;
    }
  }

  /**
   * Close current project
   */
  async closeProject() {
    if (this.currentProject) {
      await this.saveProject();
      
      if (this.currentDb) {
        this.currentDb.close();
        this.currentDb = null;
      }
      
      console.log(`📁 Closed project: ${this.currentProject.name}`);
      this.currentProject = null;
    }
  }

  /**
   * Initialize project database schema
   */
  async initializeDatabase(dbPath) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Create tables
        db.serialize(() => {
          // Sites and Assets table
          db.run(`
            CREATE TABLE IF NOT EXISTS sites (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              url TEXT UNIQUE NOT NULL,
              title TEXT,
              status_code INTEGER,
              content_type TEXT,
              content_length INTEGER,
              response_headers TEXT,
              discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              last_checked DATETIME DEFAULT CURRENT_TIMESTAMP,
              in_scope BOOLEAN DEFAULT 1,
              asset_type TEXT DEFAULT 'page',
              parent_id INTEGER,
              FOREIGN KEY (parent_id) REFERENCES sites (id)
            )
          `);
          
          // Vulnerabilities table
          db.run(`
            CREATE TABLE IF NOT EXISTS vulnerabilities (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              description TEXT,
              severity TEXT CHECK(severity IN ('Critical', 'High', 'Medium', 'Low', 'Info')) NOT NULL,
              cwe_id TEXT,
              owasp_category TEXT,
              url TEXT,
              parameter TEXT,
              payload TEXT,
              evidence TEXT,
              remediation TEXT,
              status TEXT CHECK(status IN ('New', 'Confirmed', 'False Positive', 'Remediated', 'Risk Accepted')) DEFAULT 'New',
              discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              site_id INTEGER,
              FOREIGN KEY (site_id) REFERENCES sites (id)
            )
          `);
          
          // HTTP Requests/Responses (Evidence Locker)
          db.run(`
            CREATE TABLE IF NOT EXISTS http_evidence (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              vulnerability_id INTEGER,
              method TEXT NOT NULL,
              url TEXT NOT NULL,
              request_headers TEXT,
              request_body TEXT,
              response_headers TEXT,
              response_body TEXT,
              response_code INTEGER,
              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities (id)
            )
          `);
          
          // Scope definitions
          db.run(`
            CREATE TABLE IF NOT EXISTS scope_rules (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              rule_type TEXT CHECK(rule_type IN ('include', 'exclude')) NOT NULL,
              pattern_type TEXT CHECK(pattern_type IN ('url', 'regex', 'cidr')) NOT NULL,
              pattern TEXT NOT NULL,
              description TEXT,
              active BOOLEAN DEFAULT 1,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
          
          // Scan history and metadata
          db.run(`
            CREATE TABLE IF NOT EXISTS scans (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              scan_type TEXT NOT NULL,
              target TEXT NOT NULL,
              status TEXT CHECK(status IN ('Running', 'Completed', 'Failed', 'Cancelled')) DEFAULT 'Running',
              started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              completed_at DATETIME,
              results_summary TEXT,
              error_message TEXT
            )
          `);
          
          // Configuration history
          db.run(`
            CREATE TABLE IF NOT EXISTS config_history (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              config_snapshot TEXT NOT NULL,
              description TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
          
          // Create indexes for performance
          db.run('CREATE INDEX IF NOT EXISTS idx_sites_url ON sites(url)');
          db.run('CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON vulnerabilities(severity)');
          db.run('CREATE INDEX IF NOT EXISTS idx_vulnerabilities_status ON vulnerabilities(status)');
          db.run('CREATE INDEX IF NOT EXISTS idx_http_evidence_vuln_id ON http_evidence(vulnerability_id)');
          db.run('CREATE INDEX IF NOT EXISTS idx_scope_rules_active ON scope_rules(active)');
        });
        
        db.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  /**
   * Create default configuration template
   */
  async createDefaultTemplate() {
    const defaultTemplate = {
      name: 'Default Web Application Test',
      description: 'Standard web application penetration test configuration',
      scope: {
        include: ['https://target.example.com/*'],
        exclude: ['*/logout', '*/admin/delete/*'],
        cidrs: [],
        regex_patterns: []
      },
      authentication: {
        type: 'cookie',
        credentials: {
          username: '',
          password: ''
        },
        login_url: '',
        session_validation: {
          success_indicator: '',
          failure_indicator: ''
        }
      },
      settings: {
        passive_scanning: true,
        active_scanning: false,
        max_threads: 10,
        request_delay: 1000,
        follow_redirects: true,
        max_depth: 5,
        excluded_extensions: ['.jpg', '.jpeg', '.png', '.gif', '.css', '.js', '.ico'],
        user_agent: 'CortexAI/1.0 Security Scanner'
      },
      scan_policies: {
        quick_scan: {
          name: 'Quick Scan',
          enabled_checks: ['xss', 'sqli', 'info_disclosure'],
          max_payloads_per_param: 5
        },
        full_scan: {
          name: 'Full Scan',
          enabled_checks: ['xss', 'sqli', 'info_disclosure', 'csrf', 'xxe', 'ssrf', 'lfi'],
          max_payloads_per_param: 20
        }
      }
    };
    
    const templatePath = path.join(this.templatesDir, 'default.json');
    
    try {
      await fs.access(templatePath);
    } catch (e) {
      if (e.code === 'ENOENT') {
        await fs.writeFile(templatePath, JSON.stringify(defaultTemplate, null, 2));
        console.log('📋 Created default configuration template');
      }
    }
  }

  /**
   * Launch database viewer
   */
  async launchDatabaseViewer() {
    if (!this.currentProject) {
      console.log('⚠️  No project currently loaded');
      return false;
    }
    
    try {
      const dbPath = this.currentProject.dbPath;
      
      // Try different SQLite browsers
      const browsers = [
        'sqlitebrowser',
        'sqliteadmin',
        'sqliteman',
        'sqlite3'
      ];
      
      for (const browser of browsers) {
        try {
          const { exec } = await import('child_process');
          const { promisify } = await import('util');
          const execAsync = promisify(exec);
          
          // Check if browser is available
          await execAsync(`which ${browser}`);
          
          // Launch browser
          const process = exec(`${browser} "${dbPath}"`, {
            detached: true,
            stdio: 'ignore'
          });
          
          process.unref();
          console.log(`🗃️  Opened database viewer: ${browser}`);
          console.log(`   Database: ${dbPath}`);
          return true;
        } catch (e) {
          // Browser not available, try next one
          continue;
        }
      }
      
      console.log('⚠️  No suitable SQLite browser found. Install sqlitebrowser:');
      console.log('   sudo apt-get install sqlitebrowser');
      return false;
    } catch (error) {
      console.error('❌ Failed to launch database viewer:', error.message);
      return false;
    }
  }

  /**
   * Get current project info
   */
  getCurrentProject() {
    return this.currentProject;
  }

  /**
   * Get database connection
   */
  getDatabase() {
    return this.currentDb;
  }
}