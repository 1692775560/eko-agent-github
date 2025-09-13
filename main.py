import gradio as gr
import json
import subprocess
import os
from datetime import datetime
from pathlib import Path
import asyncio

class GitHubDiscoveryApp:
    def __init__(self):
        self.project_dir = Path(__file__).parent
        
    def discover_high_star_projects(self, min_stars, language):
        """Discover high-star projects"""
        try:
            # Build command to call discovery_runner
            cmd = ["npx", "ts-node", "--esm", "discovery_runner.ts", "discover", str(int(min_stars))]
            if language and language.strip():
                cmd.append(language.strip())
            
            print(f"Running command: {' '.join(cmd)}")
            
            # Run discovery script
            result = subprocess.run(
                cmd,
                cwd=self.project_dir,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            print(f"Return code: {result.returncode}")
            print(f"Stdout: {result.stdout}")
            print(f"Stderr: {result.stderr}")
            
            if result.returncode == 0:
                # Parse JSON output
                try:
                    output_lines = result.stdout.strip().split('\n')
                    # Find JSON output line
                    json_output = None
                    for line in output_lines:
                        if line.startswith('{'):
                            json_output = line
                            break
                    
                    if json_output:
                        data = json.loads(json_output)
                        if data.get('success'):
                            projects = data.get('projects', [])
                            return f"Successfully discovered {len(projects)} high-star projects", self.format_projects_display(projects)
                        else:
                            return f"Discovery failed: {data.get('error', 'Unknown error')}", ""
                    else:
                        return "No valid output found", ""
                except json.JSONDecodeError as e:
                    return f"Failed to parse results: {str(e)}", ""
            else:
                return f"Discovery failed: {result.stderr}", ""
                
        except subprocess.TimeoutExpired:
            return "Discovery timeout, please try again later", ""
        except Exception as e:
            return f"Error: {str(e)}", ""
    
    def search_by_topic(self, topic, min_stars):
        """Search projects by topic"""
        try:
            # Build command to call discovery_runner
            cmd = ["npx", "ts-node", "--esm", "discovery_runner.ts", "search", topic, str(int(min_stars))]
            
            print(f"Running command: {' '.join(cmd)}")
            
            # Run search script
            result = subprocess.run(
                cmd,
                cwd=self.project_dir,
                capture_output=True,
                text=True,
                timeout=300
            )
            
            print(f"Return code: {result.returncode}")
            print(f"Stdout: {result.stdout}")
            print(f"Stderr: {result.stderr}")
            
            if result.returncode == 0:
                # Parse JSON output
                try:
                    output_lines = result.stdout.strip().split('\n')
                    # Find JSON output line
                    json_output = None
                    for line in output_lines:
                        if line.startswith('{'):
                            json_output = line
                            break
                    
                    if json_output:
                        data = json.loads(json_output)
                        if data.get('success'):
                            projects = data.get('projects', [])
                            return f"Successfully found {len(projects)} projects related to '{topic}'", self.format_projects_display(projects)
                        else:
                            return f"Search failed: {data.get('error', 'Unknown error')}", ""
                    else:
                        return "No valid output found", ""
                except json.JSONDecodeError as e:
                    return f"Failed to parse results: {str(e)}", ""
            else:
                return f"Search failed: {result.stderr}", ""
                
        except subprocess.TimeoutExpired:
            return "Search timeout, please try again later", ""
        except Exception as e:
            return f"Error: {str(e)}", ""
    
    def load_project_data(self, filename):
        """Load project data"""
        try:
            file_path = self.project_dir / filename
            if file_path.exists():
                with open(file_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return []
        except Exception as e:
            print(f"Error loading {filename}: {e}")
            return []
    
    def format_projects_display(self, projects):
        """Format project display"""
        if not projects:
            return "No project data available"
        
        display_html = "<div style='max-width: 100%; overflow-x: auto;'>"
        
        for i, project in enumerate(projects, 1):
            display_html += f"""
            <div style='border: 1px solid #e1e4e8; border-radius: 8px; padding: 20px; margin: 15px 0; background: white;'>
                <h3 style='color: #0366d6; margin-bottom: 10px;'>
                    {i}. <a href='{project.get('url', '#')}' target='_blank' style='text-decoration: none; color: #0366d6;'>
                        {project.get('name', 'Unknown')}
                    </a>
                </h3>
                
                <div style='margin-bottom: 15px;'>
                    <span style='background: #f1f8ff; color: #0366d6; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 10px;'>
                        ⭐ {project.get('stars', 0):,} stars
                    </span>
                    <span style='background: #f6f8fa; color: #586069; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 10px;'>
                        {project.get('language', 'Unknown')}
                    </span>
                </div>
                
                <p style='color: #586069; margin-bottom: 15px; line-height: 1.5;'>
                    <strong>Description:</strong> {project.get('description', 'No description available')}
                </p>
                
                <div style='background: #f6f8fa; padding: 15px; border-radius: 6px; margin-bottom: 10px;'>
                    <p style='margin: 0; line-height: 1.6; color: #24292e;'>
                        <strong>AI Summary:</strong> {project.get('summary', 'No summary available')}
                    </p>
                </div>
                
                {f"<div style='margin-top: 10px;'><strong>Topics:</strong> {', '.join(project.get('topics', []))}</div>" if project.get('topics') else ""}
            </div>
            """
        
        display_html += "</div>"
        return display_html

def create_interface():
    """Create Gradio interface"""
    app = GitHubDiscoveryApp()
    
    with gr.Blocks(
        title="GitHub High-Star Project Discovery Tool",
        theme=gr.themes.Soft(),
        css="""
        .gradio-container {
            max-width: 1200px !important;
        }
        .tab-nav {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        """
    ) as interface:
        
        gr.Markdown("""
        # GitHub High-Star Project Discovery Tool
        
        Intelligently discover and summarize high-star GitHub projects using the Eko AI framework
        """)
        
        with gr.Tabs():
            # High-star project discovery
            with gr.Tab("High-Star Discovery"):
                gr.Markdown("### Discover high-star GitHub projects and generate AI summaries")
                
                with gr.Row():
                    with gr.Column(scale=1):
                        min_stars = gr.Number(
                            label="Minimum Stars",
                            value=1000,
                            minimum=100,
                            maximum=50000,
                            step=100
                        )
                        language = gr.Textbox(
                            label="Programming Language (Optional)",
                            placeholder="e.g., Python, JavaScript, Go",
                            value=""
                        )
                        discover_btn = gr.Button("Start Discovery", variant="primary", size="lg")
                    
                    with gr.Column(scale=1):
                        status_output = gr.Textbox(
                            label="Discovery Status",
                            lines=3,
                            interactive=False
                        )
                
                projects_display = gr.HTML(label="Project Details")
                
                discover_btn.click(
                    fn=app.discover_high_star_projects,
                    inputs=[min_stars, language],
                    outputs=[status_output, projects_display]
                )
            
            # Topic search
            with gr.Tab("Topic Search"):
                gr.Markdown("### Search for high-star projects by specific topics")
                
                with gr.Row():
                    with gr.Column(scale=1):
                        topic_input = gr.Textbox(
                            label="Search Topic",
                            placeholder="e.g., AI tools, Web frameworks, Machine Learning",
                            value="AI tools"
                        )
                        topic_min_stars = gr.Number(
                            label="Minimum Stars",
                            value=500,
                            minimum=50,
                            maximum=10000,
                            step=50
                        )
                        search_btn = gr.Button("Search Projects", variant="secondary", size="lg")
                    
                    with gr.Column(scale=1):
                        search_status = gr.Textbox(
                            label="Search Status",
                            lines=3,
                            interactive=False
                        )
                
                topic_projects_display = gr.HTML(label="Search Results")
                
                search_btn.click(
                    fn=app.search_by_topic,
                    inputs=[topic_input, topic_min_stars],
                    outputs=[search_status, topic_projects_display]
                )
        
        gr.Markdown("""
        ---
        ### Usage Instructions
        - **High-Star Discovery**: Find the most starred projects on GitHub, AI generates detailed summaries for each project
        - **Topic Search**: Search for high-quality projects based on specific topics (e.g., "AI tools")
        - **AI Summaries**: Each project includes AI-generated detailed summaries to help you quickly understand project value
        
        ### Share Link
        This interface supports public access and can be shared with others
        """)
    
    return interface

if __name__ == "__main__":
    # Create and launch application
    app = create_interface()
    app.launch(
        server_name="0.0.0.0",
        server_port=7861,
        share=True,  # Create public share link
        show_error=True,
        debug=False
    )
