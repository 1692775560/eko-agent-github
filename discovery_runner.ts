#!/usr/bin/env node
import { GitHubAPIDiscoveryAgent } from './github-api-discovery.js';

async function main() {
  const args = process.argv.slice(2);
  const action = args[0];
  
  const agent = new GitHubAPIDiscoveryAgent();
  
  try {
    if (action === 'discover') {
      const minStars = parseInt(args[1]) || 1000;
      const language = args[2] || '';
      
      console.log(`Starting discovery: ${minStars}+ stars, language: ${language || 'any'}`);
      const results = await agent.findHighStarProjects(minStars, language);
      
      console.log(JSON.stringify({
        success: true,
        count: results.length,
        projects: results
      }));
      
    } else if (action === 'search') {
      const topic = args[1] || 'AI tools';
      const minStars = parseInt(args[2]) || 500;
      
      console.log(`Starting topic search: ${topic}, ${minStars}+ stars`);
      const results = await agent.searchProjectsByTopic(topic, minStars);
      
      console.log(JSON.stringify({
        success: true,
        count: results.length,
        projects: results
      }));
      
    } else {
      console.error('Usage: node discovery_runner.js [discover|search] [params...]');
      process.exit(1);
    }
    
  } catch (error: any) {
    console.error(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error'
    }));
    process.exit(1);
  }
}

main();
