// LocalStorage Utils for storing and retrieving generated specs

const STORAGE_KEY = 'taskGeneratorSpecs';
const MAX_SPECS = 5;

export function getRecentSpecs() {
  if (typeof window === 'undefined') return [];
  
  try {
    const specs = localStorage.getItem(STORAGE_KEY);
    return specs ? JSON.parse(specs) : [];
  } catch (error) {
    console.error('Error reading specs from localStorage:', error);
    return [];
  }
}

export function saveSpec(spec) {
  if (typeof window === 'undefined') return;

  try {
    const existing = getRecentSpecs();
    const updated = [
      {
        ...spec,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      },
      ...existing,
    ].slice(0, MAX_SPECS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving spec to localStorage:', error);
  }
}

export function deleteSpec(specId) {
  if (typeof window === 'undefined') return;

  try {
    const existing = getRecentSpecs();
    const updated = existing.filter(spec => spec.id !== specId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error deleting spec from localStorage:', error);
  }
}

export function exportAsMarkdown(spec) {
  let markdown = `# Task Spec: ${spec.goal}\n\n`;
  markdown += `**Generated:** ${new Date(spec.createdAt).toLocaleString()}\n\n`;
  markdown += `## Feature Goal\n${spec.goal}\n\n`;
  markdown += `## Target Users\n${spec.users}\n\n`;
  markdown += `## Constraints\n${spec.constraints}\n\n`;

  if (spec.data) {
    if (spec.data.userStories && spec.data.userStories.length > 0) {
      markdown += `## User Stories\n`;
      spec.data.userStories.forEach(story => {
        markdown += `### ${story.id}: ${story.title}\n`;
        markdown += `**Priority:** ${story.priority}\n`;
        markdown += `${story.description}\n\n`;
      });
    }

    if (spec.data.engineeringTasks && spec.data.engineeringTasks.length > 0) {
      markdown += `## Engineering Tasks\n`;
      spec.data.engineeringTasks.forEach(task => {
        markdown += `### ${task.id}: ${task.title}\n`;
        markdown += `**Priority:** ${task.priority}\n`;
        markdown += `**Estimated Hours:** ${task.estimatedHours}\n`;
        markdown += `${task.description}\n\n`;
      });
    }

    if (spec.data.risks && spec.data.risks.length > 0) {
      markdown += `## Risks & Unknowns\n`;
      spec.data.risks.forEach(risk => {
        markdown += `### ${risk.id}: ${risk.title}\n`;
        markdown += `**Severity:** ${risk.severity}\n`;
        markdown += `${risk.description}\n`;
        markdown += `**Mitigation:** ${risk.mitigation}\n\n`;
      });
    }
  }

  return markdown;
}

export function exportAsText(spec) {
  let text = `TASK SPEC: ${spec.goal}\n`;
  text += `Generated: ${new Date(spec.createdAt).toLocaleString()}\n`;
  text += `${'='.repeat(50)}\n\n`;

  text += `FEATURE GOAL\n${'-'.repeat(20)}\n${spec.goal}\n\n`;
  text += `TARGET USERS\n${'-'.repeat(20)}\n${spec.users}\n\n`;
  text += `CONSTRAINTS\n${'-'.repeat(20)}\n${spec.constraints}\n\n`;

  if (spec.data) {
    if (spec.data.userStories && spec.data.userStories.length > 0) {
      text += `USER STORIES\n${'-'.repeat(20)}\n`;
      spec.data.userStories.forEach(story => {
        text += `[${story.id}] ${story.title} (${story.priority})\n`;
        text += `${story.description}\n\n`;
      });
    }

    if (spec.data.engineeringTasks && spec.data.engineeringTasks.length > 0) {
      text += `ENGINEERING TASKS\n${'-'.repeat(20)}\n`;
      spec.data.engineeringTasks.forEach(task => {
        text += `[${task.id}] ${task.title} (${task.priority})\n`;
        text += `Hours: ${task.estimatedHours} | ${task.description}\n\n`;
      });
    }

    if (spec.data.risks && spec.data.risks.length > 0) {
      text += `RISKS & UNKNOWNS\n${'-'.repeat(20)}\n`;
      spec.data.risks.forEach(risk => {
        text += `[${risk.id}] ${risk.title} (${risk.severity})\n`;
        text += `${risk.description}\n`;
        text += `Mitigation: ${risk.mitigation}\n\n`;
      });
    }
  }

  return text;
}

export function downloadFile(content, filename, mimeType = 'text/plain') {
  if (typeof window === 'undefined') return;

  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
