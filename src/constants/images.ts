// B&W running athlete images from Unsplash (free to use)
// CSS filter: grayscale(1) applied via Tailwind's grayscale class
export const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1461896836934-bd45ba7b0949?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop&q=80',
] as const

export const LOGIN_HERO =
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=800&fit=crop&q=80'

export const DASHBOARD_HERO =
  'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800&h=500&fit=crop&q=80'

export const UPLOAD_HERO =
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=400&fit=crop&q=80'

export const EVENT_IMAGES = [
  'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1486218119243-13883505764c?w=600&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1461896836934-bd45ba7b0949?w=600&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?w=600&h=400&fit=crop&q=80',
] as const

export function getEventImage(index: number): string {
  return EVENT_IMAGES[index % EVENT_IMAGES.length]
}
