#!/usr/bin/env node
import { ProjectEnhancerAgent } from './project-enhancer.js';

async function main() {
  const args = process.argv.slice(2);
  const action = args[0];
  
  const agent = new ProjectEnhancerAgent();
  
  try {
    if (action === 'enhance-all') {
      const inputFile = args[1] || 'high-star-projects.json';
      console.log(`Starting enhancement for all projects in ${inputFile}`);
      const results = await agent.enhanceProjects(inputFile);
      
      console.log(JSON.stringify({
        success: true,
        message: `Enhanced ${results.length} projects`,
        count: results.length,
        projects: results.map(p => ({ name: p.name, category: p.project_category }))
      }, null, 2));
      
    } else if (action === 'enhance-specific') {
      const projectNames = args.slice(1);
      if (projectNames.length === 0) {
        throw new Error('Please provide project names to enhance');
      }
      
      console.log(`Starting enhancement for specific projects: ${projectNames.join(', ')}`);
      const results = await agent.enhanceSpecificProjects(projectNames);
      
      console.log(JSON.stringify({
        success: true,
        message: `Enhanced ${results.length} specific projects`,
        count: results.length,
        projects: results.map(p => ({ name: p.name, category: p.project_category }))
      }, null, 2));
      
    } else {
      console.log('Usage:');
      console.log('  node enhancer_runner.js enhance-all [input-file]');
      console.log('  node enhancer_runner.js enhance-specific <project1> [project2] ...');
      console.log('');
      console.log('Examples:');
      console.log('  node enhancer_runner.js enhance-all');
      console.log('  node enhancer_runner.js enhance-specific freeCodeCamp 996.ICU');
    }
    
  } catch (error: any) {
    console.error(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred',
      details: error.toString()
    }, null, 2));
    process.exit(1);
  }
}

main().catch(console.error);
