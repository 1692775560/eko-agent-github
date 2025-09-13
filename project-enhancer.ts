import { Eko, Agent, type LLMs } from "@eko-ai/eko";
import { FileAgent } from "@eko-ai/eko-nodejs";
import * as dotenv from "dotenv";
import * as fs from 'fs/promises';

// Load environment variables
dotenv.config();

const llms: LLMs = {
  default: {
    provider: "openai",
    model: "model",
    apiKey: process.env.GOOGLE_API_KEY || process.env.OPENAI_API_KEY || "",
    config: {
      baseURL: "base_url",
    },
  }
};

export interface ProjectSummary {
  name: string;
  stars: number | string;
  language: string;
  description: string;
  summary: string;
  url: string;
  topics: string[];
}

export interface EnhancedProject extends ProjectSummary {
  enhanced_analysis: string;
  technical_details: string;
  use_cases: string[];
  target_audience: string;
  popularity_reasons: string;
  project_category: string;
}

export class ProjectEnhancerAgent {
  private eko: Eko;

  constructor() {
    let agents: Agent[] = [new FileAgent()];
    this.eko = new Eko({ llms, agents });
  }

  async enhanceProjects(inputFile: string = 'high-star-projects.json'): Promise<EnhancedProject[]> {
    console.log(`Enhancing projects from ${inputFile}...`);
    
    // Load existing project data
    const projects = await this.loadProjectData(inputFile);
    console.log(`Found ${projects.length} projects to enhance`);

    const task = `
I have a list of GitHub projects with basic information. I need you to create enhanced analyses for each project based on the existing data.

Here are the projects:
${JSON.stringify(projects, null, 2)}

For each project, please:

1. Analyze the existing summary and description to create a more detailed technical analysis
2. Identify specific use cases based on the project's purpose and features
3. Determine the target audience (developers, companies, students, etc.)
4. Explain why the project is popular (based on star count and description)
5. Categorize the project (e.g., "Learning Platform", "Development Tool", "Framework", etc.)
6. Provide technical details about the project's architecture or approach

Create an enhanced JSON file called "enhanced-projects.json" with this structure:
[
  {
    "name": "project-name",
    "stars": "star-count",
    "language": "main-language",
    "description": "original-description",
    "summary": "original-summary",
    "url": "github-url",
    "topics": ["topic1", "topic2"],
    "enhanced_analysis": "Detailed technical and strategic analysis of the project",
    "technical_details": "Technical architecture, frameworks, and implementation details",
    "use_cases": ["use case 1", "use case 2", "use case 3"],
    "target_audience": "Primary users and beneficiaries",
    "popularity_reasons": "Why this project has so many stars and is widely adopted",
    "project_category": "Category classification"
  }
]

Focus on providing valuable insights that help users understand each project's significance and practical applications.
`;

    try {
      await this.eko.run(task);
      
      // Load the enhanced results
      const results = await this.loadEnhancedResults();
      console.log(`Enhanced ${results.length} projects with detailed analysis`);
      return results;
      
    } catch (error) {
      console.error('Error enhancing projects:', error);
      throw error;
    }
  }

  private async loadProjectData(filename: string): Promise<ProjectSummary[]> {
    try {
      const data = await fs.readFile(filename, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return [];
    }
  }

  private async loadEnhancedResults(): Promise<EnhancedProject[]> {
    try {
      const data = await fs.readFile('enhanced-projects.json', 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading enhanced results:', error);
      return [];
    }
  }

  async enhanceSpecificProjects(projectNames: string[], sourceFile: string = 'high-star-projects.json'): Promise<EnhancedProject[]> {
    console.log(`Enhancing specific projects: ${projectNames.join(', ')}`);
    
    const allProjects = await this.loadProjectData(sourceFile);
    const targetProjects = allProjects.filter(p => 
      projectNames.some(name => 
        p.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(p.name.toLowerCase())
      )
    );

    if (targetProjects.length === 0) {
      console.log('No matching projects found');
      return [];
    }

    console.log(`Found ${targetProjects.length} matching projects`);

    const task = `
I need you to create detailed enhanced analyses for these specific GitHub projects:

${JSON.stringify(targetProjects, null, 2)}

For each project, provide:

1. **Enhanced Analysis**: Deep dive into what makes this project special and valuable
2. **Technical Details**: Architecture, technologies used, implementation approach
3. **Use Cases**: Specific scenarios where this project would be used
4. **Target Audience**: Who benefits from this project
5. **Popularity Reasons**: Why it has achieved such high star counts
6. **Project Category**: Classification of the project type

Create a file called "enhanced-specific-projects.json" with detailed information for each project.

Focus on providing actionable insights that help developers understand when and how to use these projects.
`;

    try {
      await this.eko.run(task);
      
      const data = await fs.readFile('enhanced-specific-projects.json', 'utf-8');
      const results = JSON.parse(data);
      console.log(`Enhanced ${results.length} specific projects`);
      return results;
      
    } catch (error) {
      console.error('Error enhancing specific projects:', error);
      throw error;
    }
  }
}

export default ProjectEnhancerAgent;
