// Category configuration with colors and icons
export const categoryConfig: Record<string, { color: string; icon: string; bgColor: string }> = {
  Development: { color: '#3b82f6', icon: '💻', bgColor: '#dbeafe' },
  Marketing: { color: '#ec4899', icon: '📢', bgColor: '#fce7f3' },
  Design: { color: '#8b5cf6', icon: '🎨', bgColor: '#ede9fe' },
  Research: { color: '#10b981', icon: '🔬', bgColor: '#d1fae5' },
  Operations: { color: '#f59e0b', icon: '⚙️', bgColor: '#fef3c7' },
  uncategorized: { color: '#6b7280', icon: '📁', bgColor: '#f3f4f6' },
};

export function getCategoryStyle(category: string) {
  return categoryConfig[category] || categoryConfig.uncategorized;
}

export function getSimilarityColor(score: number): string {
  if (score >= 0.7) return "#10b981"; // Green
  if (score >= 0.4) return "#3b82f6"; // Blue
  return "#6b7280"; // Gray
}
