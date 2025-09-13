# GitHub Project Discovery Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

Ever wondered what makes certain GitHub projects so popular? This tool helps you discover trending repositories and understand why they've captured the developer community's attention. Built with the powerful Eko AI framework, it goes beyond simple star counts to provide meaningful insights about each project's purpose, technical approach, and real-world applications.

Whether you're a developer looking for inspiration, a researcher studying open source trends, or just curious about what's hot in the coding world, this tool makes it easy to explore and understand the most interesting projects on GitHub.

## What Makes This Special

Instead of just showing you a list of popular repositories, this tool actually understands what each project does and why it matters. Using advanced AI analysis, it reads through project descriptions, examines the codebase structure, and generates human-readable explanations that help you quickly grasp the essence of any project.

The discovery process is smart and flexible. You can search for projects with specific star counts, filter by programming languages, or even explore projects around particular topics like "machine learning" or "web frameworks". The AI doesn't just find projects - it explains their significance, identifies their target audience, and breaks down the technical approaches that make them successful.

## How It Works

The tool connects to GitHub's API to find repositories that match your criteria, then feeds that information to an AI system that really understands code and software development. The AI reads through each project's documentation, analyzes its structure, and creates detailed explanations that go far beyond what you'd get from just reading the repository description.

For each project, you'll get insights into the technical architecture, understand who the project is designed for, learn about real-world use cases, and discover what makes it stand out in its category. The AI even tries to explain why certain projects become popular while others don't.

## Getting Started

You'll need Node.js and Python installed on your machine, plus an API key from either OpenAI or Google (for the AI analysis part). The setup is straightforward - just clone the repository, install the dependencies, add your API key to the environment file, and you're ready to go.

The tool works in two ways: there's a web interface that's perfect for exploring and discovering projects interactively, and command-line tools if you prefer working from the terminal or want to integrate the discovery process into your own workflows.

## Installation

First, clone this repository to your local machine:

```bash
git clone https://github.com/1692775560/eko-agent-github.git
cd eko-agent-github
```

Install the required dependencies for both Node.js and Python:

```bash
npm install
pip install -r requirements.txt
```

Create your environment configuration by copying the example file:

```bash
cp .env.example .env
```

Open the `.env` file and add your API key. You'll need either an OpenAI key or a Google API key:

```
OPENAI_API_KEY=your_openai_key_here
# OR
GOOGLE_API_KEY=your_google_key_here
```

Build the TypeScript components:

```bash
npm run build
```

Now you're ready to start discovering projects! Launch the web interface with:

```bash
npm run main
```

This will start a local server at `http://localhost:7861` where you can interact with the tool through a clean, intuitive web interface.

## Using the Tool

The web interface has two main modes. The "High-Star Discovery" tab lets you find the most popular projects on GitHub by setting a minimum star count and optionally filtering by programming language. The "Topic Search" tab is great when you're interested in a specific area - just type in something like "artificial intelligence" or "web development" and it'll find relevant projects.

If you prefer working from the command line, you can also run discovery directly from your terminal. For example, to find Python projects with over 1000 stars:

```bash
npm run discover -- discover 1000 Python
```

Or to search for machine learning projects:

```bash
npm run discover -- search "machine learning" 500
```

The tool will create JSON files with all the discovered project data, which you can then enhance with more detailed AI analysis:

```bash
npm run enhance -- enhance-all
```

## What You'll Get

Each project analysis includes a comprehensive breakdown that goes well beyond the basic GitHub information. The AI examines the project's technical approach, identifies the specific problems it solves, and explains why it resonates with developers. You'll understand not just what the project does, but why it matters and how it fits into the broader ecosystem.

The analysis covers practical use cases, target audiences, and the technical decisions that make each project unique. For popular projects, you'll also get insights into the factors that contributed to their success - whether it's exceptional documentation, innovative architecture, strong community support, or solving a particularly pressing problem.

## Example Output

Here's what you might see when analyzing a popular project like TensorFlow:

```json
{
  "name": "tensorflow",
  "stars": 185000,
  "language": "C++",
  "description": "An Open Source Machine Learning Framework for Everyone",
  "summary": "TensorFlow democratizes machine learning by providing a comprehensive platform that works across different devices and scales from research prototypes to production systems. Its flexible architecture allows developers to deploy computation to CPUs, GPUs, or TPUs with minimal code changes.",
  "enhanced_analysis": "TensorFlow represents a paradigm shift in making machine learning accessible to both researchers and production engineers. Its computational graph approach and automatic differentiation make complex neural network training manageable, while its ecosystem of tools addresses the entire ML pipeline from data preparation to model deployment.",
  "use_cases": ["Production ML models", "Research experimentation", "Mobile deployment", "Distributed training"],
  "target_audience": "ML engineers, researchers, data scientists, and production teams",
  "popularity_reasons": "Google's backing, comprehensive ecosystem, production-ready architecture, and extensive documentation make it the go-to choice for serious ML projects"
}
```

## Technical Details

The project is built with TypeScript and uses the Eko AI framework to create intelligent agents that can interact with both GitHub's API and various AI services. The web interface is powered by Gradio, which makes it easy to create shareable, interactive applications.

Under the hood, there are two main agents: one handles the initial discovery and data collection from GitHub, while the other focuses on the AI-powered analysis and enhancement. This separation allows you to run discovery independently of analysis, which is useful when you want to collect data quickly and analyze it later.

The system respects GitHub's API rate limits and includes error handling for common issues. All the AI analysis happens through official APIs (OpenAI or Google), so you maintain control over your API usage and costs.

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit pull requests. The codebase is well-structured and documented, making it relatively straightforward to add new features or improve existing functionality.

Some areas where contributions would be particularly welcome include adding support for additional AI providers, implementing caching to reduce API calls, or creating new analysis templates for different types of projects.

## Troubleshooting

If you run into GitHub API rate limits, the easiest solution is to add a GitHub personal access token to your `.env` file. This increases your rate limit significantly and is free for personal use.

For AI API issues, make sure your API key is correctly set in the environment file and that you have sufficient credits or quota remaining with your chosen provider.

If the web interface doesn't start properly, check that port 7861 isn't already in use by another application. You can modify the port in the `main.py` file if needed.

## License

This project is open source and available under the MIT License, which means you're free to use, modify, and distribute it as you see fit.


---

**Built with the [Eko AI Framework](https://github.com/ekoinc/eko) - Making AI agents accessible to everyone**





**⭐ Star this repository if you find it useful!**

Made with ❤️ using [Eko AI Framework]([https://github.com/ekoinc/eko](https://github.com/FellouAI/eko)

</div>




This project is open source and available under the MIT License.

## Troubleshooting

### Common Issues

**API Rate Limits**: If you encounter GitHub API rate limits, wait a few minutes before retrying.

**Missing API Keys**: Ensure your `.env` file contains valid API keys for OpenAI or Google Gemini.

**Build Errors**: Run `npm run clean` and then `npm run build` to rebuild the project.

**Port Conflicts**: If the Gradio app fails to start, check if port 7860 is available or modify the port in `mian.py`.

## Support

For issues and questions, please create an issue in the repository or contact the maintainers.
