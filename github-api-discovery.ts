import { Eko, Agent, type LLMs } from "@eko-ai/eko";
import { FileAgent } from "@eko-ai/eko-nodejs";
import * as dotenv from "dotenv";

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
  stars: number;
  language: string;
  description: string;
  summary: string;
  url: string;
  topics: string[];
}

export class GitHubAPIDiscoveryAgent {
  private eko: Eko;

  constructor() {
    let agents: Agent[] = [new FileAgent()];
    this.eko = new Eko({ llms, agents });
  }

  async findHighStarProjects(minStars: number = 1000, language?: string): Promise<ProjectSummary[]> {
    console.log(`Finding GitHub projects with ${minStars}+ stars${language ? ` in ${language}` : ''}...`);
    
    const task = `
I need you to find and analyze high-star GitHub projects using the GitHub API. Please:

1. Use the GitHub Search API to find repositories:
   - API endpoint: https://api.github.com/search/repositories
   - Query parameters: 
     * q: "stars:>=${minStars}${language ? ` language:${language}` : ''}"
     * sort: "stars"
     * order: "desc"
     * per_page: 10

2. For each of the top 10 repositories, extract:
   - name (repository name)
   - stargazers_count (star count)
   - language (primary language)
   - description
   - html_url (GitHub URL)
   - topics (array of topics/tags)

3. Generate a comprehensive AI summary for each project explaining:
   - What the project does and its main purpose
   - Key features and capabilities based on the description
   - Why it might be popular (infer from stars and description)
   - Potential use cases and target audience
   - What makes it notable in its category

4. Create a JSON file called "high-star-projects.json" with this structure:
[
  {
    "name": "repository-name",
    "stars": 12345,
    "language": "JavaScript",
    "description": "Original GitHub description",
    "summary": "Detailed AI-generated summary explaining the project's value and purpose",
    "url": "https://github.com/user/repo",
    "topics": ["topic1", "topic2"]
  }
]

Make the API request to get real data from GitHub. Focus on creating informative summaries that help users understand each project's value.
`;

    try {
      await this.eko.run(task);
      
      // Read the generated JSON file
      const results = await this.loadProjectResults();
      console.log(`Found and analyzed ${results.length} high-star projects`);
      return results;
      
    } catch (error) {
      console.error('Error finding projects:', error);
      throw error;
    }
  }

  private async loadProjectResults(): Promise<ProjectSummary[]> {
    try {
      const fs = await import('fs/promises');
      const data = await fs.readFile('high-star-projects.json', 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading project results:', error);
      return [];
    }
  }

  async searchProjectsByTopic(topic: string, minStars: number = 500): Promise<ProjectSummary[]> {
    console.log(`Searching for ${topic} projects with ${minStars}+ stars...`);
    
    const task = `
I need you to search GitHub for projects related to "${topic}" using the GitHub API. Please:

1. Use the GitHub Search API:
   - API endpoint: https://api.github.com/search/repositories
   - Query parameters:
     * q: "${topic} stars:>=${minStars}"
     * sort: "stars"
     * order: "desc"
     * per_page: 10

2. For each repository, extract the same data as before
3. Generate AI summaries focusing on how each project relates to "${topic}"
4. Save results as "topic-${topic.replace(/\s+/g, '-').toLowerCase()}-projects.json"

Focus on projects most relevant to "${topic}" and explain their connection to this topic.
`;

    try {
      await this.eko.run(task);
      
      // Read the generated JSON file
      const filename = `topic-${topic.replace(/\s+/g, '-').toLowerCase()}-projects.json`;
      const fs = await import('fs/promises');
      const data = await fs.readFile(filename, 'utf-8');
      const results = JSON.parse(data);
      
      console.log(`Found and analyzed ${results.length} projects for topic: ${topic}`);
      return results;
      
    } catch (error) {
      console.error('Error searching projects by topic:', error);
      throw error;
    }
  }
}

export default GitHubAPIDiscoveryAgent;
